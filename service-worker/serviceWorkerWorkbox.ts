import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { registerRoute, NavigationRoute } from "workbox-routing"
import { skipWaiting, clientsClaim } from 'workbox-core'

declare const self: Window & ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)

const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
    denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
})

registerRoute(navigationRoute)