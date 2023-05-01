/*
  Warnings:

  - You are about to drop the column `num` on the `Nft` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Nft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT,
    "imageUrl" TEXT,
    "ipfsImage" TEXT,
    "address" TEXT,
    "name" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Nft" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "Nft";
DROP TABLE "Nft";
ALTER TABLE "new_Nft" RENAME TO "Nft";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
