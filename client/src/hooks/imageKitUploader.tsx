import { useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";

/** Authentication parameters returned by `/api/imagekit/auth` for direct uploads. */
export type ImageKitAuthResponse = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
};

export function useImageKitAuth() {
  return useCallback(async (): Promise<ImageKitAuthResponse> => {
    const authResponse = await fetch(`${API_BASE_URL}/api/imagekit/auth`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!authResponse.ok) {
      throw new Error("Failed to authenticate upload");
    }

    const response = (await authResponse.json()) as ImageKitAuthResponse;
    return response;
  }, []);
}
