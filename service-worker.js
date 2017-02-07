/**
 * Script to prefretch resources so that the page can be displayed offline.
 * The code is adapted from http://www.html5rocks.com/en/tutorials/service-worker/introduction/.
 */

importScripts('serviceworker-cache-polyfill.js');

var CACHE_VERSION = '2.24.3';
var CACHE_NAME = 'checkpcr-cache-v1';

var urlsToCache = [
	"/",
	"index.html",
	"font/material-design-icons/MaterialIcons-Regular.eot",
	"font/material-design-icons/MaterialIcons-Regular.ttf",
	"font/material-design-icons/MaterialIcons-Regular.woff",
	"font/material-design-icons/MaterialIcons-Regular.woff2",
	"font/roboto/Roboto-Bold.ttf",
	"font/roboto/Roboto-Bold.woff",
	"font/roboto/Roboto-Bold.woff2",
	"font/roboto/Roboto-Light.ttf",
	"font/roboto/Roboto-Light.woff",
	"font/roboto/Roboto-Light.woff2",
	"font/roboto/Roboto-Medium.ttf",
	"font/roboto/Roboto-Medium.woff",
	"font/roboto/Roboto-Medium.woff2",
	"font/roboto/Roboto-Regular.ttf",
	"font/roboto/Roboto-Regular.woff",
	"font/roboto/Roboto-Regular.woff2",
	"font/roboto/Roboto-Thin.ttf",
	"font/roboto/Roboto-Thin.woff",
	"font/roboto/Roboto-Thin.woff2",
	"images/bkg.svg",
	"images/clouds.svg",
	"images/hills.svg",
	"images/hills2.svg",
	"images/moon.svg",
	"images/snow.svg",
	"images/snowDark.svg",
	"images/sun.svg",
	"images/github.svg",
	"client.js",
	"favicon.ico",
	"icon_16.png",
	"icon_32.png",
	"icon_36.png",
	"icon_64.png",
	"icon_72.png",
	"icon_96.png",
	"icon_120.png",
	"icon_128.png",
	"icon_144.png",
	"icon_152.png",
	"icon_192.png",
	"hammer.min.js",
	"headroom.min.js",
	"diff_match_patch/diff_match_patch.js",
	"chrono.min.js",
	"tinycolor-min.js",
	"web-animations.min.js",
	"parse-1.6.12.min.js",
	"sjcl.js",
	"index.html",
	"style.css"
];

// Set the callback for the install step
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
			.then(function() {
				self.clients.matchAll().then(function(all) {
					all.map(function(client) {
						client.postMessage({getCommit: true});
					});
				});
			})
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
	console.log("deleting old caches");
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
