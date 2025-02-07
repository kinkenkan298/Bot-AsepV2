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
