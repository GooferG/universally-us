import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const WP_API = process.env.WP_API_URL!;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        login: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;

        try {
          const res = await fetch(`${WP_API}/jwt-auth/v1/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.login,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.token) return null;

          // Fetch WordPress user ID using the fresh token
          const meRes = await fetch(`${WP_API}/wp/v2/users/me`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const me = meRes.ok ? await meRes.json() : null;

          return {
            id: data.user_email,
            name: data.user_display_name,
            email: data.user_email,
            token: data.token,
            wpUserId: me?.id ?? null,
          };
        } catch {
          return null;
        }
      },
    }),

    // Google — only active when env vars are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) token.wpToken = user.token;
      if (user?.wpUserId) token.wpUserId = user.wpUserId;
      return token;
    },
    async session({ session, token }) {
      session.wpToken = token.wpToken;
      session.wpUserId = token.wpUserId;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};
