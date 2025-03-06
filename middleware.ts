import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// export default clerkMiddleware(async (auth, req) => {
//   const url = req.nextUrl;
//   let hostname = req.headers.get("host") || "";

//   // Remove port if it exists
//   hostname = hostname.split(":")[0];

//   // Define allowed domains (including main domain and localhost)
//   const allowedDomains = ["giddi.shop", "www.giddi.shop", "localhost"];

//   // Check if the current hostname is in the list of allowed domains
//   const isMainDomain = allowedDomains.includes(hostname);

//   // Extract subdomain if not a main domain
//   const subdomain = isMainDomain ? null : hostname.split(".")[0];

//   console.log("Middleware: Hostname:", hostname);
//   console.log("Middleware: Subdomain:", subdomain);

//   // If it's a main domain, allow the request to proceed
//   if (isMainDomain) {
//     console.log("Middleware: Main domain detected, passing through");
//     return NextResponse.next();
//   }

//   // Handle subdomain logic
//   if (subdomain) {
//     try {
//       // Use fetch to verify if the subdomain exists
//       const response = await fetch(
//         `${url.origin}/api/store?subdomain=${subdomain}`
//       );

//       if (response.ok) {
//         console.log("Middleware: Valid subdomain detected, rewriting URL");
//         // Rewrite the URL to a dynamic route based on the subdomain
//         return NextResponse.rewrite(
//           new URL(`/${subdomain}${url.pathname}`, req.url)
//         );
//       }
//     } catch (error) {
//       console.error("Middleware: Error fetching tenant:", error);
//     }
//   }

//   console.log("Middleware: Invalid subdomain or domain, returning 404");
//   // If none of the above conditions are met, return a 404 response
//   return new NextResponse(null, { status: 404 });
// });

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/manage(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting

    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
