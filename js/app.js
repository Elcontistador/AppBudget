const {ipcRenderer} = require('electron')
const ipc = ipcRenderer

const reduceBtn = document.getElementById("reduceBtn"); // reduceBtn = nom de l'id du boutton réduire
const sizeBtn = document.getElementById("sizeBtn"); // sizeBtn = nom de l'id du boutton agrandir
const closeBtn = document.getElementById("closeBtn"); // closeBtn = nom de l'id du boutton fermer

reduceBtn.addEventListener("click", () => { // ajoute l'action sur l'évenement click
    ipc.send("reduceApp"); // envoi la demande de réduction à main.js
});

sizeBtn.addEventListener("click", () => { // ajoute l'action sur l'évenement click
    ipc.send("sizeApp"); // envoi la demande d'agrandissement à main.js
});

closeBtn.addEventListener("click", () => { // ajoute l'action sur l'évenement click
    ipc.send("closeApp"); // envoi la demande de fermeture à main.js
});

// Gestion ajout ligne dans registre + prépa BDD
const btnAddLigne = document.getElementById("btnSaveLigne");
if(btnAddLigne != null)
{
    btnAddLigne.addEventListener('click', () => {
        // Récupération des inputs du formulaire ajout d'une ligne
        const dateVal = document.getElementById("dateLigne");
        const montantVal = document.getElementById("montantLigne");
        const infoVal = document.getElementById("typeDeMouvement");
        // Préparer l'objet pour l'insert BDD
        var _myrec = {
            date: dateVal.value,
            montant: parseInt(montantVal.value),
            typeMouvement : infoVal.value,        
        };
        ipc.send("addLigneToDb", _myrec);
    })
}