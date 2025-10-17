import { Request, Response } from "express";
import { MessageService } from "./message.service";


export const MessageController = {
    async createMessage(req: Request, res: Response) {
        try {
            const { name, email, subject, content } = req.body;

            if (!name || !email || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email, and message are required",
                });
            }

            const message = await MessageService.createMessage({
                name,
                email,
                subject,
                content,
            });

            res.status(201).json({
                success: true,
                message: "Message sent successfully!",
                data: message,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    },

    async getAllMessages(req: Request, res: Response) {
        try {
            const messages = await MessageService.getAllMessages();
            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },


 
};
