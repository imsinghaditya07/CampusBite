import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

/**
 * GET /api/v1/inventory
 * List raw ingredient inventory items with stock levels and suppliers
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { canteenId = 'campusbite-central-iitb' } = req.query;

    const canteen = await prisma.canteen.findFirst({
      where: { OR: [{ id: String(canteenId) }, { slug: String(canteenId) }] },
    });

    const ingredients = await prisma.ingredient.findMany({
      where: canteen ? { canteenId: canteen.id } : {},
      include: { supplier: true },
      orderBy: { name: 'asc' },
    });

    return sendSuccess(res, { ingredients });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * PATCH /api/v1/inventory/:id
 * Adjust ingredient stock level
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentStock, costPerUnit } = req.body;

    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        ...(currentStock !== undefined ? { currentStock: Number(currentStock) } : {}),
        ...(costPerUnit !== undefined ? { costPerUnit: Number(costPerUnit) } : {}),
      },
      include: { supplier: true },
    });

    return sendSuccess(res, { ingredient: updated });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
