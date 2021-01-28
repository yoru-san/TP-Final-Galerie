self.addEventListener('sync', event => {
    if (event.tag == 'syncFavoris') {
      event.waitUntil(
        syncFavoris()
      );
    }
});

function syncFavoris(){
    localforage.getItem("favorisOutbox").then((data) => {
        data.forEach(f => {
            fetch(`http://localhost:8080/toggleFavori/${f}`, { method: "PUT" })
        })

        localforage.setItem("favorisOutbox", []).then(_ => {
            localforage.getItem("favorisOutbox").then((data) => console.log(data));
        });
    }).catch(err => {console.log(err)})
}