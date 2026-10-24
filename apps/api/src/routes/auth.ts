import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { env } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to generate access & refresh token pairs
function generateTokens(user: { id: string; email: string; role: string; name: string }) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// POST /api/v1/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role = 'STUDENT', collegeId } = req.body;

    if (!email || !password || !name) {
      return sendError(res, 'Email, password, and name are required', 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError(res, 'An account with this email already exists', 409, 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: phone || '+91-9876543210',
        role,
      },
    });

    // If student, link to default campus/college
    if (role === 'STUDENT') {
      const defaultCollege = collegeId
        ? await prisma.college.findUnique({ where: { id: collegeId }, include: { campuses: true } })
        : await prisma.college.findFirst({ include: { campuses: true } });

      if (defaultCollege && defaultCollege.campuses[0]) {
        await prisma.studentProfile.create({
          data: {
            userId: user.id,
            collegeId: defaultCollege.id,
            campusId: defaultCollege.campuses[0].id,
            course: 'B.Tech Computer Science',
            year: 2,
            rollNumber: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        });
      }
    }

    const tokens = generateTokens(user);
    return sendSuccess(res, {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    }, 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true, vendor: true, staff: true },
    });

    if (!user) {
      return sendError(res, 'Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return sendError(res, 'Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = generateTokens(user);
    return sendSuccess(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        student: user.student,
        vendor: user.vendor,
        staff: user.staff,
      },
      ...tokens,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: { include: { college: true, campus: true, wallet: true } },
        vendor: { include: { canteen: true } },
        staff: { include: { canteen: true } },
      },
    });

    if (!user) return sendError(res, 'User profile not found', 404);

    return sendSuccess(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        student: user.student,
        vendor: user.vendor,
        staff: user.staff,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return sendError(res, 'Invalid refresh token', 401);

    const tokens = generateTokens(user);
    return sendSuccess(res, tokens);
  } catch (error: any) {
    return sendError(res, 'Invalid or expired refresh token', 401);
  }
});

// POST /api/v1/auth/otp/send - Send OTP simulation
router.post('/otp/send', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return sendError(res, 'Phone number required', 400);

    return sendSuccess(res, {
      message: `OTP sent to ${phone}`,
      testOtp: '2026', // Isolated test OTP for development
      expiresInSeconds: 300,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

// POST /api/v1/auth/otp/verify - Verify OTP
router.post('/otp/verify', async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return sendError(res, 'Phone and OTP are required', 400);

    if (otp === '2026' || otp === '1234') {
      let user = await prisma.user.findFirst({ where: { phone } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `student_${phone.replace(/\D/g, '')}@campusbite.in`,
            passwordHash: await bcrypt.hash('Demo@1234', 10),
            name: `Campus Student (${phone.slice(-4)})`,
            phone,
            role: 'STUDENT',
          },
        });
      }

      const tokens = generateTokens(user);
      return sendSuccess(res, { user, ...tokens });
    }

    return sendError(res, 'Invalid OTP', 400, 'INVALID_OTP');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
