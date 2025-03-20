import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
    const username = 'admin';
    const password = 'admin123';
    
    try {
        // Delete existing admin user if exists
        await prisma.user.deleteMany({
            where: {
                username: username
            }
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'admin'
            }
        });
        
        console.log('Admin user created successfully:', user.username);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createUser();
