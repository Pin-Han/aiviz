---
title: "Schema for AI: The structured data fields ChatGPT actually needs to recommend your product"
description: "Your Shopify store has Product Schema — but it's probably missing the fields AI search engines care about most. Learn which JSON-LD fields to add so ChatGPT and Perplexity can find and recommend your products."
date: "2026-07-25"
lang: "en"
tags: ["Structured Data", "Shopify SEO", "JSON-LD"]
---

Search Engine Land just published a piece called "Schema for AI search" about using structured data to show up in AI-driven results. I read it and immediately ran AIViz scans on a batch of Shopify stores. One thing surprised me:

**Most Shopify stores get their structured data only half right.**

Shopify auto-generates Product Schema — name, description, image, and price are covered. But AI search engines need more than that. When ChatGPT decides whether to recommend your product, it also looks at `aggregateRating`, `brand`, `gtin`, and `availability`. Without these, the AI doesn't have enough confidence to surface your product over a competitor's.

## AI search engines don't read your page like Google does

Google's ranking algorithm weighs hundreds of signals — backlinks, domain authority, page speed, user behavior. You've probably spent years optimizing for them.

ChatGPT and Perplexity ignore all of that.

According to Recomaze's research, ChatGPT pulls product information from two sources: **Bing Merchant Center product feeds** and **Schema.org structured data on your page**. It uses GTINs (barcodes) to cross-reference products against known databases. Perplexity crawls your page in real-time and reads JSON-LD Product markup directly.

Your SEO ranking doesn't matter here. If your JSON-LD is missing key fields, AI search engines won't recognize your product.

## What Shopify's auto-generated Schema misses

I scanned 30+ Shopify stores with AIViz. A clear pattern emerged. Shopify's Dawn theme (and most themes) auto-generate Product Schema that includes `name`, `description`, `image`, and `offers` with `price` and `priceCurrency`.

Almost universally missing:

**`aggregateRating`** — Rating score and review count. HubSpot's Consumer Trends Report found that 72% of consumers plan to use AI for shopping more frequently. When someone asks ChatGPT "recommend a good bluetooth speaker," products with rating data get prioritized.

**`brand`** — The brand name. Sounds basic, but most themes display the brand on the page without including it in the JSON-LD. AI crawlers read the structured data, not your visual layout.

**`gtin` / `mpn`** — Product barcodes or manufacturer numbers. ChatGPT uses these to cross-reference against Bing's product database. Products with GTINs are matched more accurately.

**`availability`** — Stock status. You don't want AI recommending an out-of-stock product to a potential customer.

I assumed at least `brand` would be common. After scanning, only 4 out of 30 stores had it correctly marked in their JSON-LD.

## How to fix it

The good news: you don't need to edit your Shopify theme's Liquid templates (though that's the cleanest approach). The fastest path is injecting additional JSON-LD via a Shopify App.

But first, figure out what's missing. Go to [AIViz](https://ai-vision-check-pink.vercel.app/), paste your product page URL, and the report will show you exactly which Schema fields need attention — with copy-paste fix code.

For example, if you're missing `aggregateRating` and `brand`, AIViz generates this snippet:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "brand": {
    "@type": "Brand",
    "name": "Your Brand Name"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "128"
  }
}
```

Add this to your product page, and AI search engines can read the complete picture.

## Beyond Product Schema — two things people forget

After fixing your structured data, there are two often-overlooked items:

**robots.txt**: Make sure you're not blocking AI crawlers. Add this to your `robots.txt`:

```
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /
```

Shopify's default `robots.txt` usually doesn't block AI crawlers, but if you've customized yours, check.

**llms.txt**: A Markdown file at your site root that helps AI crawlers understand your site structure. AskNeedle's research found that 83% of AI citations come from pages updated within the past 12 months. An `llms.txt` file signals that your site is active and maintained.

## What happens to your score after fixing this?

From what we've seen, filling in missing Schema fields typically moves an AIViz score from 30-40 to 80-100. The biggest score jumps come from Product Schema (20 pts) and aggregateRating (10 pts) — that's a 30-point swing from two fields.

But the score is just a proxy. The real difference: AI search engines now have enough information to recommend your product instead of skipping over it for a competitor who did the work.

## The one thing to do right now

Scan your best-selling product page. Check which Schema fields are red in the report. Fix those.

If you have dozens or hundreds of products, [SEO Checkup](https://apps.shopify.com/seo-checkup) scans your entire Shopify store at once — much faster than checking URLs one by one.

---

*Sources: [Search Engine Land — Schema for AI search](https://searchengineland.com/), [HubSpot — AEO Trends 2026](https://blog.hubspot.com/marketing/answer-engine-optimization-trends), [Recomaze — How AI Chooses Products](https://recomaze.ai/), [AskNeedle — AEO for E-commerce](https://www.askneedle.com/blog/the-guide-of-answer-engine-optimization-for-ecommerce-brands).*
