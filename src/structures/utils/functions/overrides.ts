import { Configuration } from "#asep/data/Configuration.js";
import { AnyContext, Embed, Formatter } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { formatOptions } from "./formatters.js";

export async function onRunError(ctx: AnyContext, error: unknown) {
  ctx.client.logger.error(error);
  const { messages } = ctx.client.t(ctx.client.config.defaultLocale).get();

  await ctx.editOrReply({
    flags: MessageFlags.Ephemeral,
    content: "",
    embeds: [
      {
        description: messages.events.commandsError,
        color: Configuration.colors.errors,
      },
    ],
  });
  return;
}

export async function onOptionsError(ctx: AnyContext) {
  if (!ctx.isChat()) return;

  const command = ctx.command.toJSON();
  const { messages } = ctx.client.t(ctx.client.config.defaultLocale).get();
  const options = formatOptions(command.options, messages.events.optionTypes);

  const embed = new Embed()
    .setColor(Configuration.colors.errors)
    .setThumbnail(ctx.author.avatarURL())
    .setDescription(
      messages.events.invalidOptions({
        options: Formatter.codeBlock(
          options.map(({ option }) => option).join(" "),
          "js",
        ),
        list: options
          .map(
            ({ option, description, range }) =>
              `* \`${option}\` \`[${range || "N/A"}]\`: ${description}`,
          )
          .join("\n"),
      }),
    )
    .setTimestamp();

  return ctx.editOrReply({
    content: "",
    flags: MessageFlags.Ephemeral,
    embeds: [embed],
  });
}
