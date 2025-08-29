"use server";
import { auth } from "@/auth";

export const fetchClient = async (url: string, options?: RequestInit) => {
  const session = await auth();
  // console.log(`From the fetchClient ${JSON.stringify(session?.accessToken)}`);

  return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    ...options,
    headers: {
      ...options?.headers,
      ...(session && { Authorization: `Bearer ${session.accessToken}` }),
    },
  });
};