import type { PageData, AiReadabilityResponse } from '../../shared/types.js'

export interface AIProvider {
  assessReadability(pageData: PageData): Promise<AiReadabilityResponse>
}
