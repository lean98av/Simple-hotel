import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export default {
  async home(req: Request, res: Response, next: NextFunction) {
    try {
      // Prefer the authenticated user set by middleware
      const userNameFromReq = req.adminAuth as string | undefined;
      if (userNameFromReq) {
        return res.render('admin/adminHome', {
          title: 'Admin Panel - ShopMaster',
          user: userNameFromReq,
        });
      }

      // Fallback: try token from header or cookie
      const token = req.headers.authorization?.split(' ')[1] || (req as any).cookies?.adminToken;
      const user = token ? (jwt.decode(token) as { userName: string } | null) : null;
      if (!user) {
        return res.redirect('/admin/login?error=access_denied');
      }
      res.render('admin/adminHome', {
        title: 'Admin Panel - ShopMaster',
        user: user.userName,
      });
    } catch (error) {
      next(error);
    }
  },
};
