import type { AsepOptions, NonCommandOptions } from "#asep/types";
import type { BaseCommand } from "seyfert";

type Instantiable<T> = new (...args: any[]) => T;

export function AsepOptions<A extends Instantiable<any>>(
  options: A extends Instantiable<BaseCommand>
    ? AsepOptions
    : NonCommandOptions,
) {
  return (target: A) =>
    class extends target {
      constructor(...args: any[]) {
        super(...args);
        Object.assign(this, options);
      }
    };
}
