import { pascalCase } from "pascal-case";
import { writeLog } from "fast-node-logger";
import { arrayToLines } from "../helpers/utils";
import { jsTypeMapper } from "../helpers/type-map";
import type { SchemaClassWithAttributes } from "../helpers/map-class-attributes";

interface GenerateGraphqlTypeFnInput {
  data: SchemaClassWithAttributes;
}

export function generateGraphqlType({
  data,
}: GenerateGraphqlTypeFnInput): string {
  writeLog(`generateGraphqlType()`, { level: "trace" });

  const result = `
  `;

  return result;
}
