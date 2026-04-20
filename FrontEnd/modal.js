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

        //   Création du bouton Delete 
        const btnDelete = document.createElement("button")
        btnDelete.classList.add("btn-delete");
        btnDelete.setAttribute("data-id", projet.id);
        // Ajouter l'icône poubelle dans le bouton 
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

//  Ouverture de la modale 

const openmodal = document.querySelector(".js-modale");
const modal = document.getElementById("modale");
const modalZone1 = document.querySelector(".modal-zone1");

function OuvrirModal() {
    openmodal.addEventListener ("click", function(event) {
    event.preventDefault();
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true");
    modalZone1.style.display = "flex";

    genererProjetsModal(projets);
    })
}

OuvrirModal()

//  Fermeture de la modale
function FermerModal () {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modalZone1.style.display = "none";
    modalZone2.style.display ="none";
    flecheRetour.style.display ="none";
    // Réinitialiser tous les champs
    const CacherPreview = document.querySelector(".style-preview")
    CacherPreview.src = "";
    CacherPreview.style.display = "none";
    messageErreur.style.display = "none";
    elementsCacher.forEach(el => {
        el.style.display = "flex"; 
    });
    champsModal.forEach(champ => {
        champ.value = "";
    });
    // Réinitialiser le bouton Valider
    submitValider.disabled = true;
    submitValider.classList.add("submit-valider");
}

function ajoutListenerFermerModal() {
    const btnCloseModal = document.querySelector(".close-modal")

    btnCloseModal.addEventListener("click", function(event){
    event.preventDefault();
    FermerModal()
    });
}
ajoutListenerFermerModal();


// btn ajouter photo et flèche de retour

const modalZone2 = document.querySelector(".modal-zone2");
const flecheRetour = document.querySelector(".retour-modal")

function ajoutListenerAjouterPhoto() {
    const btnAjouterPhoto = document.querySelector(".btn-ajout-photo")
    btnAjouterPhoto.addEventListener("click", function(event) {
        modalZone1.style.display = "none";
        modalZone2.style.display = "flex";
        flecheRetour.style.display = "flex";
        flecheRetour.addEventListener("click", function(event){
            modalZone1.style.display = "flex";
            modalZone2.style.display ="none";
            flecheRetour.style.display = "none";
        });
    });
}
ajoutListenerAjouterPhoto()

//   formulaire modale 
const elementsCacher = document.querySelectorAll(".cacher");
const inputFile = document.getElementById("ajout-photo");

function changerInputFile () {
    inputFile.addEventListener("change", function(event){
        // Si un fichier est sélectionné
        if (inputFile.files.length > 0) {
            // Cacher les éléments
            elementsCacher.forEach(el => {
            el.style.display = "none";
            });
            // On récupère img pour changer le scr qui contiendra le fichier sélectionné
            const afficherPhoto = document.querySelector(".style-preview")
            const fichier = inputFile.files[0];
            const urlImage = URL.createObjectURL(fichier);
            afficherPhoto.setAttribute("src", urlImage )
            afficherPhoto.style.display = "block";
        };
    });
}
changerInputFile()

// Ajout des options catégories à partir de l'API
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();
const selectCategorie = document.getElementById("Categorie");

function genererOptionCategories(categories) {
    categories.forEach (cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.innerText = cat.name;
    selectCategorie.appendChild(option);
    });
}
 genererOptionCategories(categories)


 // ********** Vérigier les champs 

const champsModal = document.querySelectorAll(".champs-modal");
const submitValider = document.querySelector(".submit-valider");
const messageErreur = document.querySelector(".message-erreur");

function verifierChampsRemplis() {
    champsModal.forEach(champ => {
        champ.addEventListener("input", verifier);
        champ.addEventListener("change", verifier);
    });
 }

function verifier() {
     const tousRemplis = Array.from(champsModal).every(c => {
            if (c.type === "file") {
                return c.files.length > 0;
            }
            return c.value.trim() !== "";
        });

        if (tousRemplis) {
            submitValider.disabled = false;
            submitValider.classList.remove("submit-valider");
            afficherErreur();
            return;
        } else {
            submitValider.disabled = true;
            submitValider.classList.add("submit-valider");
            afficherErreur("Veuillez remplir tous les champs.");
            return;
        }

}
verifierChampsRemplis()

// afficher message d'erreur 
function afficherErreur (message) {
    messageErreur.textContent = message;
    const tousRemplis = Array.from(champsModal).every(c => {
        if (c.type === "file") {
            return c.files.length > 0;
        }
        return c.value.trim() !== "";
    });

    if(!tousRemplis) {
        messageErreur.style.display = "block";
    } else {
         messageErreur.style.display = "none";
    };
}
 

