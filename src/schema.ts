import { CT, CTTypes } from "../deps.ts";
export type { CTInfer as Infer } from "../deps.ts";

export const types = {
  ...CTTypes,
  object: CT,
  string2number: CTTypes
    .string
    .transform((V) => Number(V))
    .test((V) => !isNaN(V)),
};
