import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// In-memory user storage
interface User {
  id: string;
  phone: string;
  otp: string | null;
  otpExpiry: Date | null;
}
const users: User[] = [];

// Generate a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

router.post('/request-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60000);

  let user = users.find(u => u.phone === phone);
  if (user) {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
  } else {
    user = { id: Math.random().toString(36).substr(2, 9), phone, otp, otpExpiry };
    users.push(user);
  }

  console.log(`\x1b[32m[DEV ONLY] OTP for ${phone} is ${otp}\x1b[0m`);
  res.json({ message: 'OTP sent successfully (check console)' });
});

router.post('/verify-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    res.status(400).json({ error: 'Phone and OTP are required' });
    return;
  }

  const user = users.find(u => u.phone === phone);

  if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    res.status(401).json({ error: 'Invalid or expired OTP' });
    return;
  }

  // Clear OTP after successful login
  user.otp = null;
  user.otpExpiry = null;

  const token = jwt.sign(
    { id: user.id, phone: user.phone },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, phone: user.phone } });
});

export default router;
