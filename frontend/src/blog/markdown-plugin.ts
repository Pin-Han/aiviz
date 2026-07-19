import type { Plugin } from 'vite'
import fm from 'front-matter'
import { marked } from 'marked'

/**
 * Vite plugin that transforms .md files into JS modules exporting
 * { attributes (frontmatter), html (rendered markdown) }.
 */
export default function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown',
    transform(src: string, id: string) {
      if (!id.endsWith('.md')) return null

      const { attributes, body } = fm<Record<string, unknown>>(src)
      const html = marked.parse(body, { async: false }) as string

      return {
        code: `export const attributes = ${JSON.stringify(attributes)};
export const html = ${JSON.stringify(html)};
export default { attributes, html };`,
        map: null,
      }
    },
  }
}
