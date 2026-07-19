export const SHOPIFY_APP_URL = 'https://apps.shopify.com/'

/**
 * Returns an onClick handler that fires a GA4 event before navigating.
 * @param location — where the click happened (e.g. 'report_detected', 'about_shopify_cta')
 */
export function trackShopifyClick(location: string) {
  return () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'shopify_app_click', {
        click_location: location,
        link_url: SHOPIFY_APP_URL,
      })
    }
  }
}
