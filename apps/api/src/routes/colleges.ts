import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

/**
 * GET /api/v1/colleges
 * List all onboarding colleges with city, state & geo coordinates
 */
router.get('/colleges', async (req: Request, res: Response) => {
  try {
    const { state, search } = req.query;

    const colleges = await prisma.college.findMany({
      where: {
        ...(state && state !== 'ALL' ? { city: { state: { name: String(state) } } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: String(search) } },
                { code: { contains: String(search) } },
                { city: { name: { contains: String(search) } } },
              ],
            }
          : {}),
      },
      include: {
        city: { include: { state: true } },
        university: true,
        campuses: { include: { canteens: true } },
      },
      orderBy: { name: 'asc' },
    });

    return sendSuccess(res, { colleges });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * GET /api/v1/colleges/:id
 * Get single college details
 */
router.get('/colleges/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        city: { include: { state: true } },
        university: true,
        campuses: { include: { canteens: true } },
      },
    });

    if (!college) return sendError(res, 'College not found', 404);

    return sendSuccess(res, { college });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * POST /api/v1/colleges/custom
 * Register a user-typed Indian college and set it active
 */
router.post('/colleges/custom', async (req: Request, res: Response) => {
  try {
    const { name, cityName = 'New Delhi', stateName = 'Delhi NCR', latitude = 28.545, longitude = 77.1926 } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 'College name is required', 400);
    }

    // Resolve or create State & City
    let state = await prisma.state.findFirst({ where: { name: stateName } });
    if (!state) {
      state = await prisma.state.create({
        data: { name: stateName, code: stateName.substring(0, 2).toUpperCase() },
      });
    }

    let city = await prisma.city.findFirst({
      where: { name: cityName, stateId: state.id },
    });
    if (!city) {
      city = await prisma.city.create({
        data: { name: cityName, stateId: state.id },
      });
    }

    // Resolve or create University
    let university = await prisma.university.findFirst({ where: { cityId: city.id } });
    if (!university) {
      university = await prisma.university.create({
        data: { name: `${name} University`, shortName: name.substring(0, 6).toUpperCase(), cityId: city.id },
      });
    }

    // Create College
    const code = `COL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const college = await prisma.college.create({
      data: {
        name,
        code,
        universityId: university.id,
        cityId: city.id,
        address: `${name}, ${cityName}, ${stateName}`,
        latitude: Number(latitude),
        longitude: Number(longitude),
        campuses: {
          create: {
            name: 'Main Campus',
          },
        },
      },
      include: {
        city: { include: { state: true } },
        campuses: true,
      },
    });

    return sendSuccess(res, { college }, 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

/**
 * GET /api/v1/locations/states
 */
router.get('/locations/states', async (req: Request, res: Response) => {
  try {
    const states = await prisma.state.findMany({
      include: { cities: true },
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, { states });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
});

export default router;
