import path from "path";

export const defaultOutDir = path.join(process.cwd(), "generated");
export const defaultInterfacesDir = path.join(defaultOutDir, "interfaces");
export const defaultEnumsDir = path.join(defaultOutDir, "enums");
