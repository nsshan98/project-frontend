import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Day
  },
  secret: process.env.AUTH_SECRET as string,
  pages: {
    signIn: "/login",
  },
  providers: [],
} satisfies NextAuthConfig;