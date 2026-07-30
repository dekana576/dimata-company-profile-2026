-- AlterTable
ALTER TABLE `Event` ADD COLUMN `registrationUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pricing_tiers` ADD COLUMN `hidePrice` BOOLEAN NOT NULL DEFAULT false;
