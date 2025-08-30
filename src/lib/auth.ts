import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import type { UserRole } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";

const prismaAdapter = PrismaAdapter(db as PrismaClient);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...prismaAdapter,
    createUser: (data: any) => db.customer.create({ data }),
    getUser: (id: string) => db.customer.findUnique({ where: { id } }),
    getUserByEmail: (email: string) =>
      db.customer.findUnique({ where: { email } }),
    getUserById: (id: string) => db.customer.findUnique({ where: { id } }),
    getUserByAccount: async (arg: any) => {
      const provider: string | undefined =
        typeof arg === "object" && arg ? arg.provider : undefined;
      const providerAccountId: string =
        typeof arg === "string" ? arg : arg?.providerAccountId;

      if (!providerAccountId) return null;

      if (provider) {
        const account = await db.account.findUnique({
          where: {
            provider_providerAccountId: { provider, providerAccountId },
          },
          include: { customer: true },
        });
        return account?.customer ?? null;
      }

      const account = await db.account.findFirst({
        where: { providerAccountId },
        include: { customer: true },
      });
      return account?.customer ?? null;
    },
    updateUser: (data: any) =>
      db.customer.update({ where: { id: data.id }, data }),
    deleteUser: (id: string) => db.customer.delete({ where: { id } }),
    linkAccount: async (data: any) => {
      const { userId, ...rest } = data as any;
      return db.account.create({
        data: { ...rest, customerId: userId },
      });
    },
    unlinkAccount: ({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) =>
      db.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      }),
    createSession: (data: any) =>
      db.session.create({
        data: {
          sessionToken: data.sessionToken,
          customerId: data.userId,
          expires: data.expires,
        },
      }),
    getSessionAndUser: async (sessionToken: string) => {
      const session = await db.session.findUnique({
        where: { sessionToken },
        include: { customer: true },
      });
      if (!session) return null as any;
      const { customer, ...sessionFields } = session as any;
      return { session: sessionFields, user: customer } as any;
    },
    updateSession: (data: any) =>
      db.session.update({
        where: { sessionToken: data.sessionToken },
        data: { expires: data.expires },
      }),
    deleteSession: (sessionToken: string) =>
      db.session.delete({ where: { sessionToken } }),
    createVerificationToken: (data: any) =>
      db.verificationToken.create({ data }),
    useVerificationToken: async ({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }) => {
      const existing = await db.verificationToken.findUnique({
        where: { identifier_token: { identifier, token } },
      });
      if (!existing) return null as any;
      await db.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
      return existing as any;
    },
  } as unknown as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      // Allow all sign-ins, user creation is handled by the adapter and events.signIn
      if (account?.provider === "google") {
        // No explicit check for existing user needed here, as the adapter's createUser
        // and events.signIn will handle new user/customer creation.
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If redirecting after successful sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If it's a callback URL, use it
      if (new URL(url).origin === baseUrl) return url;

      // Default redirect to account page for customers after sign in
      // Check if it's coming from sign in page
      if (url === baseUrl || url.includes("callback")) {
        return `${baseUrl}/account`;
      }

      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Create customer record for new Google users
      if (isNewUser && account?.provider === "google") {
        try {
          // Check if customer already exists
          const existingCustomer = await db.customer.findUnique({
            where: { email: user.email! },
          });

          if (!existingCustomer) {
            // Create customer record
            await db.customer.create({
              data: {
                email: user.email!,
                firstName: user.name?.split(" ")[0] || "",
                lastName: user.name?.split(" ").slice(1).join(" ") || "",
                imageUrl: user.image || null,
              },
            });
          }
        } catch (error) {
          console.error("Error creating customer record:", error);
        }
      }
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
});
