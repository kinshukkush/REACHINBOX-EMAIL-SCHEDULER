import { Request, Response } from 'express';
import prisma from '../config/db';
import { emailQueue } from '../queues/emailQueue';

export const scheduleEmails = async (req: Request, res: Response) => {
    try {
        const { subject, body, recipients, startTime, delayBetweenEmails, hourlyLimit, senderEmail } = req.body;

        // 1. Get or Create Sender
        let sender = await prisma.sender.findUnique({ where: { email: senderEmail } });
        if (!sender) {
            sender = await prisma.sender.create({ data: { email: senderEmail, name: 'Default Sender' } });
        }

        const scheduledJobs = [];

        // 2. Create Email records and add to Queue
        for (const to of recipients) {
            const email = await prisma.email.create({
                data: {
                    to,
                    subject,
                    body,
                    scheduledAt: new Date(startTime),
                    senderId: sender.id,
                },
            });

            const delay = Math.max(0, new Date(startTime).getTime() - Date.now());

            const job = await emailQueue.add(
                'send-email',
                {
                    emailId: email.id,
                    senderId: sender.id,
                    hourlyLimit,
                    delayBetweenEmails,
                },
                { delay }
            );

            scheduledJobs.push({ emailId: email.id, jobId: job.id });
        }

        res.status(201).json({ message: 'Emails scheduled successfully', jobs: scheduledJobs });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getScheduledEmails = async (_req: Request, res: Response) => {
    try {
        const emails = await prisma.email.findMany({
            where: { status: 'PENDING' },
            orderBy: { scheduledAt: 'asc' },
            include: { sender: true }
        });
        res.json(emails);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSentEmails = async (_req: Request, res: Response) => {
    try {
        const emails = await prisma.email.findMany({
            where: { status: 'SENT' },
            orderBy: { sentAt: 'desc' },
            include: { sender: true }
        });
        res.json(emails);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getEmailById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const emailId = Array.isArray(id) ? id[0] : id;
        
        const email = await prisma.email.findUnique({
            where: { id: emailId },
            include: { sender: true }
        });

        if (!email) {
            return res.status(404).json({ error: 'Email not found' });
        }

        res.json(email);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
