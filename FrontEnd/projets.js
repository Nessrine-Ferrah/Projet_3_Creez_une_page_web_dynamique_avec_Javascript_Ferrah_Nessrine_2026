// Récupération des travaux  depuis l'API 
const reponseWorks = await fetch('http://localhost:5678/api/works');
const projets = await reponseWorks.json();

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


const boutonTous = document.querySelector(".btn-tous");
    boutonTous.addEventListener("click",function () {
    document.querySelector(".gallery").innerHTML = "";
    genererProjets(projets);
   });


const bouttonFiltrer = document.querySelector(".btn-filtres")
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const category = await reponseCategories.json();
for (let i = 0;  i < category.length; i++) {
    const boutton = category[i];
    const bouttonElements = document.createElement("button");
    bouttonElements.dataset.id = boutton.id;
    bouttonElements.innerText = boutton.name
    bouttonFiltrer.appendChild(bouttonElements);
    bouttonElements.addEventListener("click", function (event){
        const idCategories = Number(event.target.dataset.id);
        const projetsFiltrees = projets.filter(function (projet){
            return projet.categoryId === idCategories;
   });
    document.querySelector(".gallery").innerHTML = "";
    genererProjets(projetsFiltrees);
});
}
