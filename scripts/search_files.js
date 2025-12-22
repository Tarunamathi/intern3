import prisma from '../lib/prisma.js';

async function main() {
  const search = 'shirley';

  console.log('Searching in Course materials...');
  const courses = await prisma.course.findMany({
    select: { id: true, name: true, materials: true }
  });
  
  for (const c of courses) {
    const mats = Array.isArray(c.materials) ? c.materials : [];
    mats.forEach((m, i) => {
      const text = typeof m === 'string' ? m : JSON.stringify(m);
      if (text.toLowerCase().includes(search.toLowerCase())) {
        console.log(`Course ${c.id} (${c.name}) - material[${i}]: ${text}`);
      }
    });
  }

  console.log('\nSearching in TraineeDocument records...');
  const docs = await prisma.traineeDocument.findMany({
    select: { id: true, title: true, fileUrl: true, courseId: true, batchId: true }
  });
  
  for (const d of docs) {
    if (d.title.toLowerCase().includes(search.toLowerCase()) || 
        d.fileUrl.toLowerCase().includes(search.toLowerCase())) {
      console.log(`Document ${d.id}: ${JSON.stringify(d, null, 2)}`);
    }
  }
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });