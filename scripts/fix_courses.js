import prisma from '../lib/prisma.js';

async function main() {
  // Update course 6
  await prisma.course.update({
    where: { id: 6 },
    data: {
      materials: {
        set: [] // Clear materials array
      }
    }
  });
  console.log('Updated course 6');

  // Update course 9
  await prisma.course.update({
    where: { id: 9 },
    data: {
      materials: {
        set: [] // Clear materials array
      }
    }
  });
  console.log('Updated course 9');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });