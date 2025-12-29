import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const STATIC_USER = {
  id: "1",
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD, 
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === STATIC_USER.email &&
          credentials?.password === STATIC_USER.password
        ) {
          return { id: STATIC_USER.id, name: STATIC_USER.name, email: STATIC_USER.email };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/signin", // custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
