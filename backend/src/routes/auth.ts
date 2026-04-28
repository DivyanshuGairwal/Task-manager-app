import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const router = Router();

// Generate a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

router.post('/request-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  const otp = generateOTP();
  // Set expiry to 10 minutes from now
  const otpExpiry = new Date(Date.now() + 10 * 60000);

  try {
    await prisma.user.upsert({
      where: { phone },
      update: { otp, otpExpiry },
      create: { phone, otp, otpExpiry },
    });

    // In a real app, send OTP via SMS here.
    console.log(`[DEV ONLY] OTP for ${phone} is ${otp}`);

    res.json({ message: 'OTP sent successfully (check console)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    res.status(400).json({ error: 'Phone and OTP are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      res.status(401).json({ error: 'Invalid or expired OTP' });
      return;
    }

    // Clear OTP after successful login
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null },
    });

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, phone: user.phone } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
