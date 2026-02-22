"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
});

export async function createCategory(data: z.infer<typeof categorySchema>) {
  await requireAdmin();
  const validated = categorySchema.parse(data);

  const slug = validated.slug || generateSlug(validated.name);

  const category = await prisma.category.create({
    data: {
      name: validated.name,
      slug,
      description: validated.description,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/categories");

  return category;
}

export async function updateCategory(
  id: string,
  data: Partial<z.infer<typeof categorySchema>>
) {
  await requireAdmin();
  const validated = categorySchema.partial().parse(data);

  const category = await prisma.category.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/blog");
  revalidatePath("/categories");

  return category;
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/categories");
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          status: "PUBLISHED",
          publishedAt: { lte: new Date() },
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  });
}
