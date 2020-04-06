interface Input {
  interfaceName: string;
}
export function generate({ interfaceName }: Input): string {
  const result = `
  interface ${interfaceName} {
    a: string;
  }
  `;

  return result;
}
