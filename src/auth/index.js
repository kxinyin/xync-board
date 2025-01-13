import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const secret = process.env.AUTH_SECRET;

const providers = [
  Credentials({
    credentials: {},
    async authorize(credentials) {
      try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        const { data } = await res.json();

        // TODO: get permissions

        return data
          ? {
              name: data.name,
              employee_id: data.employee_id,
              role_id: data.role_id,
            }
          : null;
      } catch (error) {
        return null;
      }
    },
  }),
];

const callbacks = {
  jwt({ token, user }) {
    if (user) {
      token.employee_id = user.employee_id;
      token.role_id = user.role_id;
    }

    return token;
  },
  session({ session, token }) {
    session.user.employee_id = token.employee_id;
    session.user.role_id = token.role_id;

    return session;
  },
};

const pages = { signIn: "/login" };

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  callbacks,
  pages,
  secret,
});
