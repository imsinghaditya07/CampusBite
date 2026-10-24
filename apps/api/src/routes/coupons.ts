import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

/**
 * POST /api/v1/coupons/validate
 * Validate coupon code against subtotal and return discount amount
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code, amount, canteenId = 'campusbite-central-iitb' } = req.body;

    if (!code) return sendError(res, 'Coupon code required', 400);

    const canteen = await prisma.canteen.findFirst({
      where: { OR: [{ id: canteenId }, { slug: canteenId }] },
    });

    let coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        ...(canteen ? { canteenId: canteen.id } : {}),
        isActive: true,
      },
    });

    if (!coupon && code.toUpperCase() === 'WELCOME50') {
      coupon = {
        id: 'coupon-welcome50',
        canteenId: canteen ? canteen.id : 'canteen-default',
        code: 'WELCOME50',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderValue: 99,
        maxDiscount: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        usageLimit: 500,
        createdAt: new Date(),
      };
    }

    if (!coupon) {
      return sendError(res, 'Invalid or expired coupon code', 404, 'COUPON_NOT_FOUND');
    }

    const subtotal = Number(amount || 0);
    if (subtotal < coupon.minOrderValue) {
      return sendError(
        res,
        `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
        400,
        'MIN_ORDER_NOT_MET'
      );
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return sendSuccess(res, {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
