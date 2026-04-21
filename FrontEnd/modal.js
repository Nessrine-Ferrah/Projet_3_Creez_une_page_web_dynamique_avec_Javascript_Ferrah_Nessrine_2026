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
            if (!verifierFormatTailleFile()) {
                return;
            }
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


 // ********** Vérigier les champs ********************/

const champsModal = document.querySelectorAll(".champs-modal");
const submitValider = document.querySelector(".submit-valider");
const messageErreur = document.querySelector(".message-erreur");

// Champs file format et taille 
function verifierFormatTailleFile () {
    const imageSelect = inputFile.files[0];
    if (!imageSelect) return false ;

    // définir le format et la taille du fichier
    const formatImage = ["image/jpg", "image/png"];
    // navigateur mesure les fichiers en octets, 4mo = 4 x 1024 ko <=> 1ko = 1024 octets <=> 4mo = 4 x 1024 x 1024 /1 <=> 4mo = 4 x 1024 x 1024 octets
    const TailleMax = 4 * 1024 * 1024; 

    if (!formatImage.includes(imageSelect.type)) {
        AfficherErreurInputFile("Format invalide : JPG ou PNG uniquement.");
        inputFile.value = "";
        return false;
    }
    if (imageSelect.size > TailleMax) {
        AfficherErreurInputFile("L’image ne doit pas dépasser 4 Mo.");
        inputFile.value = "";
        return false;
    }

    CacherErreurFile();
    return true;
}

// fonction qui affcihe les messages d'erreur pour le input file
function AfficherErreurInputFile (message) {
    const messageErreur = document.querySelector(".erreurFile")
    messageErreur.textContent = message;
    messageErreur.style.display = "block";
}
// fonction qui cache les messages d'erreur pour le input file
function CacherErreurFile () {
    const messageErreur = document.querySelector(".erreurFile")
     messageErreur.textContent = "";
     messageErreur.style.display = "none";
}


// vérifier champs remplis
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
 

// envoyer la requete http avec la méthode POST
 function ajoutListenerEnvoyerFormulaire () {
    const formulaireModal = document.querySelector(".formulaire-modal");
    const titre = document.getElementById("titre");

    formulaireModal.addEventListener("submit", async function (event){
        event.preventDefault();
        const chargeUtile  = new FormData();
        chargeUtile.append("image",inputFile.files[0]);
        chargeUtile.append("title", titre.value);
        chargeUtile.append("category", selectCategorie.value);

        // Appel de la fonction fetch avec toutes les informations nécessaires
        const token = localStorage.getItem("token");
        const reponsePostWorks = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}`},
            body: chargeUtile // En formdata donc pas de content-type
        });

        if(reponsePostWorks.ok){
            // Récuperer le projet depuis la reponse de l'API
            const newProjet = await reponsePostWorks.json();
            // ajouter le projet dans la gallery
            projets.push(newProjet);
            // Mettre à jour les galeries
            genererProjets(projets);
            genererProjetsModal(projets);
            // Fermer la modale
            FermerModal();

        } else {
            alert("Erreur lors de l'ajout du projet");
        };
    });
 }

 ajoutListenerEnvoyerFormulaire ()