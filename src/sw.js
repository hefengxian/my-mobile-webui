/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06-24 16-07
 * @version 1.0
 */

// This is the code piece that GenerateSW mode can't provide for us.
// This code listens for the user's confirmation to update the app.
self.addEventListener('message', (e) => {
    if (!e.data) {
        return
    }

    switch (e.data) {
        case 'skipWaiting':
            self.skipWaiting()
            break
        default:
            // NOOP
            break
    }
})

workbox.clientsClaim()

// The precaching code provided by Workbox.
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
