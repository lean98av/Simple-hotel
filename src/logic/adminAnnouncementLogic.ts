import Announcement from '../models/announcement';
import AnnouncementImage from '../models/announcementImage';
import Product from '../models/product';

export default {
    async getAllAnnouncements(): Promise<Announcement[]> {
      return Announcement.findAll({ where: { deleted: false } });
    },

    async getAnnouncementData(id: string): Promise<Announcement | null> {
      const announcement = await Announcement.findByPk(id, {
        include: [
          { model: AnnouncementImage, as: 'images', limit: 1 },
        ],
      });
      return announcement || null;
    },

    async createAnnouncementData(
      name: string,
      description: string,
      startDate: string,
      endDate: string
    ): Promise<{ announcement: Announcement; files: any[] }> {
      const announcementData = {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      };

      const announcement = await Announcement.create(announcementData);
      return { announcement, files: [] };
    },

    async editAnnouncementData(
      id: string,
      name: string,
      description: string,
      startDate: string,
      endDate: string
    ): Promise<Announcement | null> {
      const announcement = await Announcement.findByPk(id);
      if (!announcement) {
        return null;
      }

      await announcement.update({
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      return announcement;
    },

    async deleteAnnouncementData(id: string): Promise<boolean> {
      const announcement = await Announcement.findByPk(id);

      if (!announcement) {
        return false;
      }

      // Eliminar imágenes asociadas al anuncio
      await AnnouncementImage.destroy({ where: { announcementId: announcement.id } });

      await announcement.update({ deleted: true }, { where: { id: announcement.id } });

      return true;
    },

    async deleteAnnouncementImageData(id: string): Promise<boolean> {
      const announcementId = parseInt(id);

      const announcement = await Announcement.findByPk(announcementId);
      if (!announcement) {
        return false;
      }

      await AnnouncementImage.destroy({ where: { announcementId } });

      return true;
    },
};
