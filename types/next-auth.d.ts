import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    juryMemberId?: string;
  }

  interface Session {
    user: User & {
      role?: string;
      juryMemberId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    juryMemberId?: string;
  }
}
