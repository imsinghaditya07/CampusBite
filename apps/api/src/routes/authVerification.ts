import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /api/v1/auth/college-email/send
 * Validate institutional email domain against selected college & send 6-digit OTP
 */
router.post('/college-email/send', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { institutionalEmail, collegeId } = req.body;

    if (!userId) return sendError(res, 'Unauthorized', 401);
    if (!institutionalEmail || !collegeId) {
      return sendError(res, 'Institutional email and college ID are required', 400);
    }

    // Extract domain from email (e.g. student@iitb.ac.in -> iitb.ac.in)
    const emailParts = institutionalEmail.trim().toLowerCase().split('@');
    if (emailParts.length !== 2) {
      return sendError(res, 'Invalid institutional email format', 400);
    }
    const domain = emailParts[1];

    // Verify college exists and domain is registered for this college
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: { domains: true, campuses: true },
    });

    if (!college) {
      return sendError(res, 'Selected college not found', 404);
    }

    const matchedDomain = college.domains.find(
      (d) => d.isActive && (d.domain.toLowerCase() === domain || domain.endsWith(`.${d.domain.toLowerCase()}`))
    );

    if (!matchedDomain) {
      return sendError(
        res,
        `Domain @${domain} does not belong to ${college.name}. Please enter your official institutional email (e.g. @${college.domains[0]?.domain || 'college.ac.in'}).`,
        400,
        'DOMAIN_MISMATCH'
      );
    }

    // Generate 6-digit OTP code & hash
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(rawOtp, 8);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // Invalidate prior OTPs
    await prisma.otpVerification.deleteMany({
      where: { userId, email: institutionalEmail, purpose: 'EMAIL_VERIFICATION' },
    });

    await prisma.otpVerification.create({
      data: {
        userId,
        email: institutionalEmail,
        purpose: 'EMAIL_VERIFICATION',
        codeHash,
        expiresAt,
      },
    });

    // Create or update StudentProfile institutional email
    await prisma.studentProfile.updateMany({
      where: { userId },
      data: { institutionalEmail },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'COLLEGE_EMAIL_OTP_SENT',
        resource: `College:${collegeId}`,
        detailsJson: JSON.stringify({ institutionalEmail, collegeName: college.name }),
      },
    });

    return sendSuccess(res, {
      message: `Verification code sent to ${institutionalEmail}`,
      testOtp: rawOtp, // Provided for easy development testing
      expiresInSeconds: 900,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * POST /api/v1/auth/college-email/verify
 * Verify 6-digit OTP for institutional email & update verification state
 */
router.post('/college-email/verify', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { institutionalEmail, otp, collegeId, campusId, rollNumber } = req.body;

    if (!userId) return sendError(res, 'Unauthorized', 401);
    if (!institutionalEmail || !otp || !collegeId) {
      return sendError(res, 'Email, OTP, and college ID are required', 400);
    }

    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        userId,
        email: institutionalEmail,
        purpose: 'EMAIL_VERIFICATION',
        verifiedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return sendError(res, 'No pending verification code found for this email', 404);
    }

    if (new Date() > otpRecord.expiresAt) {
      return sendError(res, 'Verification code has expired. Please request a new code.', 400, 'OTP_EXPIRED');
    }

    if (otpRecord.attemptCount >= 5) {
      return sendError(res, 'Maximum verification attempts exceeded. Request a new OTP.', 400, 'MAX_ATTEMPTS');
    }

    const isValid = await bcrypt.compare(otp, otpRecord.codeHash);
    if (!isValid) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attemptCount: { increment: 1 } },
      });
      return sendError(res, 'Invalid verification code. Please check and try again.', 400, 'INVALID_OTP');
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() },
    });

    // Ensure Campus selection
    const targetCampusId = campusId || (await prisma.campus.findFirst({ where: { collegeId } }))?.id;

    if (!targetCampusId) {
      return sendError(res, 'Campus invalid or not found for selected college', 400);
    }

    // Find or create CollegeMembership
    let membership = await prisma.collegeMembership.findFirst({
      where: { userId, collegeId },
    });

    if (!membership) {
      membership = await prisma.collegeMembership.create({
        data: {
          userId,
          collegeId,
          campusId: targetCampusId,
          studentId: rollNumber || `STUDENT-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'ACTIVE',
          verifiedAt: new Date(),
          verificationMethod: 'COLLEGE_EMAIL',
        },
      });
    } else {
      membership = await prisma.collegeMembership.update({
        where: { id: membership.id },
        data: {
          campusId: targetCampusId,
          studentId: rollNumber || membership.studentId,
          status: 'ACTIVE',
          verifiedAt: new Date(),
        },
      });
    }

    // Find or create StudentVerification
    let verification = await prisma.studentVerification.findFirst({
      where: { userId, collegeMembershipId: membership.id },
    });

    if (!verification) {
      verification = await prisma.studentVerification.create({
        data: {
          userId,
          collegeMembershipId: membership.id,
          emailVerified: true,
          status: 'EMAIL_VERIFIED',
          verificationMethod: 'EMAIL',
        },
      });
    } else {
      verification = await prisma.studentVerification.update({
        where: { id: verification.id },
        data: {
          emailVerified: true,
          status: verification.idCardVerified ? 'COLLEGE_VERIFIED' : 'EMAIL_VERIFIED',
        },
      });
    }

    // Update StudentProfile
    await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        collegeId,
        campusId: targetCampusId,
        institutionalEmail,
        ...(rollNumber ? { rollNumber } : {}),
      },
      create: {
        userId,
        collegeId,
        campusId: targetCampusId,
        institutionalEmail,
        rollNumber: rollNumber || `STUDENT-${Math.floor(1000 + Math.random() * 9000)}`,
        course: 'B.Tech Computer Science',
        year: 2,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'COLLEGE_EMAIL_VERIFIED',
        resource: `Membership:${membership.id}`,
        detailsJson: JSON.stringify({ collegeId, institutionalEmail }),
      },
    });

    return sendSuccess(res, {
      message: 'Institutional email verified successfully!',
      membership,
      verification,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * POST /api/v1/verification/id-card
 * Upload College ID card image/PDF & submit for review
 */
router.post('/id-card', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { collegeId, studentIdNumber, cardImageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!userId) return sendError(res, 'Unauthorized', 401);
    if (!collegeId || !cardImageBase64) {
      return sendError(res, 'College ID and ID card image are required', 400);
    }

    // Validate membership
    let membership = await prisma.collegeMembership.findFirst({
      where: { userId, collegeId },
    });

    if (!membership) {
      const defaultCampus = await prisma.campus.findFirst({ where: { collegeId } });
      membership = await prisma.collegeMembership.create({
        data: {
          userId,
          collegeId,
          campusId: defaultCampus?.id || '',
          studentId: studentIdNumber || `ST-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'PENDING',
        },
      });
    }

    // Find or create verification record
    let verification = await prisma.studentVerification.findFirst({
      where: { userId, collegeMembershipId: membership.id },
    });

    if (!verification) {
      verification = await prisma.studentVerification.create({
        data: {
          userId,
          collegeMembershipId: membership.id,
          status: 'UNDER_REVIEW',
          verificationMethod: 'EMAIL_AND_ID',
        },
      });
    }

    // Create Verification Document record
    const storageKey = `id_cards/${userId}_${Date.now()}.jpg`;
    const doc = await prisma.verificationDocument.create({
      data: {
        verificationId: verification.id,
        type: 'COLLEGE_ID_CARD',
        storageKey,
        fileUrl: cardImageBase64.startsWith('data:') ? cardImageBase64 : `data:${mimeType};base64,${cardImageBase64}`,
        mimeType,
        fileSize: Math.round(cardImageBase64.length * 0.75),
        status: 'PENDING',
      },
    });

    // Auto-verify if email is verified, or mark UNDER_REVIEW for manual review
    const isAutoVerified = verification.emailVerified;
    const newStatus = isAutoVerified ? 'COLLEGE_VERIFIED' : 'UNDER_REVIEW';

    verification = await prisma.studentVerification.update({
      where: { id: verification.id },
      data: {
        idCardVerified: true,
        status: newStatus,
        reviewedAt: isAutoVerified ? new Date() : null,
      },
    });

    await prisma.collegeMembership.update({
      where: { id: membership.id },
      data: {
        studentId: studentIdNumber || membership.studentId,
        status: isAutoVerified ? 'ACTIVE' : 'PENDING',
        verifiedAt: isAutoVerified ? new Date() : null,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'COLLEGE_ID_CARD_SUBMITTED',
        resource: `Verification:${verification.id}`,
        detailsJson: JSON.stringify({ studentIdNumber, isAutoVerified }),
      },
    });

    return sendSuccess(res, {
      message: isAutoVerified
        ? 'College ID card verified successfully!'
        : 'College ID card uploaded and submitted for review.',
      verification,
      document: { id: doc.id, type: doc.type, status: doc.status },
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * GET /api/v1/verification/status
 * Get current verification status & college memberships
 */
router.get('/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: { include: { college: { include: { domains: true } }, campus: true } },
        memberships: { include: { college: { include: { domains: true } }, campus: true, verifications: true } },
        verifications: { include: { documents: true, membership: { include: { college: true } } } },
      },
    });

    if (!user) return sendError(res, 'User not found', 404);

    const activeMembership = user.memberships.find((m) => m.status === 'ACTIVE') || user.memberships[0];
    const latestVerification = user.verifications[user.verifications.length - 1];

    const status = latestVerification?.status || (activeMembership ? 'COLLEGE_VERIFIED' : 'UNVERIFIED');

    return sendSuccess(res, {
      isVerified: status === 'COLLEGE_VERIFIED' || status === 'EMAIL_VERIFIED',
      verificationStatus: status,
      activeMembership,
      memberships: user.memberships,
      verifications: user.verifications,
      studentProfile: user.student,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * POST /api/v1/memberships/:id/switch
 * Switch active verified college membership
 */
router.post('/memberships/:id/switch', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return sendError(res, 'Unauthorized', 401);

    const membership = await prisma.collegeMembership.findFirst({
      where: { id, userId, status: 'ACTIVE' },
      include: { college: true, campus: true },
    });

    if (!membership) {
      return sendError(res, 'Verified active college membership not found or not active', 403, 'MEMBERSHIP_UNAUTHORIZED');
    }

    // Update StudentProfile active college & campus
    await prisma.studentProfile.updateMany({
      where: { userId },
      data: {
        collegeId: membership.collegeId,
        campusId: membership.campusId,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'COLLEGE_MEMBERSHIP_SWITCHED',
        resource: `College:${membership.collegeId}`,
        detailsJson: JSON.stringify({ collegeName: membership.college.name }),
      },
    });

    return sendSuccess(res, {
      message: `Switched active campus context to ${membership.college.name}`,
      activeMembership: membership,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
