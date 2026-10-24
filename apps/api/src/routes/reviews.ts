import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

/**
 * POST /api/v1/reviews
 * Submit food dish and canteen service review
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { orderId, studentId, canteenId, foodRating, serviceRating, comment } = req.body;

    if (!orderId || !foodRating || !serviceRating) {
      return sendError(res, 'Order ID, food rating, and service rating are required', 400);
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return sendError(res, 'Order not found', 404);

    const user = await prisma.user.findFirst();

    const review = await prisma.review.create({
      data: {
        orderId,
        studentId: user ? user.id : 'student-1',
        canteenId: order.canteenId,
        foodRating: Number(foodRating),
        serviceRating: Number(serviceRating),
        comment,
      },
    });

    return sendSuccess(res, { review }, 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * POST /api/v1/complaints
 * File a complaint regarding order issues
 */
router.post('/complaints', async (req: Request, res: Response) => {
  try {
    const { orderId, category = 'QUALITY', description } = req.body;

    if (!orderId || !description) {
      return sendError(res, 'Order ID and complaint description are required', 400);
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return sendError(res, 'Order not found', 404);

    const user = await prisma.user.findFirst();

    const complaint = await prisma.complaint.create({
      data: {
        orderId,
        studentId: user ? user.id : 'student-1',
        canteenId: order.canteenId,
        category,
        description,
        status: 'OPEN',
      },
    });

    return sendSuccess(res, { complaint }, 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
