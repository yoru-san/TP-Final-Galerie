function reduireArray(array, size) {
  if (array.length <= size) {
    return [array];
  }
  return [array.slice(0, size), ...reduireArray(array.slice(size), size)];
}

const dateTimeFormat = Intl.DateTimeFormat("fr");

function afficher(json) {
  console.log("Afficher:");
  console.log(json);

  const selections = reduireArray(json, 4);

  let html = "";

  selections.forEach((selection) => {
    html += '<div class="columns">';
    var favoris = getFavoris();

    console.log("Selection:");
    console.log(selection);

    selection.forEach((repo) => {
      html += `
            <div class="column">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img
                    src="${repo.url}"
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img
                        src="https://giffiles.alphacoders.com/981/98174.gif"
                        alt="Placeholder image"
                      />
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">${repo.name}</p>
                    <p class="subtitle is-6">@Parcourir</p>
                  </div>
                </div>
  
                <div class="content">
                   ${repo.description}
                  <br />
                  Dernière mise à jour: <time datetime="${
                    repo.updated_at
                  }">${dateTimeFormat.format(new Date(repo.updated_at))}</time>
                </div>
              </div>
            </div>
            <button class="button fav-btn" img-id="${
              repo.id
            }">Ajouter favori</button>
          </div>`;
    });
    html += "</div>";

  });

  document.querySelector(".container").innerHTML = html;
}

function afficherFavori(json) {
  console.log("Favoris:");
  console.log(json);

  buttons = document.querySelectorAll(".fav-btn");
  buttons.forEach((b) => {
    if (json.indexOf(b.getAttribute("img-id")) != -1) {
      b.setAttribute("is-favori", true);
      b.innerHTML = "Retirer favori";
    } else {
      b.setAttribute("is-favori", false);
      b.innerHTML = "Ajouter favori";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".container").addEventListener("click", (e) => {
    let id = e.target.getAttribute("img-id");
    let isFavori = e.target.getAttribute("is-favori");
    console.log(e.target.getAttribute("is-favori"));

    toggleFavori(id, isFavori).then(_ => {
      if (isFavori == "true"){
        console.log("Aj")
        e.target.setAttribute("is-favori", false);
        e.target.innerHTML = "Ajouter favori";
      } else {
        console.log("Ret")
        e.target.setAttribute("is-favori", true);
        e.target.innerHTML = "Retirer favori";
      }
    });
  });
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("boutton");

  btn.addEventListener("click", (e) => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("A2HS prompt accepté");
      } else {
        console.log("A2HS prompt décliné");
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener("appinstalled", (e) => {
  console.log("application installée");
});

document.addEventListener("DOMContentLoaded", function () {
  if (navigator.onLine) {
    document.querySelector(".notification").setAttribute("hidden", "");
  }

  window.addEventListener("online", () => {
    document.querySelector(".notification").setAttribute("hidden", "");
  });
  window.addEventListener("offline", () => {
    document.querySelector(".notification").removeAttribute("hidden");
  });

  let fetchImages;
  let fetchFavoris;
  if (navigator.onLine) {
    fetchImages = getImages().then((img) => localforage.setItem("images", img));
    fetchFavoris = getFavoris().then((fav) => localforage.setItem("favoris", fav));
  } else {
    fetchImages = localforage.getItem("images");
    fetchImages = localforage.getItem("favoris");
  }

  fetchImages.then((json) => {
    afficher(json)
    fetchFavoris.then((json) => afficherFavori(json));
  });
});