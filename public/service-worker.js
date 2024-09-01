self.addEventListener("install",(ev)=>{
    //we try to cache/save the icons and all other data so even when offline they can be requested
    ev.waitUntil(
        caches.open("app-cache").then((cache)=>{
            //add items i.e files e.t.c that you would want to work offline here
            return cache.addAll(["","","","","",""])
        })
        .catch(err => console.log(err))
    )
})

self.addEventListener("fetch",(ev)=>{
    //on any fetching of data, the cache is checked first
    ev.respondWith(
        caches.match(ev.request).then(cachedResponse=>{
            return cachedResponse || fetch(ev.request)
        })
    )
})