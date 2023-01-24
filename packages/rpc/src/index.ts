import { initContract } from "@ts-rest/core";
import { contract as authContract } from "./contracts/auth";
import { contract as userContract } from "./contracts/user";

const c = initContract();

export const contract = c.router({
  auth: authContract,
  user: userContract,
});