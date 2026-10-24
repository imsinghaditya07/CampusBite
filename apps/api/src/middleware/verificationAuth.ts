import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { prisma } from '../prisma';
import { sendError } from '../utils/response';

/**
 * Middleware: Enforce Verified College Membership
 * Checks that the authenticated user possesses an ACTIVE/COLLEGE_VERIFIED membership
 * for the requested college or canteen. Prevents tenant escape & IDOR vulnerabilities.
 */
export async function requireCollegeVerification(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHENTICATED');
    }

    // Super Admin, College Admin, Canteen Owner, and Kitchen Staff bypass student membership check
    if (['SUPER_ADMIN', 'COLLEGE_ADMIN', 'CANTEEN_OWNER', 'KITCHEN_STAFF'].includes(user.role)) {
      return next();
    }

    // Extract target collegeId or canteenId from params or body
    const collegeId = req.params.collegeId || req.body.collegeId;
    const canteenId = req.params.canteenId || req.body.canteenId;

    let targetCollegeId = collegeId;

    if (!targetCollegeId && canteenId) {
      const canteen = await prisma.canteen.findUnique({
        where: { id: canteenId },
        select: { collegeId: true },
      });
      if (canteen) targetCollegeId = canteen.collegeId;
    }

    // If no target college specified in request, fallback to student's active profile college
    if (!targetCollegeId) {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
        select: { collegeId: true },
      });
      targetCollegeId = studentProfile?.collegeId;
    }

    if (!targetCollegeId) {
      return sendError(
        res,
        'No target college specified. Complete college selection & verification first.',
        400,
        'NO_COLLEGE_CONTEXT'
      );
    }

    // Check active verified membership in database
    const membership = await prisma.collegeMembership.findFirst({
      where: {
        userId: user.id,
        collegeId: targetCollegeId,
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      return sendError(
        res,
        'Access denied. You do not hold an active verified student membership for this college campus.',
        403,
        'UNVERIFIED_COLLEGE_ACCESS'
      );
    }

    // Attach membership context to request
    (req as any).collegeMembership = membership;
    return next();
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}
