export interface Variants {
  uri_path: string;
  content_length: number;
  file_name?: string;
  music?: string[];
}

export type ItemVideo = {
  type: "video" | "image" | "audio";
  variants: Variants[];
};

export type Task = {
  type: "Tiktok" | "Youtube" | "Instagram";
  href: string;
};
