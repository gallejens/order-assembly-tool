pub struct Migration<'a> {
    pub description: &'a str,
    pub sql: &'a str,
}

pub const MIGRATIONS: [Migration; 5] = [
    Migration {
        description: "create_initial_tables",
        sql: "
    CREATE TABLE IF NOT EXISTS `groups` (
      `id` INTEGER PRIMARY KEY AUTOINCREMENT, 
      `label` VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS `items` (
      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
      `groupId`	INTEGER NOT NULL,
      `parentId` INTEGER,
      `label` VARCHAR(255) NOT NULL,
      FOREIGN KEY(`groupId`) REFERENCES `groups`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY(`parentId`) REFERENCES `items`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS `item_keys` (
      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
      `itemId` INTEGER NOT NULL,
      `name` VARCHAR(255) NOT NULL,
      FOREIGN KEY(`itemId`) REFERENCES `items`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
    );",
    },
    Migration {
        description: "add_products_tables",
        sql: "
    CREATE TABLE IF NOT EXISTS `products` (
      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
      `itemId` INTEGER NOT NULL,
      FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS `product_values` (
      `productId` INTEGER NOT NULL,
      `keyId` INTEGER NOT NULL,
      `value` TEXT,
      PRIMARY KEY (`productId`, `keyId`),
      FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (`keyId`) REFERENCES `item_keys`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
    );
    ",
    },
    Migration {
        description: "add_group_position",
        sql: "
    ALTER TABLE `groups` ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0;
      ",
    },
    Migration {
        description: "add_suggested_keys",
        sql: "
    CREATE TABLE IF NOT EXISTS `suggested_item_keys` (
      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
      `groupId` INTEGER NOT NULL,
      `name` VARCHAR(255) NOT NULL,
      FOREIGN KEY(`groupId`) REFERENCES `groups`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
    );
    ",
    },
    Migration {
        description: "add_item_key_position",
        sql: "
    ALTER TABLE `item_keys` ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0;
      ",
    },
];
