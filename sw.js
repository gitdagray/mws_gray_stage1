/* serviceWorker */

// name the static cache
const CACHE_STATIC_NAME = 'static-v1';

//name the dynamic cache
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

// define the array of static files
const STATIC_FILES = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/img/1_400.jpg',
  '/img/1_800.jpg',
  '/img/2_400.jpg',
  '/img/2_800.jpg',
  '/img/3_400.jpg',
  '/img/3_800.jpg',
  '/img/4_400.jpg',
  '/img/4_800.jpg',
  '/img/5_400.jpg',
  '/img/5_800.jpg',
  '/img/6_400.jpg',
  '/img/6_800.jpg',
  '/img/7_400.jpg',
  '/img/7_800.jpg',
  '/img/8_400.jpg',
  '/img/8_800.jpg',
  '/img/9_400.jpg',
  '/img/9_800.jpg',
  '/img/10_400.jpg',
  '/img/10_800.jpg'
];

// install the serviceWorker and add all static files to cache
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing service worker...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
     .then(cache => {
       console.log('[Service Worker] Precaching App Shell');
       return cache.addAll(STATIC_FILES);
     })
  )
});

// log a message for the active serviceWorker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating service worker...', event);
  //return self.clients.claim(); // this makes the sw kick in immediately
});

// handle fetch requests
self.addEventListener('fetch', event => {

  const url = new URL(event.request.url);

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function(){
     // check the static cache
     const staticCache = await caches.open(CACHE_STATIC_NAME);
     const staticResponse = await staticCache.match(url.pathname, {ignoreSearch: true});
     // return if found
     if (staticResponse) {
       console.log('from static cache...');
       console.log(url.pathname);
       return staticResponse;
     }

     //check the dynamic cache
     const dynamicCache = await caches.open(CACHE_DYNAMIC_NAME);
     const dynamicResponse = await dynamicCache.match(url);
     // return if found
     if (dynamicResponse) {
       console.log('from dynamic cache...');
       console.log(url);
       return dynamicResponse;
     }

      //not in either cache...
      //get response from network and store in dynamic cache
      console.log('from network...');
      console.log(url);
      try{
        const response = await fetch(url,{ mode: 'no-cors' });
        if (response) {
          const responseToNetwork = response.clone();
          dynamicCache.put(url, responseToNetwork);
        }
        return response;
      } catch(e) {
        console.log(e);
      }


  }()); //event.respondWith
}); //addEventListener
