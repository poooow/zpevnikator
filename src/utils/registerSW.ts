// This file handles the registration of the service worker for the PWA

export function registerSW() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        },
        (err) => {
          console.error('ServiceWorker registration failed: ', err);
        }
      );
    });
  }
}

// Export the function as default
export default registerSW;
