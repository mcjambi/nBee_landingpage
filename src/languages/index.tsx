// @ts-nocheck
import * as vi from "./vi.json";
import * as en from "./en.json";
type TranslationKeys = keyof typeof vi;

/**
 * Translate function, _lang=vi / en / any language that this CRM support ...
 * @param _originalString any string need to translate
 * return translate string or original variable
 */

export default function __(_originalString: string): string {
  const _lang = localStorage.getItem("language") || "vi";
  let originalString = String(_originalString).trim();

  if (["vi", "en"].indexOf(_lang) < 0) {
    throw new Error(_lang + " not support! Add more language to /languages");
  }

  let translatedString: string = "";
  switch (_lang) {
    case "vi":
      translatedString =
        vi[originalString as TranslationKeys] || String(originalString);
      break;
    case "en":
      translatedString =
        en[originalString as TranslationKeys] || String(originalString);
      break;
    default:
      translatedString = String(originalString);
      break;
  }
  return translatedString;
}

type TypedReplacement = {
  [propName: string]: JSX.Element;
};

/**
 * translate using place holder ...
 * eg: ___('Hello {user_name}', { user_name: <Text>JAM</Text>});
 * @param _string
 * @returns
 */

export function ___(_string: any, replacement: TypedReplacement): any {
  const result: string[] = [];
  const keys = Object.keys(replacement);
  const getRegExp = () => {
    const regexp: string[] = [];
    keys.forEach((key) => regexp.push(`{${key}}`));
    return new RegExp(regexp.join("|"));
  };
  __(_string)
    .split(getRegExp())
    .forEach((item, i) => {
      result.push(item, replacement[keys[i]]);
    });
  return result;
}
