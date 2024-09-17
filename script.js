let bordCounter = 1; // Huidig bordnummer
let kolomCounter = 4; // Huidig kolomnummer

// Event listener voor de knop "Voeg Bord Toe"
document.getElementById('toevoegBordBtn').addEventListener('click', function() {
    const bordNaam = document.getElementById('bordNaam').value;
    if (bordNaam.trim()) {
        voegBordToe(bordNaam, 'bordLijst1'); // Voeg toe aan de eerste kolom
        document.getElementById('bordNaam').value = ''; // Leeg het invoerveld
    } else {
        alert('Voer een naam voor het bord in!');
    }
});

function voegBordToe(naam, lijstId) {
    const bordLijst = document.getElementById(lijstId);

    // Maak een nieuw bord element
    const bordDiv = document.createElement('div');
    bordDiv.classList.add('bord');
    bordDiv.draggable = true; // Maak het bord versleepbaar
    bordDiv.id = 'bord' + bordCounter; // Voeg een ID toe
    bordCounter++; // Verhoog het nummer voor het volgende bord

    // Voeg bordnummer toe
    const nummerDiv = document.createElement('div');
    nummerDiv.classList.add('bord-number');
    nummerDiv.textContent = bordCounter - 1;

    // Maak een invoerveld voor het bewerken van de naam
    const bordInput = document.createElement('input');
    bordInput.type = 'text';
    bordInput.value = naam;
    bordInput.readOnly = true; // Maak het standaard onbewerkbaar

    // Maak de "Verwijder" knop
    const verwijderKnop = document.createElement('button');
    verwijderKnop.textContent = 'Verwijder';
    verwijderKnop.onclick = function() {
        verwijderBord(bordDiv);
    };

    // Voeg dubbelklik event toe om naam aan te passen
    bordInput.addEventListener('dblclick', function() {
        bordInput.readOnly = false; // Maak bewerkbaar bij dubbelklik
        bordInput.focus(); // Focus op het veld om direct te kunnen typen
    });

    // Opslaan van de wijziging als je buiten het invoerveld klikt of op Enter drukt
    bordInput.addEventListener('blur', function() {
        bordInput.readOnly = true; // Blokkeer bewerken na verlies van focus
    });

    bordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            bordInput.readOnly = true; // Opslaan en vergrendelen bij Enter
        }
    });

    // Voeg alles toe aan het bord
    bordDiv.appendChild(nummerDiv);
    bordDiv.appendChild(bordInput);
    bordDiv.appendChild(verwijderKnop);
    bordLijst.appendChild(bordDiv);

    // Drag and Drop event listeners
    bordDiv.addEventListener('dragstart', function(e) {
        bordDiv.classList.add('dragging');
        e.dataTransfer.setData('text/plain', bordDiv.id); // Bewaar het ID van het bord dat wordt gesleept
    });

    bordDiv.addEventListener('dragend', function() {
        bordDiv.classList.remove('dragging');
    });
}

// Functie om een bord te verwijderen
function verwijderBord(bord) {
    bord.remove(); // Verwijder het bord-element uit de DOM
    hernummerBorden(); // Hernummer alle borden na verwijdering
}

// Functie om alle borden te hernummeren
function hernummerBorden() {
    const borden = document.querySelectorAll('.bord');
    let nummer = 1; // Beginnen met nummer 1
    borden.forEach(bord => {
        const nummerDiv = bord.querySelector('.bord-number');
        nummerDiv.textContent = nummer; // Update nummer
        nummer++; // Volgend nummer
    });
    bordCounter = nummer; // Update bordCounter voor nieuwe borden
}

// Functie om alle borden te verwijderen
document.getElementById('verwijderAlleBtn').addEventListener('click', function() {
    document.querySelectorAll('.bord-lijst').forEach(lijst => {
        lijst.innerHTML = ''; // Verwijder alle inhoud van de bord-lijsten
    });
    bordCounter = 1; // Reset het bordnummer
});

// Functie om een nieuwe kolom toe te voegen
document.getElementById('toevoegKolomBtn').addEventListener('click', () => {
    kolomCounter++;
    const kolommenContainer = document.getElementById('kolommenContainer');

    // Maak een nieuwe kolom
    const nieuweKolom = document.createElement('div');
    nieuweKolom.classList.add('kolom');
    nieuweKolom.id = `kolom${kolomCounter}`;
    nieuweKolom.ondrop = (event) => drop(event);
    nieuweKolom.ondragover = (event) => allowDrop(event);

    // Voeg een titel en verwijderknop toe aan de kolom
    const kolomTitel = document.createElement('h2');
    kolomTitel.innerHTML = `Proces stap ${kolomCounter} <span class="verwijder-kolom" onclick="verwijderKolom('kolom${kolomCounter}')">X</span>`;
    nieuweKolom.appendChild(kolomTitel);

    // Voeg een lege lijst van borden toe aan de kolom
    const bordLijst = document.createElement('div');
    bordLijst.classList.add('bord-lijst');
    bordLijst.id = `bordLijst${kolomCounter}`;
    nieuweKolom.appendChild(bordLijst);

    // Voeg de nieuwe kolom toe aan de container
    kolommenContainer.appendChild(nieuweKolom);

    console.log("Nieuwe kolom toegevoegd:", nieuweKolom); // Debugging
});

// Functie om een kolom te verwijderen en alle kolommen te hernummeren
function verwijderKolom(kolomId) {
    const kolom = document.getElementById(kolomId);
    if (kolom) {
        kolom.remove(); // Verwijder de kolom uit de DOM
        hernummerKolommen(); // Hernummer de resterende kolommen
    }
}

// Functie om alle kolommen opnieuw te nummeren
function hernummerKolommen() {
    const kolommen = document.querySelectorAll('.kolom');
    kolomCounter = kolommen.length; // Reset kolomCounter naar het aantal overgebleven kolommen
    kolommen.forEach((kolom, index) => {
        const kolomTitel = kolom.querySelector('h2');
        kolom.id = `kolom${index + 1}`;
        kolomTitel.innerHTML = `Proces stap ${index + 1} <span class="verwijder-kolom" onclick="verwijderKolom('kolom${index + 1}')">X</span>`;
        const bordLijst = kolom.querySelector('.bord-lijst');
        bordLijst.id = `bordLijst${index + 1}`;
    });
}

// Drag and Drop functies
function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text/plain');
    const bord = document.getElementById(data);
    const targetLijst = ev.target.closest('.bord-lijst');
    if (targetLijst) {
        targetLijst.appendChild(bord); // Voeg het bord toe aan de nieuwe kolom
    }
}

// Functie om een kolomtitel aan te passen
function maakKolomTitelBewerkbaar(kolomTitelElement) {
    const origineleTitel = kolomTitelElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = origineleTitel;

    input.addEventListener('blur', function() {
        if (input.value.trim()) {
            kolomTitelElement.innerHTML = `${input.value} <span class="verwijder-kolom" onclick="verwijderKolom('${kolomTitelElement.parentElement.id}')">X</span>`;
        } else {
            kolomTitelElement.innerHTML = `${origineleTitel} <span class="verwijder-kolom" onclick="verwijderKolom('${kolomTitelElement.parentElement.id}')">X</span>`;
        }
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            input.blur(); // Opslaan en vergrendelen bij Enter
        }
    });

    kolomTitelElement.innerHTML = '';
    kolomTitelElement.appendChild(input);
    input.focus();
}

// Event listener voor de dubbelklik op de kolomtitel
document.querySelectorAll('.kolom h2').forEach(titel => {
    titel.addEventListener('dblclick', function() {
        maakKolomTitelBewerkbaar(this);
    });
});
