import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Helper to access socket.io from app context
const getIo = (req: Request) => req.app.get('io');

/**
 * GET /api/v1/canteens
 * List all active canteen food hubs
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const canteens = await prisma.canteen.findMany({
      include: {
        college: { include: { city: true } },
        counters: true,
      },
    });

    return sendSuccess(res, { canteens });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * GET /api/v1/canteens/:slug
 * Fetch canteen hub with full 12-category menu items & details
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const canteen = await prisma.canteen.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        college: { include: { city: { include: { state: true } } } },
        categories: {
          orderBy: { displayOrder: 'asc' },
          include: {
            foodItems: {
              orderBy: { rating: 'desc' },
              include: { customizations: true },
            },
          },
        },
        counters: true,
        stations: true,
      },
    });

    if (!canteen) {
      return sendError(res, 'Canteen not found', 404);
    }

    return sendSuccess(res, { canteen });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * PATCH /api/v1/canteens/items/:id/price-availability
 * Canteen Owner edits item price & stock availability with live Socket.IO broadcast
 */
router.patch('/items/:id/price-availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { price, isAvailable } = req.body;

    const updateData: any = {};
    if (price !== undefined) updateData.price = Number(price);
    if (isAvailable !== undefined) updateData.isAvailable = Boolean(isAvailable);

    const updatedItem = await prisma.foodItem.update({
      where: { id },
      data: updateData,
      include: { category: true, canteen: true },
    });

    // Broadcast real-time update to all connected student clients
    const io = getIo(req);
    if (io) {
      io.emit('menu.item_updated', {
        id: updatedItem.id,
        price: updatedItem.price,
        isAvailable: updatedItem.isAvailable,
        canteenId: updatedItem.canteenId,
      });
    }

    return sendSuccess(res, {
      message: 'Menu item price & availability updated successfully',
      item: updatedItem,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * PATCH /api/v1/canteens/:id/status
 * Toggle canteen operational status (ACTIVE, BUSY, INACTIVE)
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, crowdLevel } = req.body;

    const updatedCanteen = await prisma.canteen.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(crowdLevel ? { crowdLevel } : {}),
      },
    });

    const io = getIo(req);
    if (io) {
      io.emit('canteen.status_changed', updatedCanteen);
    }

    return sendSuccess(res, { canteen: updatedCanteen });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
