import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpar dados existentes
    await prisma.user.deleteMany();
    await prisma.clinic.deleteMany();

    // Criar clínica
    const clinic = await prisma.clinic.create({
      data: {
        name: 'Clínica Veterinária Exemplo',
        address: 'Rua Exemplo, 123',
        phone: '(11) 1234-5678',
        email: 'contato@clinicaexemplo.com',
      },
    });

    // Criar usuário admin com senha simples
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin',
        hashedPassword,
        clinicId: clinic.id,
        role: 'ADMIN'
      },
    });

    console.log('Seed concluído com sucesso!');
    console.log('Usuário criado:', user);
    console.log('Senha do usuário: 123456');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 