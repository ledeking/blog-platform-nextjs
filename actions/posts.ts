"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { generateSlug, calculateReadingTime } from "@/lib/utils";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT"),
  publishedAt: z.string().optional().nullable(),
  publishAt: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

export async function createPost(data: z.infer<typeof postSchema>) {
  const user = await requireAdmin();
  const validated = postSchema.parse(data);

  const slug = validated.slug || generateSlug(validated.title);
  const readingTime = calculateReadingTime(validated.content);

  // Check if slug exists
  const existingPost = await prisma.post.findUnique({
    where: { slug },
  });

  if (existingPost) {
    throw new Error("A post with this slug already exists");
  }

  const post = await prisma.post.create({
    data: {
      title: validated.title,
      slug,
      excerpt: validated.excerpt,
      content: validated.content,
      coverImage: validated.coverImage,
      status: validated.status,
      publishedAt: validated.status === "PUBLISHED" ? new Date() : validated.publishedAt ? new Date(validated.publishedAt) : null,
      publishAt: validated.publishAt ? new Date(validated.publishAt) : null,
      readingTime,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
      canonicalUrl: validated.canonicalUrl,
      authorId: user.id,
      categories: {
        connect: validated.categoryIds.map((id) => ({ id })),
      },
      tags: {
        connect: validated.tagIds.map((id) => ({ id })),
      },
    },
    include: {
      author: true,
      categories: true,
      tags: true,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath(`/blog/${post.slug}`);

  return post;
}

export async function updatePost(
  id: string,
  data: Partial<z.infer<typeof postSchema>>
) {
  const user = await requireAuth();
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new Error("Post not found");
  }

  // Check if user is author or admin
  if (post.authorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = postSchema.partial().parse(data);
  const readingTime = validated.content
    ? calculateReadingTime(validated.content)
    : post.readingTime;

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      ...validated,
      readingTime,
      publishedAt:
        validated.status === "PUBLISHED" && !post.publishedAt
          ? new Date()
          : validated.publishedAt
          ? new Date(validated.publishedAt)
          : post.publishedAt,
      publishAt: validated.publishAt ? new Date(validated.publishAt) : post.publishAt,
      categories: validated.categoryIds
        ? {
            set: validated.categoryIds.map((id) => ({ id })),
          }
        : undefined,
      tags: validated.tagIds
        ? {
            set: validated.tagIds.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      author: true,
      categories: true,
      tags: true,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath(`/blog/${updatedPost.slug}`);

  return updatedPost;
}

export async function deletePost(id: string) {
  const user = await requireAuth();
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/");
}

export async function getPosts({
  page = 1,
  limit = 12,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  search?: string;
}) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  } else {
    // Public: only published
    where.status = "PUBLISHED";
    where.publishedAt = { lte: new Date() };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      categories: true,
      tags: true,
      comments: {
        include: {
          author: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post || (post.status !== "PUBLISHED" && !post.publishedAt)) {
    return null;
  }

  return post;
}
