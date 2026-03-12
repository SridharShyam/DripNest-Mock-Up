const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, slug: true } });
  console.log('Products:', products.length);
  products.forEach(p => console.log(`- ${p.slug}: ${p.name}`));
  
  const variants = await prisma.variant.count();
  console.log('Variants total:', variants);
  
  const users = await prisma.user.findMany();
  console.log('Users:', users.map(u => u.email));
}

check().catch(console.error).finally(() => prisma.$disconnect());
