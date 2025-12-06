import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      isAdmin: boolean;
      fullName: string;
      name?: string | null;
      image?: string | null;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    username?: string;
    isAdmin?: boolean;
    fullName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    fullName: string;
    accessToken: string;
  }
}
