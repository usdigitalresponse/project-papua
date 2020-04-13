import { csv } from "./csv";
import { Config } from '../index'

export declare type Transformer = (cfg: Config, claims: object[]) => Promise<object>;

const transformers: Record<string, Transformer> = {
  csv,
};

export function getTransformer(): Transformer {
  // The STATE_CODE environment variable decides which transformer to apply.
  const stateCode = process.env.STATE_CODE;
  if (!stateCode) {
    throw new Error(
      "You must set a STATE_CODE environment variable set to your 2-letter state code"
    );
  }

  // This is pretty up-in-the-air, but roughly each state would have their own transformer
  // in this folder. We then select one of them based on the STATE_CODE variable.
  //
  // We have a special transformer (csv) as a demo.
  const transformer = transformers[stateCode.toLowerCase()];
  if (!transformer) {
    console.log("Known state codes: ", Object.keys(transformers));
    throw new Error(`Unknown state code (${stateCode})`);
  }

  return transformer;
}
