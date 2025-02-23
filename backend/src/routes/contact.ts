import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  message: z.string().min(10, 'ההודעה חייבת להכיל לפחות 10 תווים'),
});

router.post('/', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  
  try {
    // Validate request body
    const validatedData = contactSchema.parse(req.body);
    console.log('Validated data:', validatedData);
    
    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        status: 'pending'
      }
    });
    
    console.log('Contact saved to database:', contact);

    // Send email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SYNAGOGUE_EMAIL,
      subject: `פנייה חדשה מ-${validatedData.name}`,
      text: `
שם: ${validatedData.name}
אימייל: ${validatedData.email}

הודעה:
${validatedData.message}

נשלח באמצעות טופס יצירת קשר באתר בית הכנסת
      `,
      html: `
<div dir="rtl">
  <h2>פנייה חדשה מאתר בית הכנסת</h2>
  <p><strong>שם:</strong> ${validatedData.name}</p>
  <p><strong>אימייל:</strong> ${validatedData.email}</p>
  <h3>הודעה:</h3>
  <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
  <hr>
  <p>נשלח באמצעות טופס יצירת קשר באתר בית הכנסת</p>
</div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    
    res.json({ 
      success: true, 
      message: 'תודה על פנייתך. ניצור איתך קשר בהקדם.' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        errors: error.errors.map(e => e.message)
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'אירעה שגיאה בעיבוד הטופס. אנא נסה שוב מאוחר יותר.'
      });
    }
  }
});

export { router as contactRouter };
