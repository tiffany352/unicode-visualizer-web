import en_us from "./en_us.json";

const Strings = {
  en_us
};
export default Strings;

export function getDisplayText(key: string): string {
  let current = en_us as any;
  for (const part of key.split(".")) {
    current = current && current[part];
  }

  return current !== undefined ? current : key;
}
