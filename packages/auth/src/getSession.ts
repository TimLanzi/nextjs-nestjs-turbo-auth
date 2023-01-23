// import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from "next";
// import { ParsedUrlQuery } from 'querystring';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

type NextContext = {
  req: any & {
    cookies: Partial<{
        [key: string]: string;
    }>;
  };
  res: any;
}

export async function getSession(ctx: NextContext) {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
}

export async function getCurrentUser(ctx: NextContext) {
  const session = await getSession(ctx);

  return session.user;
}