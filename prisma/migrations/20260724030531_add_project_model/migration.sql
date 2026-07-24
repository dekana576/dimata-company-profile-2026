-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `titleId` VARCHAR(200) NOT NULL,
    `titleEn` VARCHAR(200) NOT NULL,
    `descriptionId` VARCHAR(500) NOT NULL,
    `descriptionEn` VARCHAR(500) NOT NULL,
    `client` VARCHAR(200) NULL,
    `category` VARCHAR(100) NOT NULL,
    `technologies` VARCHAR(500) NOT NULL,
    `image` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'completed',
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `externalUrl` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
