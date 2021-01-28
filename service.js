const publicKey = "BBuliSqEe9KKtp2AxfHLzgv-e3iDjtL2L2nOFheosPEnT3L8JpG6aUXtmFndP-TQCr6TYQw5RckcszO4EjqnuCA";

function getFavoris() {
  return fetch(`http://localhost:8080/favoris`)
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => {
      console.log("Error: " + error);
    });
}

function getImages() {
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

function toggleFavori(id) {
  return fetch(`http://localhost:8080/toggleFavori/${id}`, { method: "PUT" })
    .then(() => {
    })
    .catch((err) => {
      console.log(err);

      localforage.getItem("favorisOutbox").then((data) => {
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

async function send() {
  const register = await navigator.serviceWorker
    .register("./sw.js", { updateViaCache: "none", scope: '/' });


  register.addEventListener("updatefound", () => {
    const installing = reg.installing;
    installing.addEventListener("statechange", () => {
      if (installing.state === "installed") {
        console.log("Votre service worker a été mis à jour! Veuillez rafraîchir la page");
      }
    });
  });

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await fetch("http://localhost:8080/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json"
    }
  });

  if ("sync" in register) {
    navigator.permissions.query({ name: "background-sync" })
      .then((result) => {
        if (result.state === "granted") {
          console.log("sync ready");
        }
      });
  }
}


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
