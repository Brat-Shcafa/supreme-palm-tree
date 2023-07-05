/*
  Warnings:

  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `locations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `items` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `locations` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`;
