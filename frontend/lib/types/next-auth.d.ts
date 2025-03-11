import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    role: string;
    token: string;
  }

  interface Session {
    user: User & {
      role: string;
    };
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    token?: string;
  }
}
