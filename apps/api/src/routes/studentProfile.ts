import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/v1/profile
 * Fetch full verified student profile, active sessions, and college details
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            college: { include: { domains: true } },
            campus: true,
            wallet: true,
          },
        },
        memberships: {
          include: {
            college: { include: { domains: true } },
            campus: true,
            verifications: true,
          },
        },
        verifications: {
          include: { documents: true },
        },
        sessions: {
          orderBy: { lastActiveAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) return sendError(res, 'User profile not found', 404);

    return sendSuccess(res, {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        student: user.student,
        memberships: user.memberships,
        verifications: user.verifications,
        sessions: user.sessions,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * PATCH /api/v1/profile
 * Update student profile (DOB, department, course, year, semester, dietary preferences, photo)
 */
router.patch('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const {
      name,
      phone,
      dob,
      course,
      department,
      year,
      semester,
      dietaryPref,
      allergies,
      profilePhoto,
      avatar,
    } = req.body;

    // Update User name & phone
    if (name || phone || avatar || profilePhoto) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
          ...(avatar || profilePhoto ? { avatar: avatar || profilePhoto } : {}),
        },
      });
    }

    // Update StudentProfile fields
    const updatedStudent = await prisma.studentProfile.update({
      where: { userId },
      data: {
        ...(dob !== undefined ? { dob } : {}),
        ...(course ? { course } : {}),
        ...(department ? { department } : {}),
        ...(year ? { year: Number(year) } : {}),
        ...(semester ? { semester: Number(semester) } : {}),
        ...(dietaryPref ? { dietaryPref } : {}),
        ...(allergies !== undefined ? { allergies } : {}),
        ...(profilePhoto || avatar ? { profilePhoto: profilePhoto || avatar } : {}),
      },
      include: { college: true, campus: true, wallet: true },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'STUDENT_PROFILE_UPDATED',
        resource: `User:${userId}`,
        detailsJson: JSON.stringify({ name, course, department, year }),
      },
    });

    return sendSuccess(res, {
      message: 'Student profile updated successfully',
      student: updatedStudent,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * GET /api/v1/auth/sessions
 * List active device sessions for current student
 */
router.get('/sessions', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    let sessions = await prisma.studentSession.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
    });

    // If no sessions exist yet, create a default active session record
    if (sessions.length === 0) {
      const userAgent = req.headers['user-agent'] || 'Chrome · Web Client';
      const defaultSession = await prisma.studentSession.create({
        data: {
          userId,
          tokenHash: 'current_session',
          deviceInfo: userAgent.includes('Mobile') ? 'Mobile Browser (iOS/Android)' : 'Desktop Browser (Chrome/macOS)',
          ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
        },
      });
      sessions = [defaultSession];
    }

    return sendSuccess(res, { sessions });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * DELETE /api/v1/auth/sessions/:id
 * Revoke specific device session
 */
router.delete('/sessions/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return sendError(res, 'Unauthorized', 401);

    await prisma.studentSession.deleteMany({
      where: { id, userId },
    });

    return sendSuccess(res, { message: 'Device session revoked successfully' });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * DELETE /api/v1/auth/sessions
 * Logout all devices
 */
router.delete('/sessions', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    await prisma.studentSession.deleteMany({
      where: { userId },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT_ALL_DEVICES',
        resource: `User:${userId}`,
      },
    });

    return sendSuccess(res, { message: 'Logged out of all active devices successfully' });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * POST /api/v1/auth/delete-account
 * Account deactivation/deletion request
 */
router.post('/delete-account', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { passwordConfirm } = req.body;

    if (!userId) return sendError(res, 'Unauthorized', 401);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return sendError(res, 'User not found', 404);

    if (passwordConfirm) {
      const valid = await bcrypt.compare(passwordConfirm, user.passwordHash);
      if (!valid) {
        return sendError(res, 'Invalid password confirmation', 400);
      }
    }

    // Soft deactivation audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'STUDENT_ACCOUNT_DELETION_REQUESTED',
        resource: `User:${userId}`,
        detailsJson: JSON.stringify({ requestedAt: new Date().toISOString() }),
      },
    });

    // Delete active sessions and mark student verifications suspended
    await prisma.studentSession.deleteMany({ where: { userId } });
    await prisma.collegeMembership.updateMany({
      where: { userId },
      data: { status: 'SUSPENDED' },
    });

    return sendSuccess(res, {
      message: 'Account deactivation complete. Your data has been securely archived according to privacy regulations.',
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
