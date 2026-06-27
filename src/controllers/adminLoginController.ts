import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'shopmaster-secret-key-change-in-prod';

export default {
  async loginPage(req: Request, res: Response, next: NextFunction) {
    res.render('admin/adminLogin', {
      title: 'Iniciar Sesión - ShopMaster',
    });
  },

  async loginPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, pass } = req.body;

      const userStr = String(user);
      const passStr = String(pass);

      if (!userStr || !passStr) {
        res.render('admin/adminLogin', {
          title: 'Iniciar Sesión - ShopMaster',
          error: 'Faltan campos requeridos',
        });
        return;
      }

      const userRecord = await User.findOne({ where: { userName: userStr } });

      if (!userRecord) {
        res.render('admin/adminLogin', {
          title: 'Iniciar Sesión - ShopMaster',
          error: 'Usuario no encontrado',
        });
        return;
      }

      const isPasswordValid = passStr === userRecord.password;

      if (!isPasswordValid) {
        res.render('admin/adminLogin', {
          title: 'Iniciar Sesión - ShopMaster',
          error: 'Contraseña incorrecta',
        });
        return;
      }

      const token = jwt.sign(
        { userName: userRecord.userName },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set cookie so server-rendered navigations can include the token
      try {
        res.cookie('adminToken', token, {
          maxAge: 24 * 3600 * 1000,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
      } catch (e) {
        console.error('No se pudo setear cookie de token:', e);
      }

      res.json({ success: true, token });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1] || (req as any).cookies?.adminToken;
      if (token) {
        try {
          jwt.verify(token, JWT_SECRET);
        } catch (err) {
          // Token inválido
        }
      }

      // Clear cookie on logout
      try {
        res.clearCookie('adminToken');
      } catch (e) {
        console.error('No se pudo limpiar cookie:', e);
      }

      return res.redirect('/admin/login?error=logout');
    } catch (error) {
      next(error);
    }
  },
};
