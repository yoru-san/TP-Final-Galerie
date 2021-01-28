function reduireArray(array, size) {
  if (array.length <= size) {
    return [array];
  }
  return [array.slice(0, size), ...reduireArray(array.slice(size), size)];
}

const dateTimeFormat = Intl.DateTimeFormat("fr");

function afficher(json) {
  const selections = reduireArray(json, 4);

  let html = "";

  selections.forEach((selection) => {
    html += '<div class="columns">';

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
                    <p class="subtitle is-6">@${repo.author}</p>
                  </div>
                </div>
  
                <div class="content">
                   ${repo.description}
                  <br />
                  Dernière mise à jour: <time datetime="${repo.updated_at
        }">${dateTimeFormat.format(new Date(repo.updated_at))}</time>
                </div>
              </div>
            </div>
            <div class="box has-text-centered">
              <button class="button fav-btn is-light" img-id="${repo.id}"></button>
            </div>
          </div>`;
    });
    html += "</div>";

  });

  document.querySelector(".container").innerHTML = html;

  document.querySelectorAll(".fav-btn").forEach(b => {
    b.addEventListener("click", (e) => {
      let id = e.target.getAttribute("img-id");
      let isFavori = e.target.getAttribute("is-favori");

      toggleFavori(id).then(_ => {
        if (isFavori == "true") {
          e.target.setAttribute("is-favori", false);
          e.target.innerHTML = "<i class='fas fa-heart'></i>";
        } else {
          e.target.setAttribute("is-favori", true);
          e.target.innerHTML = "<i class='far fa-heart'></i>";
        }
      });
    });
  })
}

function afficherFavori(json) {
  buttons = document.querySelectorAll(".fav-btn");
  buttons.forEach((b) => {
    if (json.indexOf(b.getAttribute("img-id")) != -1) {
      b.setAttribute("is-favori", true);
      b.innerHTML = "<i class='fas fa-heart'></i>";
    } else {
      b.setAttribute("is-favori", false);
      b.innerHTML = "<i class='far fa-heart'></i>";
    }
  });
}

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