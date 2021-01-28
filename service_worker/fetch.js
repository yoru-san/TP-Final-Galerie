self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.indexOf("http://localhost:8080//images") === 0) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.status !== 200) {
          console.error(
            "Service Worker",
            "Error when fetching",
            event.request.url
          );

          return response;
        }

        return response.json().then((json) => {
          const formattedResponse = json.map((j) => ({
            name: j.name,
            description: j.description || "",
            updated_at: j.updated_at,
            url: j.url
          }));

          const finalResponse = new Response(JSON.stringify(formattedResponse));
          let savedResponse = finalResponse.clone();

          caches.open(cacheName).then(cache => {
            cache.put(event.request, savedResponse);
          });

          return finalResponse;
        });
      })
    );
  }
  else {
    event.respondWith(
      caches
        .open(cacheName)
        .then(cache => cache.match(event.request))
        .then(response => response || fetch(event.request))
    );
  }
});