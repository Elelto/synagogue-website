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

          console.log('Attempting login with:', {
            url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            username: credentials.username
          });

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          console.log('Login response status:', response.status);
          const data = await response.json();
          console.log('Login response:', {
            success: data.success,
            userId: data.user?.id,
            role: data.user?.role,
            hasToken: !!data.token
          });

          if (!response.ok) {
            throw new Error(data.error || 'שם משתמש או סיסמה שגויים');
          }

          if (!data.token) {
            console.error('No token received from server');
            throw new Error('לא התקבל טוקן מהשרת');
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
      console.log('JWT Callback:', { 
        hasUser: !!user,
        tokenBefore: { ...token, token: token.token ? '[HIDDEN]' : undefined },
        userToken: user?.token ? '[HIDDEN]' : undefined
      });

      if (user) {
        // Initial sign in
        return {
          ...token,
          role: user.role,
          token: user.token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback:', {
        hasToken: !!token.token,
        role: token.role
      });

      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          token: token.token,
        }
      };
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
  debug: process.env.NODE_ENV === 'development',
};
