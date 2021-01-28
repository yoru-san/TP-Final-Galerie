function getFavoris() {
  console.log("Get Favoris");
  return fetch(`http://localhost:8080/favoris`)
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => {
      console.log("Error: " + error);
    });
}

function getImages() {
  console.log("Get Images");
  return fetch(`http://localhost:8080/images`)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      return myJson;
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

function toggleFavori(id, isFavori) {
  var authorization;
  return fetch(`http://localhost:8080/toggleFavori/${id}`, { method: "PUT" })
    .then((res) => {
      Notification.requestPermission().then(function (result) {
        authorization = result;

        var title, body;
        if (isFavori == "false") {
          title = "Favori ajouté";
          body = "L'image a été ajouté en favori.";
        } else {
          title = "Favori retiré";
          body = "L'image a été retiré des favori.";
        }

        if (authorization === "granted") {
          new Notification(title, { body: body });
        } else {
          alert(body);
        }
      });
    })
    .catch((err) => {
      console.log(err);

      localforage.getItem("favorisOutbox").then((data) => {
        console.log("favorisOutbox");
        console.log(data);
        if (data == null) {
          data = [];
        } else {
          var index = data.indexOf(id);
          if (index == -1) {
            data.push(id);
          } else {
            data.splice(index, 1);
          }
        }
        localforage.setItem("favorisOutbox", data).then((_) => {
          navigator.serviceWorker.ready
            .then((reg) => reg.sync.register("syncFavoris"))
            .then((_) => {
              console.log("sync registered");
              console.log(data);
            });
        });
      });
    });
}
