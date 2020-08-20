const staticFeeshDrift = "feesh-drift-v1.1"
const assets = [
    "/",
    "/index.html",
    "/css.css",
    "/float.js",
    "/assets/rock.png",
    "/assets/rock2.png",
    "/assets/water1.png",
    "/assets/water2.png",
    "/assets/water3.png",
    "/assets/water4.png",
    "/assets/water5.png",
    "/assets/water_refl_1.png",
    "/assets/water_refl_2.png",
    "/assets/feesh1.png",
    "/assets/feesh2.png",
    "/assets/feesh3.png",
    "/assets/feesh4.png",
    "/assets/feesh5.png",
    "/assets/feesh6.png",
    "/assets/feesh7.png",
    "/assets/ripple1.png",
    "/assets/ripple2.png",
    "/assets/ripple3.png",
    "/assets/ripple4.png",
    "/assets/blank.png",
    "/assets/padded1.png",
    "/assets/padded2.png",
    "/assets/padded3.png",
    "/assets/padded4.png",
    "/assets/padded5.png",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticFeeshDrift).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})