declare module '*.md' {
  export const attributes: Record<string, unknown>
  export const html: string
  const mod: { attributes: Record<string, unknown>; html: string }
  export default mod
}
