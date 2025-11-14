const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const ipc = ipcMain;
const fs = require('fs');
const { shell } = require('electron');

// Création d'un fenêtre
function createWindow() {
    const win = new BrowserWindow ({
       width:  1280, // largeur
       height: 720, // hauteur
       minWidth: 1024, // largeur minimale
       minHeight: 540, // hauteur minimale
       closable: true, // la fenêtre peut être fermée si true
       darkTheme: true, // Active la prise en charge du darkTheme
       frame: false, // masque le frame par défaut si false
       icon: path.join(__dirname, './ico.ico'), // ajouter un icone - _dirname=répertoir courrant - ico.ico = nom du fichier
       webPreferences:{
        nodeIntegration : true,
        contextIsolation : false, // true à la fin de la programmation
        devTools: true, // permet de faire apparaitre la console développeur sur chrome / permet de debuger notre logiciel
        preload: path.join(__dirname, "preload.js")
       }
    })

    win.loadFile("index.html")
    // win.webContents.openDevTools() // permet de faire apparaitre la console développeur sur chrome / permet de debuger notre logiciel

    // gestion des demandes IPC
    // Top menu

    ipc.on("reduceApp", () => { // definit l'action de reduceApp
        win.minimize()
    });
    ipc.on("sizeApp", () => { // definit l'action de sizeApp
        if(win.isMaximized()) 
        {
            win.restore()
        }
        else 
        {
            win.maximize()
        }
    });
    ipc.on("closeApp", () => { // definit l'action de closeApp
        win.close()
    });

    ipc.on("reload", () => {
        win.reload();
    });

    ipc.on("exportPdf", () => {
        console.log("*** EXPORT PDF");
        // chemin d'export du PDF

       // Crée un nouvel objet Date qui contient la date et l'heure actuelles
        const now = new Date();

        // Formate la date et l'heure
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // Crée le nom de fichier complet
        const filename = `export_${year}-${month}-${day}_${hours}h${minutes}.pdf`;

        const downloadPath = app.getPath('downloads'); 
        const filepath = path.join(downloadPath, filename);
        
        // Option du PDF
        var options = {
            marginstype: 1,
            pageSize: 'A4',
            printBackground: true,
            printSelectionOnly: false,
            landscape: false,
        }
        // Réaliser l'export + Manipuler le fichier
        win.webContents.printToPDF(options).then(data => {
            fs.writeFile(filepath, data, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('PDF bien genere');
                    // win2.loadURL(filepath); // permet de charger le fichier Pdf à l'intérieur de l'application
                    shell.showItemInFolder(filepath); // permet d'ouvrir l'explorateur de fichier
                    shell.openPath(filepath); // permet d'ouvrir le fichier Pdf avec le logiciel par défaut pour Pdf
                }
            });
        }).catch(error => {
            console.log(error)
        });
    });


    // Manipulation de la base de données
    ipc.on("addLigneToDb", (e, data) => {
        var Datastore = require('nedb'),
            db = new Datastore({filename:"data.db", autoload:true});
        db.insert(data,function(err, newrec) {
            if(err != null) {
                console.log("*** err = ", err); 
            }
                console.log("*** created = ", newrec);
            win.reload();
        })  
    });
    // Fin de la manipulation de la base de données
}

// Quand electron est prêt !
app.whenReady().then(() => {
    createWindow()
   
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Gestion de la fermeture de toutes les fenêtres
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

