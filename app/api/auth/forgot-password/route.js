import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, phone, method = 'email' } = body;

    if (!email && !phone) {
      return NextResponse.json({ message: 'Email or phone is required' }, { status: 400 });
    }

    // Find user by email or phone
    let user;
    if (method === 'email' && email) {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    } else if (method === 'phone' && phone) {
      // For SMS, we'll search by phone field if it exists
      user = await prisma.user.findFirst({ where: { phone: phone } });
    }

    // Always return success to avoid leaking whether user exists
    if (!user) {
      const msg = method === 'email' 
        ? 'If an account exists for this email, a reset link has been sent'
        : 'If an account exists for this phone number, an SMS was sent';
      return NextResponse.json({ message: msg });
    }

    // generate token and expiry (1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Ensure Prisma model is available (migration applied)
    if (!prisma.passwordResetToken) {
      console.error('Prisma client does not have model `passwordResetToken`. Did you run prisma migrate?');
      return NextResponse.json({ 
        message: 'Server not configured for password resets. Run prisma migrate dev to add required table.' 
      }, { status: 500 });
    }

    // Store token
    await prisma.passwordResetToken.create({
      data: {
        token,
        userEmail: user.email,
        expiresAt,
      }
    });

    if (method === 'email') {
      // TODO: send email with reset link
      // In production, send an email containing a link: `${APP_URL}/reset-password?token=${token}`
      console.log(`Password reset token for ${user.email}: ${token}`);
      return NextResponse.json({ 
        message: 'If an account exists for this email, a reset link has been sent', 
        token  // for dev/testing
      });
    } else {
      // SMS method
      // TODO: send SMS via Twilio or another SMS provider
      // For now, generate a 6-digit code for demo purposes
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Password reset code for ${user.phone}: ${code} (token: ${token})`);
      
      // In production, integrate with Twilio/Vonage:
      // await sendSMS(user.phone, `Your password reset code is: ${code}. Valid for 1 hour.`);
      
      return NextResponse.json({ 
        message: 'If an account exists for this phone number, an SMS was sent',
        code  // for dev/testing
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
