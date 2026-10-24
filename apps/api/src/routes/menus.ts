import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

/**
 * GET /api/v1/menus/categories
 * List all categories across regions
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const { canteenId = 'campusbite-central-iitb' } = req.query;

    const canteen = await prisma.canteen.findFirst({
      where: { OR: [{ id: String(canteenId) }, { slug: String(canteenId) }] },
    });

    const categories = await prisma.category.findMany({
      where: canteen ? { canteenId: canteen.id } : {},
      orderBy: { displayOrder: 'asc' },
      include: { foodItems: true },
    });

    return sendSuccess(res, { categories });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * GET /api/v1/menus/items
 * List all food dishes with filtering and search
 */
router.get('/items', async (req: Request, res: Response) => {
  try {
    const { canteenId, category, isVeg, search } = req.query;

    const items = await prisma.foodItem.findMany({
      where: {
        ...(canteenId ? { canteen: { slug: String(canteenId) } } : {}),
        ...(category && category !== 'ALL' ? { category: { name: String(category) } } : {}),
        ...(isVeg !== undefined ? { isVeg: isVeg === 'true' } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: String(search) } },
                { description: { contains: String(search) } },
              ],
            }
          : {}),
      },
      include: { category: true, customizations: true },
      orderBy: { rating: 'desc' },
    });

    return sendSuccess(res, { items });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
