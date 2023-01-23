import NextAuth from "next-auth/next";
import { authOptions } from "@acme/auth";

export default NextAuth(authOptions);