import { prisma } from "../../config/db";




export const MessageService = {
    async createMessage(data: {
        name: string;
        email: string;
        subject?: string;
        content: string;
    }) {
        const { name, email, subject, content } = data;

        return await prisma.message.create({
            data: { name, email, subject, content },
        });
    },

    async getAllMessages() {
        return await prisma.message.findMany({
            orderBy: { createdAt: "desc" },
        });
    },



};
