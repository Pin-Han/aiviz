import type { Rule } from '../../shared/types.js'

// Accessibility rules (most fundamental — can AI crawlers access the page?)
import { robotsTxtRule } from './accessibility/robots-txt.js'
import { metaDescriptionRule } from './accessibility/meta-description.js'
import { imageAltRule } from './accessibility/image-alt.js'
import { jsRenderingRule } from './accessibility/js-rendering.js'
import { canonicalUrlRule } from './accessibility/canonical-url.js'

// Basic rules (structured data quality)
import { productSchemaRule } from './basic/product-schema.js'
import { nameDescriptionRule } from './basic/name-description.js'
import { priceCurrencyRule } from './basic/price-currency.js'
import { imageQualityRule } from './basic/image-quality.js'
import { aggregateRatingRule } from './basic/aggregate-rating.js'
import { brandInfoRule } from './basic/brand-info.js'

// Advanced rules (forward-looking optimizations)
import { pageSpeedRule } from './advanced/page-speed.js'
import { llmsTxtRule } from './advanced/llms-txt.js'

export const allRules: Rule[] = [
  // Accessibility
  robotsTxtRule,
  metaDescriptionRule,
  imageAltRule,
  jsRenderingRule,
  canonicalUrlRule,
  // Basic
  productSchemaRule,
  nameDescriptionRule,
  priceCurrencyRule,
  imageQualityRule,
  aggregateRatingRule,
  brandInfoRule,
  // Advanced
  pageSpeedRule,
  llmsTxtRule,
]
