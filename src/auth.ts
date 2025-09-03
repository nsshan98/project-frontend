/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { isAxiosError } from "axios";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

// async function refreshAccessToken(token: JWT): Promise<JWT> {
//   // console.log(token, 'token')
//   console.log("Refreshing access token...");

//   try {
//     console.log("Current Refresh Token:", token.refreshToken);



//     // Make the API call to refresh the token to the backend in the body
//     // const { data: newTokens } = await axios.post(
//     //   `${process.env.API_SERVER_BASE_URL}/auth/refresh-token/`,
//     //   { refresh: token.refreshToken } // Pass refresh token in the body
//     // );

//     // Make the API call to refresh the token to the backend in the header
//     const { data: newTokens } = await axios.post(
//       `${process.env.API_SERVER_BASE_URL}/auth/refresh-token`,
//       {}, // no body needed
//       {
//         headers: {
//           Authorization: `Bearer ${token.refreshToken}`,
//         },
//       }
//     );

//     console.log("New Tokens:", newTokens);

//     return {
//       ...token,
//       accessToken: newTokens.accessToken, // Adjust if backend uses different keys
//       refreshToken: newTokens.refreshToken, // Use fallback if not provided
//       // refreshToken: newTokens.refreshToken || token.refreshToken, // Use fallback if not provided
//     };
//   } catch (error) {
//   if (axios.isAxiosError(error)) {
//     console.error("Error response:", error.response?.data);
//     console.error("Status:", error.response?.status);
//   }
//   return { ...token, error: "RefreshAccessTokenError" };
// }
// }

let refreshingToken: Promise<JWT> | null = null;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!refreshingToken) {
    refreshingToken = (async () => {
      try {
        const { data: newTokens } = await axios.post(
          `${process.env.API_SERVER_BASE_URL}/auth/refresh-token`,
          {},
          {
            headers: { Authorization: `Bearer ${token.refreshToken}` },
          }
        );

        return { ...token, accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken };
      } catch (error) {
        console.log(error)
        return { ...token, error: "RefreshAccessTokenError" as any };
      }
    })().finally(() => { refreshingToken = null; });
  }
  return refreshingToken;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const url: string = `${process.env.API_SERVER_BASE_URL}/auth/login/`;
          const payload = {
            email: credentials?.email,
            password: credentials?.password,
          };
          //   console.log(payload);

          const res = await axios.post(url, payload);

          // console.log(res.data.data, "Res");
          const userInfo = res.data;
          console.log(userInfo);

          return {
            ...res.data,
            accessToken: res.data?.accessToken,
            refreshToken: res.data?.refreshToken,
            // subscriptionInfo: res.data?.subscription_info,
          };
        } catch (error) {
          //   console.log("Error from server ------->", error);
          if (isAxiosError(error) && error.response?.status === 400) {
            throw new Error("Invalid email or password");
          }
          throw new Error("Failed to login");
        }
      },
    }),
  ],
  callbacks: {
    // authorized: async ({ auth }) => {
    //   // Logged in users are authenticated, otherwise redirect to login page
    //   return !!auth;
    // },
    jwt: async ({ token, account, user }) => {
      // user is only available the first time a user signs in authorized
      //   console.log(`In jwt callback - Token is ${JSON.stringify(token)}`);
      if (token.accessToken) {
        const decodedToken: any = jwtDecode(token.accessToken);
        // console.log(decodedToken);
        token.accessTokenExpires = decodedToken?.exp * 1000;
      }

      if (account && user) {
        // console.log(`In jwt callback - User is/ ${JSON.stringify(user)}`);
        // console.log(`In jwt callback - account is ${JSON.stringify(account)}`);
        const { accessToken, refreshToken, subscriptionInfo, ...rest } = user;

        const _token = {
          ...token,
          accessToken,
          refreshToken,
          user: rest,
          subscriptionInfo,
        };
        // console.log("Check", _token);
        return _token;
      }

      // console.log("check check", token);

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        // console.log("**** returning previous token ******");
        return token;
      }

      // Access token has expired, try to update it
      console.log("**** Update Refresh token ******");
      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      
      // console.log(`In session callback - Token is ${JSON.stringify(token)}`);
      // console.log("token from callback ------->", token);
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session as any).user = token.user;
        (session as any).subscriptionInfo = token.subscriptionInfo;
      }

      // console.log(
      //   `In session callback - Session is ${JSON.stringify(session)}`
      // );
      return session;
    },
  },
});
