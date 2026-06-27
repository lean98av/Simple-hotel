import { Router, Response, NextFunction } from 'express';
import adminAnnouncementController from '../controllers/adminAnnouncementController';
import { Request } from 'express';
import Announcement from '../models/announcement';
import { adminAuthMiddleware, adminAuthPostMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Middleware de autenticación para rutas protegidas

// Anuncios routes
router.get('/', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminAnnouncementController.adminAnnouncements(req, res, next);
});

router.get('/create', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const announcements = await Announcement.findAll();
  await res.render('admin/createEditAnnouncement', {
    title: 'Crear Anuncio',
    announcement: null,
    announcements,
  });
});

router.get('/:id/edit', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await adminAnnouncementController.getEditAnnouncement(req, res, next);
});

router.get('/:id', adminAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await adminAnnouncementController.getAnnouncement(req, res, next);
});

router.post(
  '/',
  adminAuthMiddleware,
  adminAnnouncementController.upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    await adminAnnouncementController.createAnnouncement(req, res, next);
  }
);

router.put(
  ('/:id'),
  adminAuthMiddleware,
  adminAnnouncementController.upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    await adminAnnouncementController.editAnnouncement(req, res, next);
  }
);

router.delete('/:id/deleteImage', async (req: Request, res: Response, next: NextFunction) => {
  await adminAnnouncementController.deleteAnnouncementImage(req, res, next);
});

router.delete('/:id', adminAuthPostMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await adminAnnouncementController.deleteAnnouncement(req, res, next);
});

export default router;
