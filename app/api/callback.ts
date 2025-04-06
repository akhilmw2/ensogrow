// pages/api/callback.ts (or another appropriate endpoint)

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_DOMAIN = process.env.AUTH0_ISSUER_BASE_URL;
const REDIRECT_URI = process.env.REDIRECT_URI; // The URI to which the user will be redirected after login

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const authVerification = cookies.auth_verification;

  if (!authVerification) {
    return res.status(400).json({ error: "Missing auth verification cookie" });
  }

  const { nonce, state, code_verifier } = JSON.parse(authVerification);

  const { code } = req.query; // Authorization code sent by Auth0

  // Verify the state and nonce
  if (state !== req.query.state) {
    return res.status(400).json({ error: "Invalid state" });
  }

  try {
    // Exchange authorization code for an access token
    const tokenResponse = await axios.post(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        code,
        code_verifier,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Extract the access token
    const { access_token } = tokenResponse.data;

    // Save the access token to a secure cookie or session
    res.setHeader(
      "Set-Cookie",
      `access_token=${access_token}; Path=/; HttpOnly; Secure`
    );

    // Redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to exchange authorization code" });
  }
}
