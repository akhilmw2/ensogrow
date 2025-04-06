import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: true,
  pages: {
    signIn: "/login", // Optional: Customize the sign-in page
  },
  callbacks: {
    async signIn(user, account, profile) {
      if (account.provider === "google" && profile.verified_email === true) {
        return true;
      } else {
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

// Explicitly handle GET and POST methods in Next.js App Router
export { handler as GET, handler as POST };
