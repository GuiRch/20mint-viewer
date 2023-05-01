/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nft_tokenId_key" ON "Nft"("tokenId");
