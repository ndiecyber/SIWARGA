-- CreateTable
CREATE TABLE "ronda" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ronda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ronda_userId_idx" ON "ronda"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ronda_dayOfWeek_userId_key" ON "ronda"("dayOfWeek", "userId");

-- AddForeignKey
ALTER TABLE "ronda" ADD CONSTRAINT "ronda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
