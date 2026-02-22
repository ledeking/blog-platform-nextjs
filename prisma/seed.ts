import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user (will be linked to Clerk user)
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      clerkId: "admin-clerk-id",
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user");

  // Create categories
  const categories = [];
  const categoryNames = [
    "Technology",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "Tutorials",
    "Tips & Tricks",
  ];

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description: faker.lorem.sentence(),
      },
    });
    categories.push(category);
  }

  console.log(`✅ Created ${categories.length} categories`);

  // Create tags
  const tags = [];
  const tagNames = [
    "javascript",
    "react",
    "nextjs",
    "typescript",
    "tutorial",
    "guide",
    "best-practices",
    "webdev",
    "frontend",
    "backend",
  ];

  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: name.toLowerCase(),
      },
    });
    tags.push(tag);
  }

  console.log(`✅ Created ${tags.length} tags`);

  // Create posts
  const posts = [];
  for (let i = 0; i < 12; i++) {
    const title = faker.lorem.sentence();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const content = `# ${title}\n\n${faker.lorem.paragraphs(10, "\n\n")}`;
    const readingTime = Math.ceil(content.split(/\s+/).length / 200);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: faker.lorem.paragraph(),
        content,
        coverImage: `https://images.unsplash.com/photo-${faker.string.numeric(10)}?w=800&h=400&fit=crop`,
        status: i < 8 ? "PUBLISHED" : "DRAFT",
        publishedAt: i < 8 ? faker.date.past() : null,
        readingTime,
        metaTitle: title,
        metaDescription: faker.lorem.sentence(),
        authorId: adminUser.id,
        categories: {
          connect: faker.helpers.arrayElements(categories, {
            min: 1,
            max: 3,
          }),
        },
        tags: {
          connect: faker.helpers.arrayElements(tags, { min: 2, max: 5 }),
        },
      },
    });
    posts.push(post);
  }

  console.log(`✅ Created ${posts.length} posts`);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
