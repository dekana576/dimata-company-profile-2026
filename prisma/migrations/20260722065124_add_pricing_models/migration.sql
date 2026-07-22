-- CreateTable
CREATE TABLE `pricing_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `iconDark` VARCHAR(191) NULL,
    `descriptionId` VARCHAR(500) NOT NULL,
    `descriptionEn` VARCHAR(500) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pricing_products_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing_tiers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `deployment` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `price` INTEGER NOT NULL,
    `period` VARCHAR(100) NOT NULL,
    `highlighted` BOOLEAN NOT NULL DEFAULT false,
    `badge` VARCHAR(50) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pricing_tiers_productId_deployment_name_key`(`productId`, `deployment`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tierId` INTEGER NOT NULL,
    `labelId` VARCHAR(200) NOT NULL,
    `labelEn` VARCHAR(200) NOT NULL,
    `included` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing_bundle_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `deployment` VARCHAR(20) NOT NULL,
    `tierName` VARCHAR(50) NOT NULL,
    `labelId` VARCHAR(200) NOT NULL,
    `labelEn` VARCHAR(200) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing_discounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `minApps` INTEGER NOT NULL,
    `discountPercent` INTEGER NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pricing_discounts_minApps_key`(`minApps`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing_comparison` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `labelId` VARCHAR(200) NOT NULL,
    `labelEn` VARCHAR(200) NOT NULL,
    `showStandard` BOOLEAN NOT NULL DEFAULT true,
    `showProfessional` BOOLEAN NOT NULL DEFAULT false,
    `showPremium` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pricing_tiers` ADD CONSTRAINT `pricing_tiers_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `pricing_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricing_features` ADD CONSTRAINT `pricing_features_tierId_fkey` FOREIGN KEY (`tierId`) REFERENCES `pricing_tiers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricing_bundle_features` ADD CONSTRAINT `pricing_bundle_features_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `pricing_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
