import { AnyContext } from "seyfert";

export const sliceText = (text: string, max: number = 100) =>
  text.length > max ? `${text.slice(0, max)}...` : max;

export const getCollectionKey = (ctx: AnyContext): string => {
  const authorId = ctx.author.id;
  if (ctx.isChat() || ctx.isMenu() || ctx.isEntryPoint())
    return `${authorId}-${ctx.fullCommandName}-command`;
  if (ctx.isComponent() || ctx.isModal())
    return `${authorId}-${ctx.customId}-component`;

  return `${authorId}-all`;
};
export function splitTextByAmount(
  text: string,
  amount: number,
  character = "\n",
): Array<string> {
  const parts: Array<string> = [];

  if (character) {
    const split = text.split(character);
    if (split.length === 1) {
      return split;
    }
    while (split.length) {
      let newText: string = "";
      while (newText.length < amount && split.length) {
        const part = split.shift()!;
        if (part) {
          if (amount < newText.length + part.length + 2) {
            split.unshift(part);
            break;
          }
          newText += part + "\n";
        }
      }
      parts.push(newText);
    }
  } else {
    while (text.length) {
      parts.push(text.slice(0, amount));
      text = text.slice(amount);
    }
  }
  return parts;
}
