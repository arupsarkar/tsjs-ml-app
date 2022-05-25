export function register() {

  window.addEventListener('load', () => {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(sw => {
              console.log('Service Worker is registered', sw);
            })
            .catch(err => {
              console.error('Service Worker Error', err)
            })
    }
  })
}