import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
export const vapi = typeof window !== "undefined" ? new Vapi(publicKey || "") : null;
