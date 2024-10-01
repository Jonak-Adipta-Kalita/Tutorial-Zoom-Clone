import { StreamClient, UserRequest } from "@stream-io/node-sdk";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.API_GETSTREAM_PUBLISHABLE_KEY;
const secret = process.env.API_GETSTREAM_SECRET_KEY;

if (!apiKey || !secret) {
  throw new Error("API keys are not provided");
}

const client = new StreamClient(apiKey, secret);

export const POST = async (req: NextRequest) => {
  const { userId, name, image, email } = await req.json();

  const newUser: UserRequest = {
    id: userId,
    role: "user",
    name,
    image,
    custom: { email },
  };

  await client.upsertUsers([newUser]);

  const validity = 60 * 60;

  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: validity,
  });

  return NextResponse.json({ token });
};
