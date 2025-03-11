import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

if (!process.env.NEXTAUTH_SECRET || !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('Missing required environment variables: NEXTAUTH_SECRET, NEXT_PUBLIC_API_URL');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "שם משתמש", type: "text", placeholder: "הכנס שם משתמש" },
        password: { label: "סיסמה", type: "password", placeholder: "הכנס סיסמה" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error('שם משתמש וסיסמה הם שדות חובה');
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'שם משתמש או סיסמה שגויים');
          }

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            role: data.user.role,
            token: data.token,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session as any).token = token.token;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
  debug: process.env.NODE_ENV === 'development',
};
