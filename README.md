# ORM

Set up a new Prisma project

    npx prisma init

Define Prisma schema

    model Item {
        id          Int       @id @default(autoincrement())
        title       String    @db.VarChar(255)
        image       String    @db.VarChar(255)
        created_at  DateTime  @default(now())
        updated_at  DateTime  @default(now())

        location    Location  @relation(fields: [location_id], references: [id])
        location_id Int
        categories  ItemRelCategory[]

        @@map("items")
    }

    model Location {
        id          Int      @id @default(autoincrement())
        title       String   @db.VarChar(255)
        description String   @db.VarChar(255)
        created_at  DateTime @default(now())
        updated_at  DateTime @default(now())

        items Item[]

        @@map("locations")
    }

    model Category {
        id         Int      @id @default(autoincrement())
        title      String   @db.VarChar(255)
        created_at DateTime @default(now())
        updated_at DateTime @default(now())

        items      ItemRelCategory[]

        @@map("categories")
    }

    model ItemRelCategory {
        item        Item @relation(fields: [item_id], references: [id])
        item_id     Int
        category    Category @relation(fields: [category_id], references: [id])
        category_id Int

        @@id([item_id, category_id])
        @@map("item_category")
    }

Create migrations from Prisma schema and apply them to the database

    npx prisma migrate dev 

Generate new migration and apply to the database

    npx prisma migrate dev --name add-description

Delete and recreate the database

    npx prisma migrate reset

Status

    npx prisma migrate status

Apply pending migrations and create the database if it does not exist

    npx prisma migrate deploy

https://github.com/prisma/prisma-examples/blob/latest/javascript/rest-express/src/index.js
