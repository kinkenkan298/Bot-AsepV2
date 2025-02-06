import type { AsepClient } from "#asep/client";
import type { AsepMiddleware } from "#asep/middlwares";
import type { AsepOptions } from "#asep/types";
import type { ParseClient, ParseMiddlewares } from "seyfert";

declare module "seyfert" {
  interface InternalOptions {
    withPrefix: true;
  }

  interface Command extends AsepOptions {}
  interface SubCommand extends AsepOptions {}
  interface ComponentCommand extends AsepOptions {}
  interface ModalCommand extends AsepOptions {}
  interface ContextMenuCommand extends AsepOptions {}
  interface EntryPointCommand extends AsepOptions {}

  interface UsingClient extends ParseClient<AsepClient> {}
  interface RegisteredMiddlewares
    extends ParseMiddlewares<typeof AsepMiddleware> {}
  interface GlobalMetadata extends ParseMiddlewares<typeof AsepMiddleware> {}
  //interface ExtendContext extends ReturnType<typeof customExtend>
}
