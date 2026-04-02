// Récupération des travaux  depuis l'API 
const reponseWorks = await fetch('http://localhost:5678/api/works');
const projets = await reponseWorks.json();









