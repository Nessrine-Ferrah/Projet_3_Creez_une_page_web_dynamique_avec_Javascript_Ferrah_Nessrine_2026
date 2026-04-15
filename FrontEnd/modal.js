/******************* Afficher et fermer la modale ******************/

// Récupération des travaux  depuis l'API 
const reponseWorks = await fetch('http://localhost:5678/api/works');
let projets = await reponseWorks.json();

   //  Fonction qui génère les projets dans la modale
function genererProjetsModal(projets) {
     // Récupération de l'élément du DOM qui accueillera les projets
        const projetsDelete = document.querySelector(".projets-delete");
        projetsDelete.innerHTML = "";

        projets.forEach(projet => {
        const projetElement = document.createElement("figure");

        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;

        //******** Création du bouton Delete *********/
        const btnDelete = document.createElement("button")
        btnDelete.classList.add("btn-delete");
        btnDelete.setAttribute("data-id", projet.id);
        //*******Ajouter l'icône poubelle dans le bouton ***/
        btnDelete.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>`

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = projet.title;

        //Rattachement de nos balises au DOM
        projetElement.appendChild(imageElement);
        projetElement.appendChild(btnDelete);
        projetElement.appendChild(figcaptionElement);
        
        // On rattache la balise figure a la div projetsDelete
        projetsDelete.appendChild(projetElement);

        btnDelete.addEventListener("click", async function(event) {
            event.preventDefault();
            await supprimerProjet(projet.id);
        });
    });
}

async function supprimerProjet (id) {
    const token = localStorage.getItem("token");
    const reponseDelete = await fetch ("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`} // clé d'accès
    });

    if (reponseDelete.ok) {
        projets = projets.filter ( function (projet) {
            return projet.id !== id; 
        });
        genererProjets(projets);
        genererProjetsModal(projets);
    } else {
         alert("Erreur suppression");
            return ;
    };
    }
    

// ********************* MODALE *********************

// ******* Ouverture de la modale ***********

const openmodal = document.querySelector(".js-modale");
const modal = document.getElementById("modale");
const modalZone1 = document.querySelector(".modal-zone1");

function ajoutListenerOuvrirModal() {
    openmodal.addEventListener ("click", function(event) {
    event.preventDefault();
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true");
    modalZone1.style.display = "flex";

    genererProjetsModal(projets);
    ajoutListenerAjouterPhoto()
    supprimerProjet(Delete)

    })
}

ajoutListenerOuvrirModal()

//**************Fermeture de la modale *********
function ajoutListenerFermerModal () {
    const btnCloseModal = document.querySelector(".close-modal")
    btnCloseModal.addEventListener("click", function(event){
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modalZone1.style.display = "none";
    })
}

ajoutListenerFermerModal()

const modalZone2 = document.querySelector(".modal-zone2");
const flecheRetour = document.querySelector(".retour-modal")

function ajoutListenerAjouterPhoto() {
    const btnAjouterPhoto = document.querySelector(".btn-ajout-photo")
    btnAjouterPhoto.addEventListener("click", function(event) {
        modalZone1.style.display = "none";
        modalZone2.style.display = "flex";
        flecheRetour.style.display = "flex";
    })
}