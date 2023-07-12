import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    for (let i = 0; i < 10; i++) {
        await prisma.item.create({
            data: {
                title: faker.word.noun(),
                image: faker.word.adverb(),
                location: {
                    create: {
                        title: faker.location.city(),
                        description: faker.lorem.sentence(),
                    }
                },
                categories: {
                    create: [
                        {
                            category: {
                                create: {
                                    title: faker.word.noun(),
                                    description: faker.lorem.sentence(),
                                }
                            }
                        },
                    ]
                }
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });