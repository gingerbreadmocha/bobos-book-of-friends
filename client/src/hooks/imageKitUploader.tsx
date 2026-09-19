import { useCallback } from "react";
import type { ImageKitAuthResponse } from "@/types/imagekit";

export function useImageKitAuth() {
  return useCallback(async (): Promise<ImageKitAuthResponse> => {
    const authResponse = await fetch("/api/imagekit/auth", {
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
