import type { PageData, AiReadabilityResponse, SearchSimulationResult } from '../../shared/types.js'

export interface AIProvider {
  assessReadability(pageData: PageData): Promise<AiReadabilityResponse>
  simulateSearch(pageData: PageData): Promise<SearchSimulationResult>
}
