/*
  Warnings:

  - Made the column `birthDate` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `breed` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerEmail` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "weight" REAL NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("birthDate", "breed", "clinicId", "createdAt", "id", "name", "ownerEmail", "ownerName", "ownerPhone", "species", "updatedAt", "weight") SELECT "birthDate", "breed", "clinicId", "createdAt", "id", "name", "ownerEmail", "ownerName", "ownerPhone", "species", "updatedAt", "weight" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
