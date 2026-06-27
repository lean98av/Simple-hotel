import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      adminAuth?: string;
    }
  }
}

/**
 * Middleware para verificar autenticación del administrador
 * Lee el token del Authorization header y lo verifica con JWT
 */
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const JWT_SECRET = process.env.JWT_SECRET || 'gossip-cases-secret-key-change-in-prod';
  const authHeader = req.headers.authorization;
  // Allow token via Authorization header, cookie, query param or body (fallbacks)
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  const tokenFromCookie = (req as any).cookies?.adminToken as string | undefined;
  // Legacy fallback: some older client code used `pass` query/body parameter
  const tokenFromPassQuery = req.query?.pass as string | undefined;
  const tokenFromPassBody = (req as any).body?.pass as string | undefined;
  const tokenFromQuery = req.query?.token as string | undefined;
  const tokenFromBody = (req as any).body?.token as string | undefined;

  // Respect modern token fields first, then fallback to legacy `pass`
  const token = tokenFromHeader || tokenFromCookie || tokenFromQuery || tokenFromBody || tokenFromPassQuery || tokenFromPassBody;

  if (!token) {
    console.warn('[authMiddleware] No token found in header/cookie/query/body (checked header, cookie, token, pass)');
    res.redirect('/admin/login?error=access_denied');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userName: string };
    console.log('[authMiddleware] token source ok, userName=', decoded.userName);
    req.adminAuth = decoded.userName;
    next();
  } catch (error) {
    console.warn('[authMiddleware] token verification failed:', (error as Error).message);
    res.redirect('/admin/login?error=access_denied');
  }
}

/**
 * Middleware opcional para verificar autenticación en POST requests
 * Lee el token del Authorization header y lo verifica con JWT
 */
export function adminAuthPostMiddleware(req: Request, res: Response, next: NextFunction): void {
  const JWT_SECRET = process.env.JWT_SECRET || 'gossip-cases-secret-key-change-in-prod';
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  const tokenFromCookie = (req as any).cookies?.adminToken as string | undefined;
  // Legacy fallback for POSTs using 'pass'
  const tokenFromPassBody = (req as any).body?.pass as string | undefined;
  const tokenFromBody = (req as any).body?.token as string | undefined;

  const token = tokenFromHeader || tokenFromCookie || tokenFromBody || tokenFromPassBody;

  if (!token) {
    res.redirect('/admin/login?error=access_denied');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userName: string };
    req.adminAuth = decoded.userName;
    next();
  } catch (error) {
    res.redirect('/admin/login?error=access_denied');
  }
}

