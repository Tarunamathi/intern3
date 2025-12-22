-- CreateTable
CREATE TABLE "library_resources" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_resources_category_idx" ON "library_resources"("category");

-- CreateIndex
CREATE INDEX "library_resources_status_idx" ON "library_resources"("status");
