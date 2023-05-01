// Imports
// ========================================================
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth";
import { prisma } from "~/server/db";
// SIWE Integration
import type { CtxOrReq } from "next-auth/client/_utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";
import type { Session } from "next-auth";

// Types
// ========================================================
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

// Auth Options
// ========================================================
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: (ctxReq: CtxOrReq) => NextAuthOptions = ({ req }) => ({
  callbacks: {
    // token.sub will refer to the id of the wallet address
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub
      },
    } as Session & { user: { id: string; }}),
  },
  providers: [
    CredentialsProvider({
      // ! Don't add this
      // - it will assume more than one auth provider 
      // - and redirect to a sign-in page meant for oauth
      // - id: 'siwe', 
      name: "Ethereum",
      type: "credentials", // default for Credentials
      // Default values if it was a form
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      authorize: async (credentials) => {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message as string ?? "{}") as Partial<SiweMessage>);
          const nonce = await getCsrfToken({ req: { headers: req?.headers } });
          const fields = await siwe.validate(credentials?.signature || "")

          if (fields.nonce !== nonce) {
            return null;
          }

          // Check if user exists
          let user = await prisma.user.findUnique({
            where: {
              address: fields.address
            }
          });
          // Create new user if doesn't exist
          if (!user) {
            user = await prisma.user.create({
              data: {
                address: fields.address
              }
            });
            // create account
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "credentials",
                provider: "Ethereum",
                providerAccountId: fields.address
              }
            });
          }

          return {
            // Pass user id instead of address
            // id: fields.address
            id: user.id
          };
        } catch (error) {
          // Uncomment or add logging if needed
          console.error({ error });
          return null;
        }
      },
    })
  ],
});

// Auth Session
// ========================================================
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  // Changed from authOptions to authOption(ctx)
  // This allows use to retrieve the csrf token to verify as the nonce
  return getServerSession(ctx.req, ctx.res, authOptions(ctx));
};