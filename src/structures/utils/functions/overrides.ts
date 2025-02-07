import { Configuration } from "#asep/data/Configuration.js";
import { AnyContext, Embed, Formatter } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { formatOptions } from "./formatters.js";
import { SemuaPesan } from "#asep/data/Constants.js";

export async function onRunError(ctx: AnyContext, error: unknown) {
  ctx.client.logger.error(error);

  await ctx.editOrReply({
    flags: MessageFlags.Ephemeral,
    content: "",
    embeds: [
      {
        description: SemuaPesan.events.commandsError,
        color: Configuration.colors.errors,
      },
    ],
  });
  return;
}

export async function onOptionsError(ctx: AnyContext) {
  if (!ctx.isChat()) return;

  const command = ctx.command.toJSON();
  const options = formatOptions(command.options, SemuaPesan.events.optionTypes);

  const embed = new Embed()
    .setColor("Red")
    .setThumbnail(ctx.author.avatarURL())
    .setDescription(
      SemuaPesan.events.invalidOptions({
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
