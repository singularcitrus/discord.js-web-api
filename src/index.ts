export var defaultLogger: any = console;

export function OverrideDefaultSysOut(newValue: any) {
  defaultLogger = newValue;
}
