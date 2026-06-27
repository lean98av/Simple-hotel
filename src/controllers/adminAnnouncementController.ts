import { Request, Response, NextFunction } from 'express';
import AnnouncementImage from '../models/announcementImage';
import multer from 'multer';
import adminAnnouncementLogic from '../logic/adminAnnouncementLogic';
import adminProductLogic from '../logic/adminProductLogic';

export default {
  upload: multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: any, file: any, cb: any) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten imágenes JPG, PNG, GIF y WebP'));
      }
    },
  }),

  async adminAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const announcements = await adminAnnouncementLogic.getAllAnnouncements();

      res.render('admin/adminAnnouncements', {
        title: 'Admin - Anuncios',
        announcements,
      });
    } catch (error) {
      next(error);
    }
  },

  async getEditAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const announcement = await adminAnnouncementLogic.getAnnouncementData(id);

      if (!announcement) {
        res.status(404).json({ success: false, message: 'Anuncio no encontrado' });
        return;
      }

      res.render('admin/createEditAnnouncement', {
        title: 'Editar Anuncio',
        announcement,
      });
    } catch (error) {
      next(error);
    }
  },

  async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, startDate, endDate } = req.body;
      const files = req.files as Express.Multer.File[];

      const announcementAndFiles = await adminAnnouncementLogic.createAnnouncementData(
        name,
        description,
        startDate,
        endDate
      );

      const announcement = announcementAndFiles.announcement;

      if (files && files.length > 0) {
        const file = files[0];
        if (file && file.buffer) {
          const compressedBuffer = await adminProductLogic.compressImage(file.buffer);

          await AnnouncementImage.create({
            announcementId: announcement.id,
            file: compressedBuffer.toString('base64'),
          });
        }
      }

      res.json({ success: true, data: announcement });
    } catch (error) {
      next(error);
    }
  },

  async editAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description, startDate, endDate } = req.body;
      const files = req.files as Express.Multer.File[];

      const updatedAnnouncement = await adminAnnouncementLogic.editAnnouncementData(
        id,
        name,
        description,
        startDate,
        endDate
      );

      if (!updatedAnnouncement) {
        return res.status(404).json({ success: false, message: 'Anuncio no encontrado' });
      }

      const announcement = updatedAnnouncement;

      if (files && files.length > 0) {
        const file = files[0];
        if (file && file.buffer) {
          const compressedBuffer = await adminProductLogic.compressImage(file.buffer);

          await AnnouncementImage.destroy({ where: { announcementId: announcement.id } });

          await AnnouncementImage.create({
            announcementId: announcement.id,
            file: compressedBuffer.toString('base64'),
          });
        }
      }

      res.json({ success: true, data: announcement });
    } catch (error) {
      next(error);
    }
  },

  async getAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const announcement = await adminAnnouncementLogic.getAnnouncementData(id);

      if (!announcement) {
        res.status(404).json({ success: false, message: 'Anuncio no encontrado' });
        return;
      }

      res.json({ success: true, data: announcement });
    } catch (error) {
      next(error);
    }
  },

  async deleteAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deleted = await adminAnnouncementLogic.deleteAnnouncementData(id);

      if (!deleted) {
        res.status(404).json({ success: false, message: 'Anuncio no encontrado' });
        return;
      }

      res.json({ success: true, message: 'Anuncio eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  },

  async deleteAnnouncementImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      if (!id ) {
        return res.status(400).json({ success: false, message: 'Faltan parámetros requeridos' });
      }

      const deleted = await adminAnnouncementLogic.deleteAnnouncementImageData(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Anuncio no encontrado' });
      }

      res.json({ success: true, message: 'Imagen eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  },
};
