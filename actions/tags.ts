"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
});

export async function createTag(data: z.infer<typeof tagSchema>) {
  await requireAdmin();
  const validated = tagSchema.parse(data);

  const slug = validated.slug || generateSlug(validated.name);

  const tag = await prisma.tag.create({
    data: {
      name: validated.name,
      slug,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/tags");

  return tag;
}

export async function updateTag(
  id: string,
  data: Partial<z.infer<typeof tagSchema>>
) {
  await requireAdmin();
  const validated = tagSchema.partial().parse(data);

  const tag = await prisma.tag.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/blog");
  revalidatePath("/tags");

  return tag;
}

export async function deleteTag(id: string) {
  await requireAdmin();
  await prisma.tag.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/tags");
}

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
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
