// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) { // fonction formatage des nombres
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ' ' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? ',' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

var cdrParMois = [];
var depensesParMois = [];
var revenusParMois = [];
var date = new Date ();
var mois = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var Datastore = require("nedb"),
db = new Datastore({ filename: "data.db", autoload: true});

mois.forEach((el, id) => {
  var minDate3 = date.getFullYear() + "-" + el + "-01";
  var maxDate3 = date.getFullYear() + "-" + el + "-31";

  var cdrDuMois = 0;
  var depensesDuMois = 0;
  var revenusDuMois = 0;

  // Find lignes par date
  db.find ({ $and: [{ date: { $gte: minDate3}},{ date: { $lte: maxDate3}}]}, function(err, docs){
    // Calcul du compte du résultat du mois
    docs.forEach((el, id) => {
      if(el != null) {
        cdrDuMois += parseInt(el.montant);
        if(el.montant <0 ) {
          depensesDuMois += - parseInt(el.montant);
        } else {
          revenusDuMois += parseInt(el.montant);
        }
      }
    });
    cdrParMois.push(cdrDuMois);
    depensesParMois.push(depensesDuMois);
    revenusParMois.push(revenusDuMois);
    if(id == 11) {
      generateGraph();
    }
  });

})

generateGraph = function () {

// Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line', // type de graphique
  data: {
    labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
      label: "Cdr",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 0.2)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: cdrParMois,
      },
      {
      label: "Revenus",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(2, 180, 106, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 0.2)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: revenusParMois,
      },
      {
      label: "Dépenses",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(250, 7, 7, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 0.2)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: depensesParMois,
      },      
  ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: true, // apparence des grilles oui ou non
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 12 // nombre de mois affichés
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 12, // nombre de chiffres de revenus affichés
          padding: 10,
          callback: function(value, index, values) {
            return number_format(value) + ' €'; // formatage des nombres
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: true // Afficher ou pas la légende
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + " : " + number_format(tooltipItem.yLabel) + " €";
        }
      }
    }
  }
});
};