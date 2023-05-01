-- CreateTable
CREATE TABLE "Nft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_NftToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_NftToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Nft" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_NftToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_NftToUser_AB_unique" ON "_NftToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_NftToUser_B_index" ON "_NftToUser"("B");
