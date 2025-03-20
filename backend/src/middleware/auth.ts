import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header:', authHeader);
      return res.status(401).json({ error: 'אנא התחבר כמנהל' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is not set');
      return res.status(500).json({ error: 'שגיאת תצורת שרת' });
    }

    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET) as { userId: number; role: string };
      console.log('Decoded token:', { ...decoded, token: '***' });

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          role: true
        }
      });

      if (!user) {
        console.log('User not found:', decoded.userId);
        return res.status(401).json({ error: 'משתמש לא נמצא' });
      }

      if (user.role !== 'admin') {
        console.log('User not admin:', user);
        return res.status(403).json({ error: 'אין הרשאות מנהל' });
      }

      // Add user to request object
      (req as any).user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'טוקן לא תקין' });
      }
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'פג תוקף החיבור, אנא התחבר מחדש' });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'שגיאת אימות' });
  }
};
