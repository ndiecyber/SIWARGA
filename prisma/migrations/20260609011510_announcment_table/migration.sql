-- CreateTable
CREATE TABLE "pengumuman" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "tanggal_acara" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATE NOT NULL,

    CONSTRAINT "pengumuman_pkey" PRIMARY KEY ("id")
);
