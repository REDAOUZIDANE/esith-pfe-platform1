import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Clear existing
    await prisma.message.deleteMany();
    await prisma.pFE.deleteMany();
    await prisma.company.deleteMany();
    await prisma.alumni.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Users
    const admin = await prisma.user.create({
        data: {
            email: 'admin@esith.ac.ma',
            password: hashedPassword,
            name: 'Limbo Quack',
            role: 'ADMIN',
            major: 'Administration',
            isVerified: true
        }
    });

    const student = await prisma.user.create({
        data: {
            email: 'student@esith.ac.ma',
            password: hashedPassword,
            name: 'Reda Slimani',
            role: 'STUDENT',
            major: 'Genie Informatique',
            isVerified: true
        }
    });

    // Companies
    const ocp = await prisma.company.create({
        data: {
            name: 'OCP Group',
            sector: 'Mining & Fertilizer',
            city: 'Casablanca',
            email: 'contact@ocp.ma',
            phone: '+212 522 23 23 23'
        }
    });

    const capgemini = await prisma.company.create({
        data: {
            name: 'Capgemini Engineering',
            sector: 'IT & Engineering',
            city: 'Casablanca',
            email: 'hr@capgemini.com'
        }
    });

    // PFEs
    await prisma.pFE.create({
        data: {
            title: 'AI-Driven Smart Logistics for Phosphate Export',
            description: 'Optimizing the supply chain using deep reinforcement learning models.',
            academicYear: '2023-2024',
            major: 'Genie Informatique',
            studentNames: 'Reda Slimani, Amina Bakari',
            reportUrl: '/uploads/report_demo.pdf',
            presentationUrl: '/uploads/slides_demo.pptx',
            companyId: ocp.id
        }
    });

    await prisma.pFE.create({
        data: {
            title: 'Sustainable Textile Production using Hemp Fibers',
            description: 'Exploring the mechanical properties and industrial feasibility of hemp-based fabrics.',
            academicYear: '2023-2024',
            major: 'Genie Textile',
            studentNames: 'Youssef El Amrani',
            companyId: null
        }
    });

    // Alumni
    await prisma.alumni.create({
        data: {
            name: 'Sarah Mansouri',
            graduationYear: '2021',
            major: 'Genie Industriel',
            currentCompany: 'Amazon France',
            email: 'sarah.m@alumni.esith.ma',
            linkedIn: 'linkedin.com/in/sarahmansouri'
        }
    });

    await prisma.alumni.create({
        data: {
            name: 'Mehdi Tazi',
            graduationYear: '2022',
            major: 'Management',
            currentCompany: 'Deloitte Morocco',
            email: 'm.tazi@deloitte.com'
        }
    });

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
