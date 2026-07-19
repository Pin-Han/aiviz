export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  lang: 'en' | 'zh-TW'
  tags: string[]
  coverAlt?: string
}

export interface BlogPost extends BlogPostMeta {
  html: string
}
