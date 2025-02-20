export interface Variants {
  href: string;
  content_length: number;
  file_extenstion?: string;
  image_width?: number;
  image_height?: number;
}

export type ItemVideo = {
  type: "video" | "image" | "audio";
  variants: Variants[];
};

export type Task = {
  type: "Tiktok" | "Youtube" | "Instagram";
  href: string;
};
