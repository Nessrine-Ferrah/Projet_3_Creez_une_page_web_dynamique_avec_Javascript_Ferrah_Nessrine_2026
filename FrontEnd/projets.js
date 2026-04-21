// Récupération des travaux  depuis l'API 
const reponseWorks = await fetch('http://localhost:5678/api/works');
let projets = await reponseWorks.json();

   // Fonction qui génère toute la page web
function genererProjets(projets) {
     // Récupération de l'élément du DOM qui accueillera les projets
        const gallery = document.querySelector(".gallery");

        projets.forEach(projet => {
        const projetElement = document.createElement("figure");

        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = projet.title;
        //Rattachement de nos balises au DOM
        projetElement.appendChild(imageElement);
        projetElement.appendChild(figcaptionElement);
        // On rattache la balise figure a la div galerry
        gallery.appendChild(projetElement);
    });
}

// Premier affichage de la page
genererProjets(projets);

// Fonction utilitaire : gérer le bouton actif
function activerBouton(bouton) {
    document.querySelectorAll(".btn-filtres button").forEach(btn => {
        btn.classList.remove("btn-active");
    });
    bouton.classList.add("btn-active");
}

const boutonTous = document.querySelector(".btn-tous");
    boutonTous.addEventListener("click",function () {
    document.querySelector(".gallery").innerHTML = "";
    genererProjets(projets);
    activerBouton(boutonTous);
   });



const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

function filtrerGallery(categories) {
    const bouttonFiltres = document.querySelector(".btn-filtres");

    categories.forEach(cat => {
        const bouttonElements = document.createElement("button");
        bouttonElements.dataset.id = cat.id;
        bouttonElements.innerText = cat.name
        bouttonFiltres.appendChild(bouttonElements);

        bouttonElements.addEventListener("click", function (event){
            const idCategories = Number(event.target.dataset.id);
            const projetsFiltres = projets.filter(function (projet){
                return projet.categoryId === idCategories;
            });
        document.querySelector(".gallery").innerHTML = "";
        genererProjets(projetsFiltres);
        activerBouton(event.target);
        });
});
}

filtrerGallery(categories)

// Activer le bouton "Tous" au chargement
activerBouton(boutonTous);


function activerModeAdmin () {
    const token = localStorage.getItem("token");
    if (token) {
        document.body.classList.add("admin-mode");
        const modifierLogin = document.querySelector(".login")
        modifierLogin.innerText = "logout"
        modifierLogin.addEventListener ("click", function() {
            localStorage.removeItem("token");
            désactiverModeAdmin(false);
        });
    } else {
        désactiverModeAdmin(true);
    };
}

activerModeAdmin()

function désactiverModeAdmin(sessionExpiree) {
    document.body.classList.remove("admin-mode");
    const modifierLogin = document.querySelector(".login");
    modifierLogin.innerText = "login"
    if(sessionExpiree === true){
        alert("Votre session a expiré");
    };
}
