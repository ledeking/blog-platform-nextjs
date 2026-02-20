import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/blog(.*)",
  "/categories/(.*)",
  "/tags/(.*)",
  "/about",
  "/contact",
  "/feed.xml",
  "/rss",
  "/sitemap.xml",
  "/robots.txt",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
