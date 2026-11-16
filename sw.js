// LaneLock service worker: lets the site install as an app and open offline.
// Pages are fetched from the network first, so players always get the latest version;
// the cached copy is only used when there's no connection.
const CACHE = "lanelock-v1";
const SHELL = ["/", "/play/", "/how-it-works.html", "/about.html", "/pages.css", "/favicon.svg", "/icon-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // champion images, ads and stats go straight to the network
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && res.type === "basic") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() =>
      caches.match(req, { ignoreSearch: req.mode === "navigate" })
        .then(hit => hit || (req.mode === "navigate" ? caches.match("/play/") : Response.error()))
    )
  );
});
