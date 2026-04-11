
function ajoutListenerLogin() {
   const formulairelogin = document.querySelector(".fomulaire-login");
    formulairelogin.addEventListener("submit", async function (event) {
        // Désactivation du comportement par défaut du navigateur
        event.preventDefault();
        // Création de l’objet.
        const login = {
            email: event.target.querySelector("#email").value,
            password : event.target.querySelector("#password").value,
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(login);
        console.log(chargeUtile);
        // Appel de la fonction fetch avec toutes les informations nécessaires
        const reponseLogin = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        if (!reponseLogin.ok) {
            // afficher erreur
            alert("Email ou mot de passe incorrect");
            return ;
        };
        // Réponse de l'API 
        const donnees = await reponseLogin.json();
        // Stocker le token
        localStorage.setItem("token", donnees.token);
        // Redirection
        window.location.href = "index.html";

    });
}

ajoutListenerLogin()