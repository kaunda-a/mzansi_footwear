import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import type { UserRole } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all sign-ins for now
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // If redirecting after successful sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // If it's a callback URL, use it
      if (new URL(url).origin === baseUrl) return url
      
      // Default redirect to account page for customers after sign in
      // Check if it's coming from sign in page
      if (url === baseUrl || url.includes('callback')) {
        return `${baseUrl}/account`
      }
      
      return baseUrl
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Create customer record for new Google users
      if (isNewUser && account?.provider === 'google') {
        try {
          // Check if customer already exists
          const existingCustomer = await db.customer.findUnique({
            where: { email: user.email! }
          })

          if (!existingCustomer) {
            // Create customer record
            await db.customer.create({
              data: {
                email: user.email!,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
              }
            })
          }

          // Update user info if not set (role will remain as default)
          await db.user.update({
            where: { id: user.id },
            data: {
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
            }
          })
        } catch (error) {
          console.error('Error creating customer record:', error)
        }
      }
    }
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error"
  }
})
