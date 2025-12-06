import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Export shared UI components here
// export { Button } from "./components/Button";
// export { Card } from "./components/Card";
