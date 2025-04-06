// lib/cookie.ts

import Cookies from "universal-cookie";
import { NextApiRequest, NextApiResponse } from "next";

type Context = {
  req?: NextApiRequest;
  res?: NextApiResponse;
};

// ✅ Get cookie
export const getCookie = (
  key: string,
  context: Context = {}
): string | undefined => {
  const cookies = context.req
    ? new Cookies(context.req.headers.cookie)
    : new Cookies();

  return cookies.get(key);
};

// ✅ Set cookie
export const setCookie = (
  key: string,
  value: string,
  context: Context = {},
  options = {}
) => {
  const cookies = context.res
    ? new Cookies(null, { res: context.res })
    : new Cookies();

  cookies.set(key, value, {
    path: "/",
    sameSite: "lax",
    ...options,
  });
};

// ✅ Delete cookie
export const deleteCookie = (
  key: string,
  context: Context = {},
  options = {}
) => {
  const cookies = context.res
    ? new Cookies(null, { res: context.res })
    : new Cookies();

  cookies.remove(key, {
    path: "/",
    ...options,
  });
};
