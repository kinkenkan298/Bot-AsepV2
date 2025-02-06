export const sliceText = (text: string, max: number = 100) =>
  text.length > max ? `${text.slice(0, max)}...` : max;
