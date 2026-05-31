import type { Rule } from '../../shared/types.js'

import { productSchemaRule } from './basic/product-schema.js'
import { nameDescriptionRule } from './basic/name-description.js'
import { priceCurrencyRule } from './basic/price-currency.js'
import { imageQualityRule } from './basic/image-quality.js'
import { aggregateRatingRule } from './basic/aggregate-rating.js'
import { brandInfoRule } from './basic/brand-info.js'
import { pageSpeedRule } from './advanced/page-speed.js'
import { llmsTxtRule } from './advanced/llms-txt.js'

export const allRules: Rule[] = [
  productSchemaRule,
  nameDescriptionRule,
  priceCurrencyRule,
  imageQualityRule,
  aggregateRatingRule,
  brandInfoRule,
  pageSpeedRule,
  llmsTxtRule,
]
