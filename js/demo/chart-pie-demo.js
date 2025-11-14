// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var typeMouvement = ["Loyer", "Assurances", "Nourriture", "Internet"];
var depensesTotales = [];

var Datastore = require("nedb"),
db = new Datastore({ filename: "data.db", autoload: true});

typeMouvement.forEach((type, id) => {
  var totalDepenses = 0;
 
  // Find lignes par date
  db.find ({typeMouvement:type}, function(err, docs){
    if (err) {
      console.error("Erreur lors de la recherche des documents:", err);
      return;
    }
    // Calcul du total des dépenses pour le type courant
    docs.forEach((el,id) => {
      if(el != null) {
        totalDepenses += -parseFloat(el.montant);
      }
    });
    depensesTotales.push(totalDepenses);
    if (id === typeMouvement.length - 1) {
      // Appelez la fonction qui génère votre graphique
    generateGraph2(); 
    }
  });

});

generateGraph2 = function () {

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: typeMouvement,
    datasets: [{
      data: depensesTotales,
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc','#eb2e2eff' ],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf','#eb2e2eff' ],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});
}