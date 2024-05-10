import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session, User as NextUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password"
        }
      },
      async authorize(credentials) {
        if (credentials?.username && credentials.password) {
          const user = await User.findOne({ username: credentials?.username });

          if (user) {
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (passwordMatch) {
              return user;
            }
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: NextUser }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.username = token.username;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
