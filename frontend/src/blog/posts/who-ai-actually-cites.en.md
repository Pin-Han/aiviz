---
title: "The AI Recommendation Doesn't Happen on Your Product Page"
description: "68% of AI citations come from sites you don't own (Erlin, 500 brands, August 2026). ChatGPT cites YouTube, Reddit and RTINGS for product answers — brand domains barely register. So what is your Shopify product page actually for?"
date: "2026-09-06"
lang: "en"
tags: ["GEO", "AI visibility", "Shopify SEO"]
---

A monitoring company called cloro ran 3,312 product-intent queries across six AI engines and recorded every domain the answers cited. For ChatGPT, the top sources were YouTube at 19%, Reddit at 19%, and RTINGS at 16%, followed by Google, Forbes, PCMag and CNET in single digits. The first retailer on the list is Amazon, at 5%.

The brands that actually make the products barely appear.

I have now written two posts on this blog telling you to fix your product page's structured data. That advice still holds. But I framed it wrong, and the framing turns out to matter more than the advice.

## What I got wrong about the 40%

Last month I quoted the Princeton GEO paper: adding quotations, statistics and cited sources lifted citation visibility by 30-40%. The number is real. In July, Olivier Martinez published a critical survey of GEO research covering 2023 to 2026, and it reads that same paper more carefully. The caveat is the whole story — the 40% is a *relative* gain measured inside a fixed set of five documents the model had already retrieved.

Translated: the study shows what happens once your page is in the pile the model is reading from. It says nothing about how your page gets into the pile.

The survey is unsparing about the rest of the field too. On C-SEO Bench, only three of 54 tested method-and-domain combinations came out reliably positive. On E-GEO, a testbed built for e-commerce specifically, ten of fifteen starting heuristics were neutral or actively harmful. Keyword stuffing scored null to negative across benchmarks, which will surprise nobody.

So there are two problems here, and I had been writing as though there were one. Getting retrieved. Getting cited. Schema helps with the second. The cloro data says the first is decided somewhere else entirely.

## The recommendation happens on other people's pages

Erlin tracked 500 brands across ChatGPT, Claude, Gemini and Perplexity and published the split in August: 68% of AI citations come from third-party sources, 32% from brand-owned pages. They also measured how much weight different third parties carry relative to a brand's own content:

- Reddit discussions: 3.4x
- Wikipedia: 2.9x
- G2 and Capterra reviews: 2.6x
- YouTube: 2.1x

AirOps found a steeper version of the same shape — 21,311 brand mentions across 500+ commercial-intent queries, with only 13.2% coming from brand domains, and nearly 90% of third-party mentions originating in listicles, comparisons and reviews. Their sample was B2B software, so I would not transplant that 13.2% onto a store selling cookware. cloro's categories were consumer: electronics, wearables, home, kitchen, audio, outdoor. Different data, same direction.

Which raises an uncomfortable question. If the model decides by reading RTINGS and Reddit, what is your product page even for?

## Your page is the fact-check, not the pitch

Here is the model I have landed on, and it changed how I read my own tool's output.

Third-party sources tell the machine *that* your product is worth mentioning. Your page tells it *what is true about the product right now* — the current price, whether it's in stock, the exact model number, the real review count. A review site from March can say your speaker sounds good. It cannot say what the speaker costs today.

When the two disagree, the model has a problem. If your page claims 4.6 stars from 312 reviews and your Trustpilot profile says 3.9 from 40, one of those is getting dropped — and it will not be the independent one.

Erlin's numbers on fact density point the same way. Brands with nine or more structured facts about a product averaged 78% AI coverage. Brands with zero to two managed 9%. Each additional attribute was worth roughly 8.3% more median coverage. They also measured decay: coverage falls about 1.8% per month on untouched pages, while pages updated monthly ran 23% ahead of ones left alone.

Nine facts is not a content project. Brand, GTIN, model number, price, currency, availability, material, dimensions, aggregate rating. Most Shopify themes already display seven of those somewhere on the page and put two of them in the JSON-LD.

## You are probably undercounting this channel already

One more thing worth knowing before you decide AI traffic is too small to bother with.

The Digital Bloom's analysis found that roughly 70.6% of AI referral traffic arrives in Google Analytics labelled "direct", because assistants frequently strip the referrer. So when you open GA4 and see AI sending 1% of sessions, the honest number is likely several times that, sitting in a bucket you have been ignoring for years.

It converts, too. Visibility Labs tracked 94 e-commerce stores over twelve months and found ChatGPT sessions converting at 1.81% against 1.39% for non-branded organic.

## One thing to do this week

Open ChatGPT and ask it what a customer would ask — "best [your category] under [your price]" — then read the citations rather than the answer. Whichever domains come back are your real competitive set. That is where the recommendation gets made, and no amount of on-page work will put you there.

Then check whether your page corroborates them. [Run your best-selling product URL through AIViz](https://ai-vision-check-pink.vercel.app/) and look at what a machine can actually extract: does it find your brand, your GTIN, your rating, your stock status? If it can't, you are absent from the conversation even on the days a reviewer puts you in it.

If you're past a handful of SKUs, [SEO Checkup](https://apps.shopify.com/seo-checkup) runs the same check across every product page in one pass.

You can't make Reddit talk about you this week. You can make sure that when it does, the machine reading along finds a page that backs it up.

---

*Sources: [cloro — AI Shopping: What ChatGPT Recommends](https://cloro.dev/blog/ai-shopping-chatgpt-recommends/), [Erlin — AEO Best Practices in 2026: What 500 Brands' Data Reveals](https://www.erlin.ai/blog/aeo-best-practices), [AirOps — The Influence of Offsite Signals in AI Search](https://www.airops.com/report/the-influence-of-offsite-signals-in-ai-search), [Martinez — Optimizing Visibility in Generative Engines: A Critical Survey of GEO (2023–2026)](https://arxiv.org/abs/2607.14035), [Zero Click Project — ChatGPT Shopping Ecommerce Discovery Research](https://www.zeroclickproject.com/insights/research/chatgpt-shopping-ecommerce-discovery-research).*
