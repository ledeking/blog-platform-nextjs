import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import { Clock } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    readingTime: number | null;
    author: {
      name: string | null;
    };
    categories: Array<{ name: string; slug: string }>;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        {post.coverImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {post.categories.map((category) => (
              <Badge key={category.slug} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
          <h2 className="text-xl font-semibold line-clamp-2">{post.title}</h2>
        </CardHeader>
        <CardContent>
          {post.excerpt && (
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.author.name}</span>
            {post.publishedAt && (
              <>
                <span>•</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
            {post.readingTime && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min read
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
