import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createFashionPrompt, type BackgroundType, type MannequinType } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 120;

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "REPLICATE_API_TOKEN is missing. Add it to .env.local." }, { status: 500 });
    }

    const formData = await request.formData();
    const image = formData.get("image");
    const mannequin = String(formData.get("mannequin") || "female") as MannequinType;
    const background = String(formData.get("background") || "white") as BackgroundType;

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Please upload a garment image." }, { status: 400 });
    }
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ error: "Only JPG, PNG and WEBP images are supported." }, { status: 400 });
    }
    if (image.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 4 MB or smaller." }, { status: 400 });
    }
    if (!["male", "female", "ghost"].includes(mannequin) || !["white", "grey", "luxury"].includes(background)) {
      return NextResponse.json({ error: "Invalid generation options." }, { status: 400 });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const dataUri = `data:${image.type};base64,${bytes.toString("base64")}`;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
      input: {
        prompt: createFashionPrompt(mannequin, background),
        input_image: dataUri,
        aspect_ratio: "match_input_image",
        output_format: "png",
        safety_tolerance: 2,
        prompt_upsampling: false
      }
    });

    const first = Array.isArray(output) ? output[0] : output;
    const resultUrl = typeof first === "string" ? first : first?.toString?.();

    if (!resultUrl || !/^https?:\/\//i.test(resultUrl)) {
      return NextResponse.json({ error: "The image provider returned an unexpected result. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ imageUrl: resultUrl });
  } catch (error) {
    console.error("THREAD AI generation error:", error);
    const message = error instanceof Error ? error.message : "Image generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
