interface ApiPayload {
  error?: string;
  [key: string]: unknown;
}

export async function readApiResponse(response: Response): Promise<ApiPayload> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as ApiPayload;
  } catch {
    return { error: text };
  }
}
