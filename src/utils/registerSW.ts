// This file handles the registration of the service worker for the PWA

export function registerSW() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(
        (registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          // Check for updates
          registration.update().catch(err => {
            console.log('ServiceWorker update failed: ', err);
          });
        },
        (err) => {
          console.error('ServiceWorker registration failed: ', err);
          // Fallback to the original service worker if the new one fails
          if (err.message.includes('The path of the provided scope')) {
            console.log('Falling back to root scope');
            navigator.serviceWorker.register('/sw-clean.js').catch(console.error);
          }
        }
      );
    });
  }
}

// Export the function as default
export default registerSW;
