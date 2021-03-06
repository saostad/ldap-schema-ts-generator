import path from "path";

export const defaultOutDir = path.join(process.cwd(), "generated");
export const defaultInterfacesDir = path.join(defaultOutDir, "interfaces");
export const defaultEnumsDir = path.join(defaultOutDir, "enums");
export const defaultJsonDir = path.join(defaultOutDir, "json");
export const defaultGraphqlDir = path.join(defaultOutDir, "graphql");
export const defaultGraphqlClientDir = path.join(defaultGraphqlDir, "client");
export const defaultGraphqlScalarDir = path.join(defaultGraphqlDir, "scalar");
export const defaultMetaDir = path.join(defaultOutDir, "meta");
