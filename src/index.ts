export * from "./types";
export * from "./classes/Client";

export * as Authenticated from "./middleware/Authenticated";

export var defaultLogger: any = console;

export function OverrideDefaultSysOut(newValue: any) {
  defaultLogger = newValue;
}
