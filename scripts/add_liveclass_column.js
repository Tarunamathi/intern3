const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    console.log('Adding liveClassLinks column if missing...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "liveClassLinks" jsonb;`);
    console.log('Done.');
  } catch (err) {
    console.error('Error adding column:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
