$(() => {

    var mois = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    // Affichage mois en cours
    var selectedDate = new Date();
    var dateShowed = document.getElementById("dateShowed");
    dateShowed.innerHTML = 
        mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();

    // Gestion des boutons avant et après
    var preMonth = document.getElementById("prevMonth");
    var nextMonth = document.getElementById("nextMonth");

    // Gestion du click sur ces boutons + modification du mois
    prevMonth.addEventListener("click", () => {
        selectedDate = new Date(selectedDate.setMonth(selectedDate.getMonth()-1));
        dateShowed.innerHTML =
            mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();
        loadTableLines(selectedDate);
    });
    nextMonth.addEventListener("click", () => {
        selectedDate = new Date(selectedDate.setMonth(selectedDate.getMonth()+1));
        dateShowed.innerHTML =
            mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();
        loadTableLines(selectedDate);
    });

    loadTableLines(selectedDate);

    const exportPdfBtn = document.getElementById("genPDF");
    exportPdfBtn.addEventListener('click', () => {
        ipc.send('exportPdf');
    });
});

loadTableLines= function (date) {
    var mois = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    var minDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-01"; // 2000-05-01
    var maxDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-31"; // 2000-05-31    

    // charger la BDD
    var Datastore = require('nedb'),
        db = new Datastore({ filename: "data.db", autoload:true});
    // récupérer le contenu de la BDD
        // db.find({}, function(err, docs) { // backup
        // Filtre par date (mois selectionné)
        db.find({ $and: [{ date:{ $gte: minDate}},{ date:{ $lte: maxDate}}] }, function(err, docs) { // $gte = plus grand ou égal ; $lte = plus petit ou égal
            console.log("*** docs = ", docs)

            var tableRegistre = document.getElementById("tableRegistre");
            var tableRows = tableRegistre.querySelectorAll("thead > tr");

            // on supprime le contenu du tableau
            tableRows.forEach((el,i)=> {
                if(i>0)
                el.parentNode.removeChild(el);
            });

            // on construit le contenu du tableau
            docs.forEach((el)=> {
                // création d'une ligne
                var row = tableRegistre.insertRow(1);
                // crétion des cellules
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);

                let iconHtml = '';

                if (el.typeMouvement === 'Loyer') {
                iconHtml = '<i class="bi bi-house-door-fill ms-2 icon-maison""></i>';
                } else if (el.typeMouvement === 'Nourriture') {
                iconHtml = '<i class="bi bi-basket-fill ms-2 icon-maison"></i>';
                } else if (el.typeMouvement === 'Paie') {
                iconHtml = '<i class="bi bi-cash ms-2 icon-maison"></i>';
                } else if (el.typeMouvement === 'Internet') {
                iconHtml = '<i class="bi bi-box ms-2 icon-maison"></i>';
                } else {
                // Optionnel: Gérer les cas où il n'y a pas d'icône spécifique
                iconHtml = '';
                }

                // injecter le contenu des cellules
                cell1.innerHTML = parseInt(el.montant)> 0 ? '<span class="badge bg-success text-white badge-large-font">'+ el.date+'</span>'
                : '<span class="badge bg-danger text-white badge-large-font">'+ el.date +'</span>';
                cell2.innerHTML = parseInt(el.montant)> 0 ? '<span class="badge bg-success text-white badge-large-font">'+ parseInt(el.montant)+'</span>'
                : '<span class="badge bg-danger text-white badge-large-font">'+ parseInt(el.montant) +'</span>';
                cell3.innerHTML = parseInt(el.montant)> 0 ? '<span class="badge bg-success text-white badge-large-font">'+ el.typeMouvement +'</span>' + "   " + iconHtml
                : '<span class="badge bg-danger text-white badge-large-font">'  + el.typeMouvement +'</span>' + "   " + iconHtml;
                cell4.innerHTML = '<button id="' + el._id + '" class="btn btn-danger"><i class="fa fa-trash"></i></button>';
                // Gestion des boutons d'action
                var btn = document.getElementById(el._id);
                btn.addEventListener('click', () => {
                  console.log("*** demande de supp de ", el._id);
                  db.remove({_id:el._id}, function(err, nbRemoved) {
                    if(err != null) 
                    {
                        console.log("*** err = ", err);
                    }
                    console.log(nbRemoved + " lines removed!");
                    ipc.send('reload');
                  });
                });
            });

        });
}