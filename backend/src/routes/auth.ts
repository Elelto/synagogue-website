import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'שם משתמש וסיסמה הם שדות חובה'
      });
    }

    // Use the User model (previously AdminUser)
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({
        success: false,
        error: 'שם משתמש או סיסמה שגויים'
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({
        success: false,
        error: 'שם משתמש או סיסמה שגויים'
      });
    }

    // Generate JWT token using NEXTAUTH_SECRET
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 1 day
      },
      process.env.NEXTAUTH_SECRET
    );

    console.log('Login successful for user:', {
      username: user.username,
      role: user.role,
      tokenLength: token.length
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'אירעה שגיאה בהתחברות. אנא נסה שוב מאוחר יותר'
    });
  }
});

export { router as authRouter };
