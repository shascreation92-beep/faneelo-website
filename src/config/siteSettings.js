/**
 * Site Configuration
 * 
 * To show or hide the "Working on site" full-screen maintenance page,
 * simply change `maintenanceMode` to true or false.
 */
export const SITE_CONFIG = {
  // Set to `true` to show the full-screen "Working on site" page to visitors.
  // Set to `false` when the website is ready for normal public browsing.
  maintenanceMode: true,

  // Notice text and details
  notice: {
    badge: 'Scheduled Site Maintenance',
    title: 'We’re Currently Working On Our Website',
    subtitle: 'Our digital showroom is undergoing scheduled improvements to bring you an upgraded luxury shopping experience. We’ll be back online shortly.',
    expectedReturn: 'Returning very soon today',
    whatsAppPrompt: 'Hi Faneelo, I saw your site is currently being updated. I would like to inquire about sofa styles and delivery.',
  }
};
