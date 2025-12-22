import prisma from '../lib/prisma.js';

// Assumptions (change if you want another course or uploader)
const COURSE_ID = 10; // inferred from earlier search (vegetables)
const FILE_NAME = 'E-Way Bill System.pdf';
const TARGET_PATH = `/uploads/courses/${FILE_NAME}`; // stored in DB as this string
const UPLOADED_BY = 'system@local';

async function main() {
  console.log('Target path:', TARGET_PATH);

  // Fetch the course
  const course = await prisma.course.findUnique({ where: { id: COURSE_ID } });
  if (!course) {
    console.error('Course not found:', COURSE_ID);
    process.exit(1);
  }

  const existingMaterials = Array.isArray(course.materials) ? course.materials : [];

  // Check for either decoded or encoded variants
  const encodedVariant = `/uploads/courses/${encodeURIComponent(FILE_NAME)}`;
  const hasDecoded = existingMaterials.includes(TARGET_PATH);
  const hasEncoded = existingMaterials.includes(encodedVariant);

  if (hasDecoded || hasEncoded) {
    console.log('Course already references file (decoded or encoded).');
  } else {
    const newMaterials = [...existingMaterials, TARGET_PATH];
    await prisma.course.update({ where: { id: COURSE_ID }, data: { materials: newMaterials } });
    console.log(`Added ${TARGET_PATH} to course ${COURSE_ID} materials.`);
  }

  // Ensure a TraineeDocument exists pointing to the same path
  const docExists = await prisma.traineeDocument.findFirst({ where: { OR: [{ fileUrl: TARGET_PATH }, { fileUrl: encodedVariant }] } });
  if (docExists) {
    console.log('TraineeDocument already exists with this fileUrl:', docExists.id);
  } else {
    const created = await prisma.traineeDocument.create({
      data: {
        title: 'E-Way Bill System',
        fileUrl: TARGET_PATH,
        mimeType: 'application/pdf',
        uploadedBy: UPLOADED_BY
      }
    });
    console.log('Created TraineeDocument id=', created.id);
  }

  console.log('Done.');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });