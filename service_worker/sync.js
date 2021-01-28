self.addEventListener('sync', event => {
    console.log("sync event")
    console.log(event.tag)
    if (event.tag == 'syncFavoris') {
      event.waitUntil(
        syncFavoris()
      );
    }
});

function syncFavoris(){
    console.log("Synchro favoris");

    localforage.getItem("favorisOutbox").then((data) => {
        console.log("favorisOutbox");
        console.log(data);
        data.forEach(f => {
            fetch(`http://localhost:8080/toggleFavori/${f}`, { method: "PUT" })
        })

        localforage.setItem("favorisOutbox", []).then(_ => {
            console.log("Sync favoris terminée");
            localforage.getItem("favorisOutbox").then((data) => console.log(data));
        });
    }).catch(err => {console.log(err)})
}