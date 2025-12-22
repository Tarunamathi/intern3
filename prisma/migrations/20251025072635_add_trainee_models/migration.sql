-- CreateTable
CREATE TABLE "trainee_progress" (
    "id" SERIAL NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "courseId" INTEGER,
    "moduleKey" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainee_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" SERIAL NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "batchId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainee_documents" (
    "id" SERIAL NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "courseId" INTEGER,
    "batchId" INTEGER,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trainee_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trainee_progress_studentEmail_idx" ON "trainee_progress"("studentEmail");

-- CreateIndex
CREATE INDEX "trainee_progress_courseId_idx" ON "trainee_progress"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_studentEmail_batchId_date_key" ON "attendance_records"("studentEmail", "batchId", "date");

-- AddForeignKey
ALTER TABLE "trainee_progress" ADD CONSTRAINT "trainee_progress_studentEmail_fkey" FOREIGN KEY ("studentEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainee_progress" ADD CONSTRAINT "trainee_progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_studentEmail_fkey" FOREIGN KEY ("studentEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainee_documents" ADD CONSTRAINT "trainee_documents_studentEmail_fkey" FOREIGN KEY ("studentEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainee_documents" ADD CONSTRAINT "trainee_documents_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainee_documents" ADD CONSTRAINT "trainee_documents_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
