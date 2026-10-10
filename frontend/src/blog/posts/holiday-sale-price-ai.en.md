---
title: "Your Black Friday Sale Is Invisible to ChatGPT"
description: "Adobe expects AI traffic to retail sites to grow 130% this holiday season — and AI assistants already misquote prices by a median $300 (Product.ai). If your Shopify sale runs as an automatic discount, the price AI reads is still the full price. Here's how to check before November."
date: "2026-10-10"
lang: "en"
tags: ["Shopify SEO", "AI visibility", "Structured Data"]
---

Product.ai asked ChatGPT, Claude, Gemini and Perplexity the same 220 shopping questions, on both free and paid tiers, and checked the answers against live retail listings. They published the results on September 25. Of 913 price references they could verify, 85% matched the current listing. That sounds fine until you read the next line: when a price was wrong, it was wrong by a median of $300.

"There was almost no middle ground between exactly right and badly wrong," the researchers wrote.

I had assumed AI price errors were fuzzy — a model rounding, guessing, mixing up last year's model with this year's. That quote made me reconsider. The study doesn't say where the wrong numbers came from, but an error with no middle ground doesn't look like guessing to me. It looks more like the model read a number, faithfully, from a source that was wrong.

Which made me check one source you control completely: your own product page.

## The season you're about to walk into

Three days after the Product.ai study, Adobe released its holiday forecast. AI-referred traffic to US retail sites is projected to grow **130% year over year** between November 1 and December 31, with the sharpest spike on Thanksgiving Day (141%). Salesforce's prediction, published in July, is blunter: 20% of all holiday ecommerce traffic will originate from AI chat agents.

These are the visitors who convert. Adobe's August report had AI-referred shoppers converting 60% better than everyone else.

So in roughly three weeks, a lot more people are going to ask an assistant "what's the best [thing you sell] on sale right now", and the assistant is going to answer with a price. The question is whose price.

## Where the sale price goes missing

Here is the part most Shopify owners don't know, because nothing on their screen tells them.

Shopify gives you two ways to put something on sale. You can lower the product's price and set a compare-at price — the strikethrough number. Or you can create an automatic discount: "30% off everything in Winter Collection, November 24 to December 1." The second one is tempting for Black Friday, because it's one setting instead of editing 200 variants and then editing them back.

Automatic discounts are calculated in the cart, and they don't appear on the product page by default. One answer on Shopify's community forum puts the reason plainly: a discount might depend on what else is in the cart, so the product page can't know it in advance. That means the price in your page's JSON-LD — the `offers.price` field that ChatGPT and Perplexity read — stays at the full price for the entire sale.

Your banner says 30% off. Your structured data says $89. A shopper sees the banner. A machine sees $89.

Plenty of themes and discount apps paper over this with a JavaScript badge that rewrites the price on screen after the page loads. That helps the human. It doesn't help a crawler that only reads the HTML your server sent. Vercel and MERJ analyzed AI crawler traffic across Vercel's network and found that GPTBot and ClaudeBot download JavaScript files but never execute them.

The result is a quiet, specific failure. When someone asks an assistant for a deal in your category, your product shows up at full price next to a competitor whose sale price is in their markup. You were cheaper. The machine didn't know.

## The shopper blames you, not the bot

You might think a wrong AI answer is the AI's problem. Shoppers disagree.

Rithum surveyed 1,046 online shoppers in the US and UK this spring. 58% said they blame the retailer or brand when an AI recommendation contains incorrect product information. 16% said they'd avoid buying the product entirely after a bad recommendation.

The cost runs both directions, too. If your schema shows a stale *lower* price — say you ran a sale last month with compare-at pricing and forgot to set the real price back — the assistant quotes the cheap number, the shopper clicks through, and your page asks for more. That's not a lost recommendation. That's a customer who now thinks you bait-and-switched them, during the one week of the year you most need them to trust you.

## The fix is boring, which is good news

For the handful of products you actually expect to sell over Black Friday — your top ten, not your whole catalog — run the sale as a compare-at price instead of an automatic discount. Shopify's default `structured_data` output then puts the sale price in `offers.price`, the same number the shopper sees. You can schedule the change with Shopify Flow or a bulk price-editor app so you're not editing variants at 2 a.m. on Thanksgiving.

Keep the automatic discount for the long tail if you like. The point is that the products AI is most likely to be asked about carry a price it can read.

Then put the reversal on your calendar for the morning after Cyber Monday. A stale sale price in December does more damage than a missing one in November.

## Before November 1, check one URL

Pick your single best-selling product — the one you'll feature in every holiday email. [Scan its URL with AIViz](https://ai-vision-check-pink.vercel.app/) and find the price check in the report. It shows the exact price and currency a machine pulls out of your page's structured data. Now open the same page in a private window and compare it with what a shopper would actually pay.

If they match, you're done. If they don't, you've just found the gap between your sale and every assistant that's about to be asked about it. Do the check again once your sale is live, because that's when the two numbers are most likely to drift apart.

If you have more than a few hero products, [SEO Checkup](https://apps.shopify.com/seo-checkup) runs the same price check across every product page in one pass, which is faster than doing it by hand the night before the sale starts.

Your discount is real. Make sure the number a machine reads says so.

---

*Sources: [Product.ai — AI Shopping Divergence Study](https://product.ai/research/ai-shopping-divergence-study/) (via [Tech.co](https://tech.co/news/ai-shopping-assistants-not-ready-holidays)), [Adobe holiday forecast 2026](https://cryptobriefing.com/adobe-chatgpt-holiday-shopping-forecast/), [Adobe — AI Traffic Trends Report, August 2026](https://business.adobe.com/resources/sdk/ai-traffic-trends-report-august-2026), [Salesforce — 2026 Holiday Retail Predictions](https://www.salesforce.com/blog/holiday-retail-predictions-2026/), [Rithum — The New Discovery Engine](https://fashionunited.com/news/retail/when-ai-shares-incorrect-information-58-of-shoppers-blame-the-brand/2026032671432), [Shopify Community — Automatic discount visibility](https://community.shopify.com/t/automatic-discount-code-visibility/630655), [Vercel — The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler).*
