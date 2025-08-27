import type { NextAuthConfig } from "next-auth";
export const authConfig = {
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/login'
    }
} satisfies NextAuthConfig