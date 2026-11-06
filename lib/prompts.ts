export type MannequinType = "male" | "female" | "ghost";
export type BackgroundType = "white" | "grey" | "luxury";

export function createFashionPrompt(type: MannequinType, background: BackgroundType) {
  const subject = {
    male: "a professional male fashion model with a natural confident pose",
    female: "a professional female fashion model with a natural confident pose",
    ghost: "a premium invisible ghost mannequin product presentation, with the garment naturally shaped as if worn",
  }[type];

  const setting = {
    white: "a seamless pure white studio background",
    grey: "a clean soft light-grey studio background",
    luxury: "an understated luxury studio setting with a warm neutral architectural background",
  }[background];

  return `Create an ultra-realistic professional fashion e-commerce photograph using the uploaded garment as the exact product reference. Present it on ${subject}. Use ${setting}, soft professional studio lighting, realistic fabric texture, accurate natural shadows, premium commercial fashion photography, crisp focus and a clean composition.

CRITICAL PRODUCT PRESERVATION RULES:
- Preserve the original garment exactly: same colour, shade, print, pattern, logo, lettering, embroidery, labels, buttons, zippers, pockets, seams, stitching, collar, cuffs, hems and all construction details.
- Do not redesign, embellish, simplify, remove, invent, mirror or alter any brand logo, text or graphic.
- Do not change garment proportions, fit, sleeve length, neckline, silhouette or fabric appearance.
- Keep the entire garment visible and make it the clear focal point.
- Do not add accessories, jewellery, bags, props or extra garments.
- The result must look like a real photograph, not an illustration, 3D render or AI painting.
- If a detail is unclear in the source image, preserve its appearance rather than inventing a new detail.`;
}
