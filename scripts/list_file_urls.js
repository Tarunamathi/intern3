#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const search = process.argv[2];

  console.log('Fetching courses...');
  const courses = await prisma.course.findMany({ select: { id: true, name: true, materials: true } });
  for (const c of courses) {
    const mats = Array.isArray(c.materials) ? c.materials : [];
    mats.forEach((m, i) => {
      const text = typeof m === 'string' ? m : JSON.stringify(m);
      if (!search || text.toLowerCase().includes(search.toLowerCase())) {
        console.log(`Course ${c.id} (${c.name}) - material[${i}]: ${text}`);
      }
    });
  }

  console.log('\nFetching trainee documents...');
  const docs = await prisma.traineeDocument.findMany({ select: { id: true, title: true, fileUrl: true } });
  for (const d of docs) {
    if (!search || (d.fileUrl && d.fileUrl.toLowerCase().includes(search.toLowerCase())) || (d.title && d.title.toLowerCase().includes(search.toLowerCase()))) {
      console.log(`Doc ${d.id} (${d.title}) - fileUrl: ${d.fileUrl}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error', e);
  process.exit(1);
});
