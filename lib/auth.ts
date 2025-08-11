import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserRoles } from "@/types";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roles: user.roles,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Notion OAuth Provider
    {
      id: "notion",
      name: "Notion",
      type: "oauth",
      authorization: {
        url: "https://api.notion.com/v1/oauth/authorize",
        params: {
          client_id: process.env.NOTION_CLIENT_ID!,
          response_type: "code",
          owner: "user",
        },
      },
      token: "https://api.notion.com/v1/oauth/token",
      userinfo: "https://api.notion.com/v1/users/me",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.person?.email,
          image: profile.avatar_url,
        };
      },
      clientId: process.env.NOTION_CLIENT_ID!,
      clientSecret: process.env.NOTION_CLIENT_SECRET!,
    },
    // Slack OAuth Provider
    {
      id: "slack",
      name: "Slack",
      type: "oauth",
      authorization: {
        url: "https://slack.com/oauth/v2/authorize",
        params: {
          client_id: process.env.SLACK_CLIENT_ID!,
          scope: "identity.basic,identity.email,identity.avatar",
        },
      },
      token: "https://slack.com/api/oauth.v2.access",
      userinfo: "https://slack.com/api/users.identity",
      profile(profile) {
        return {
          id: profile.user.id,
          name: profile.user.name,
          email: profile.user.email,
          image: profile.user.image_192,
        };
      },
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
    },
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token) {
        session.user.id = token.sub as string;
        session.user.roles = (token.roles as UserRoles) || ["BUYER"];
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.roles = user.roles || ["BUYER"];
      }
      return token;
    },
    signIn: async ({ user, account, profile }) => {
      // Handle OAuth account linking
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // If user exists, allow the sign in to link the OAuth account
          // This will automatically link the Google account to the existing user
          return true;
        } else {
          // Create new user with OAuth
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              roles: ["BUYER"],
            },
          });
        }
      }

      // Handle credentials provider
      if (account?.provider === "credentials") {
        return true; // Already handled in authorize callback
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};

// Extend the NextAuth types to include user ID and roles
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles: UserRoles;
    };
  }

  interface User {
    roles?: UserRoles;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: UserRoles;
  }
}
