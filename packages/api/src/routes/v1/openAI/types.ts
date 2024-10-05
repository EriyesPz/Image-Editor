export interface GenerateProps {
  prompt?: string;
  category?: string;
  style?: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  n?: 1 | 2 | 3 | 4 | 5;
  response_format?: "url" | "b64_json";
}

export const Categories = [
  "College Mascot",
  "Custom Logo",
  "Embroidery Simulation",
  "Embroidery Patch",
  "Sport Logo",
];

export const Styles = [
  "Neon Art",
  "Logo",
  "Mascot",
  "Minimalist",
  "Character",
  "Cartoon",
  "Realistic",
];

export function getRandomElement(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
