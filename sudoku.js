"use strict";
// erzeugt Array aus 81 0ern
var feldMitNullen = function () {
    var daten = [];
    for (var i = 0; i < 81; i++) {
        daten[i] = 0;
    }
    return daten;
};

// erzeugt HTML-Tabelle aus Array
var tabelle = function (daten) {
    var text = "<table class='table table-bordered table-condensed'>";
    for (var zeile = 0; zeile <= 8; zeile++) {
        text += "<tr>";
        for (var spalte = 0; spalte <= 8; spalte++) {
            var i = zeile * 9 + spalte;
            var background = '';
            if((spalteQ(i) + zeileQ(i))%2 ===0){
                background = ' active';
            }
            text += "<td class='text-center" + background + "'>";
            text += daten[i];
            text += "</td>";
        }
        text += "</tr>";
    }
    text += "</table>";
    return text;
};

// berechnet den Spaltenindex
// eines kleinen Quadrats
// 000 111 222
// 000 111 222
// 000 111 222
// ...
var spalteQ = function(position){
    return ((position - position % 3) % 9) / 3;
};

// berechnet den Zeilenindex
// eines kleinen Quadrats
// 000 000 000
// 000 ...
// 000
// 111
// 111
// 111
// 222
// 222
// 222
var zeileQ = function(position){
    return (position - position % 27) / 27;
};

// prüft, ob zahl an position
// zu Kollision mit vorhanden Daten
// bis position-1 führen würde
var kollision = function (daten, position, zahl) {
    // Suche gleiche Zahl in Spalte oberhalb
    var index = position - 9;
    while (index >= 0) {
        if (daten[index] === zahl) {
            return true;
        }
        index -= 9; // eine Zeile nach oben
    }

    // Suche gleiche Zahl in Zeile links
    index = position - 1;
    var linkerRand = position - position % 9;
    while (index >= linkerRand) {
        if (daten[index] === zahl) {
            return true;
        }
        index--; // eine Spalte nach links
    }

    // Suche gleiche Zahl im kleinen Quadrat
    var spalteQ = ((position - position % 3) % 9) / 3;
    var zeileQ = (position - position % 27) / 27;
    var start = spalteQ * 3 + zeileQ * 27;

    // 3 Zeilen des kleinen Quadrats
    for (var zeile = 0; zeile < 3; zeile++) {
        var startZeile = start + 9 * zeile;
        index = startZeile;
        while ((index < position) && (index < startZeile + 3)) {
            if (index !== position && daten[index] === zahl) {
                return true;
            }
            index++;
        }
    }

    // keine Kollision gefunden
    return false;
};

var setze = function (daten, position, wert) {
    // nur etwas machen,
    // wenn Sudoku noch nicht voll 
    if (position < 81) {
        
        // vorgeschlagenen wert auf Kollision prüfen
        if (kollision(daten, position, wert)) {
            //****************************
            //  Kollision
            //****************************
            if (wert < 9) {
                // noch nicht alle Zahlen durchprobiert
                // => nächste Zahl im gleichen Feld
                setze(daten, position, wert + 1);                
            } else {
                // 9 passt nicht =>
                // Vorgängerfeld nochmal
                var vorgaengerZahl = daten[position - 1];
                // Vorgängerfeld löschen
                daten[position - 1] = 0;
                
                // Vorgänger war auch schon 9?
                if (vorgaengerZahl < 9) {
                    setze(daten, position - 1, vorgaengerZahl + 1);                    
                } else {
                    // Vorgänger 9 löschen
                    var vorvorgaengerZahl = daten[position - 2];
                    daten[position - 2] = 0;
                    setze(daten, position - 2, vorvorgaengerZahl + 1);
                }
            }
        } else {
            //****************************
            // keine Kollision
            //****************************
            // Wert setzen
            daten[position] = wert;

            // Noch nicht alle Felder besetzt
            // => nächstes Feld mit 1 probieren
            setze(daten, position + 1, 1);            
        }
    }
};

//****************************
// Hauptprogramm
//****************************
var daten = feldMitNullen();

// Sudoku fuellen
setze(daten, 0, 1);

// Ausgabe
var ausgabe = document.getElementById("ausgabe");
ausgabe.innerHTML = tabelle(daten);
