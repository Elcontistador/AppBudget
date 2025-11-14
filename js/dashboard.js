$(() => {

    var mois2 = [
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
    var selectedDate2 = new Date();
    var dateShowed2 = document.getElementById("dateShowed2");
    dateShowed2.innerHTML =
        mois2[selectedDate2.getMonth()] + " " + selectedDate2.getFullYear();

    // Gestion des boutons avant et après
    var prevMonth2 = document.getElementById("prevMonth2");
    var nextMonth2 = document.getElementById("nextMonth2");

    // Gestion du click sur ces boutons + modification du mois
    prevMonth2.addEventListener("click", () => {
        selectedDate2 = new Date(selectedDate2.setMonth(selectedDate2.getMonth() - 1));
        dateShowed2.innerHTML =
            mois2[selectedDate2.getMonth()] + " " + selectedDate2.getFullYear();
        updateDataForMonth(); // Appel de la fonction pour mettre à jour les données
    });
    nextMonth2.addEventListener("click", () => {
        selectedDate2 = new Date(selectedDate2.setMonth(selectedDate2.getMonth() + 1));
        dateShowed2.innerHTML =
            mois2[selectedDate2.getMonth()] + " " + selectedDate2.getFullYear();
        updateDataForMonth(); // Appel de la fonction pour mettre à jour les données
    });

    var Datastore = require('nedb'),
        db = new Datastore({ filename: "data.db", autoload: true });

    const revenusMois = document.getElementById("revenusMois");
    const revenusAn = document.getElementById("revenusAn");
    const depensesMois = document.getElementById("depensesMois");
    const depensesMoisStyle = document.getElementById("depensesMoisStyle");
    const depensesAn = document = document.getElementById("depensesAn");

    // Déplacez la logique de mise à jour des données dans une fonction
    function updateDataForMonth() {
        var mois = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var minDate2 = selectedDate2.getFullYear() + "-" + mois[selectedDate2.getMonth()] + "-01";
        var maxDate2 = selectedDate2.getFullYear() + "-" + mois[selectedDate2.getMonth()] + "-" + new Date(selectedDate2.getFullYear(), selectedDate2.getMonth() + 1, 0).getDate();

        db.find({},
            function(err, docs) {
                if (err) {
                    console.error("Erreur lors de la recherche dans la base de données :", err);
                    return;
                }

                var rec = 0;
                var dep = 0;
                var recm = 0;
                var depm = 0;

                docs.forEach(el => {
                    // Pour l'année
                    if (parseInt(el.montant) > 0) {
                        rec += parseInt(el.montant);
                    } else {
                        dep += parseInt(el.montant);
                    }
                    // Pour le mois en cours
                    if (el.date >= minDate2 && el.date <= maxDate2) {
                        if (parseInt(el.montant) > 0) {
                            recm += parseInt(el.montant);
                        } else {
                            depm += parseInt(el.montant);
                        }
                    }
                });

                revenusAn.innerHTML = rec + " €";
                depensesAn.innerHTML =- dep + " €";
                revenusMois.innerHTML = recm + " €";

                // Calcul du pourcentage des dépenses
                if (recm > 0) {
                    var pourcentage = Math.abs(depm * 100 / recm);
                    depensesMois.innerHTML = Math.trunc(pourcentage) + " %";
                    depensesMoisStyle.style.width = pourcentage + " %";
                } else {
                    depensesMois.innerHTML = "0 %";
                    depensesMoisStyle.style.width = "0%";
                }
            }
        );
    }
    // Appel initial au chargement de la page pour le mois en cours
    updateDataForMonth();
});