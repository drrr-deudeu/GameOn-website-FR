function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalbg1 = document.querySelector(".bground1");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalBtn1 = document.querySelectorAll(".modal-btn1");
const formData = document.querySelectorAll(".formData");
const modalBody = document.querySelectorAll(".modal-body");
const closeBtn = document.querySelectorAll(".close");
const closeBtn1 = document.querySelectorAll(".close1");
const formEl = document.getElementById("reserve");
const confirmEl = document.querySelectorAll(".bground");
const locationEl = document.querySelectorAll('[name="location"]');


const ageMinimum = 0;
const ageMaximum = 140;
const today = new Date();
const minYear = today.getFullYear() - ageMinimum;

// Map de gestion des champs du formulaire:
// id du champ : 
// {fonction d'init,
// fonction de vérification,
// type d'évènement,
// message d'erreur,
// contenu de la dernière valeur pour le fetch}
const verifArray={
  'first': {
    'init' : clearInputContent,
    'verif': testFirstAndLastName,
    'event': "input",
    'data-error': "Veuillez entrer 2 caractères ou plus pour le champ du prénom.",
    'last-value': ""
  },
  'last' : {
    'init' : clearInputContent,
    'verif' : testFirstAndLastName,
    'event' : "input",
    'data-error': "Veuillez entrer 2 caractères ou plus pour le champ du nom.",
    'last-value': ""
  },
  'email': {
    'init' : clearInputContent,
    'verif': testEmail,
    'event': "input",
    'data-error': "Veuillez entrer une adresse mail valide.",
    'last-value': ""
  },
  'birthdate': {
    'init' : clearInputContent,
    'verif': testBirthDate,
    'event': "input",
    'data-error': "Vous devez entrer votre date de naissance.",
    'last-value': ""
  },
  'quantity': {
    'init' : clearInputContent,
    'verif': testNumber,
    'event': "input",
    'data-error': "Veuillez entrer le nombre de tournois auxquels vous avez déjà participé.",
    'last-value': ""
  },
  'location1': {
    'init' : defaultLocation,
    'verif': testNothing,
    'event': onchange,
    'data-error': "Veuillez sélectionner une ville.",
    'last-value': ""
  },
  'checkbox1': {
    'init' : clearCheckBox,
    'verif': testChecked,
    'event': onchange,
    'data-error': "Vous devez vérifier que vous acceptez les termes et conditions.",
    'last-value': ""
  },
  'checkbox2': {
    'init' : clearCheckBox,
    'verif': testNothing,
    'event': onchange,
    'data-error': "",
    'last-value': ""
  },
};

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
// launch modal event
modalBtn1.forEach((btn) => btn.addEventListener("click", closeModal1));

// close modal event
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal));
// close modal event
closeBtn1.forEach((btn) => btn.addEventListener("click", closeModal1));

// launch modal form
function launchModal() {
  // Appel des fonctions d'initialisation des champs
  formData.forEach(function(f){
    let field = f.querySelector('input').getAttribute('id');
    initFieldElement(document.getElementById(field));
  });
  modalbg.style.display = "block";
}

// close modal form
function closeModal() {
  modalbg.style.display = "none";
}

// close modal confirmation form 
function closeModal1() {
  modalbg1.style.display = "none";
}

//
// FONCTIONS DE VALIDATION DES CHAMPS
//

// First and Last Name : même fonction de vérification
function testFirstAndLastName(el){
  const verif = /.{2,}/;
  let ret = verif.test(el.value);
  return ret;
}

// Fonction de test du nombre, sans limite...
function testNumber(el){
  const verif = /\d{1,}/; /* equivalent à /[0,9]{1,}/ */
  return(verif.test(el.value));
}

// 2 champs sont concernés par cette fonction:
// 1. les radio-boutons, qui sont testés lors du submit
// 2. la case de la newsletter
function testNothing(value){
  return true;
}

// enlever input type="email". Regexp instead
// Source : https://www.w3resource.com/javascript/form/email-validation.php
function testEmail(el){
  const verif = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return(verif.test(el.value));
  // Le check ci-dessous est pas mal car les règles seront updatées automatiquement 
  // en cas d'update des règles au niveau du browser
  // ... mais ne convient pas car il affiche aussi la bulle par défaut 
  // quand le bouton de submit du formulaire est activé 
  // if(!el.value.length)
  //   return false;
  // if(el.validity.typeMismatch){
  //   return false;
  // }
  // return true;
}

// validation via les fonctions Date de javascript
function testBirthDate(el){
  if(!el.value.length)
    return false;
  let date = new Date(el.value);
  if (date.getTime() > today.getTime()){
    return false;
  }
  let diff = new Date(today.getTime() - date.getTime());
  let diffYear = diff.getFullYear() - 1970;
  if(diffYear<ageMinimum || diffYear>ageMaximum)
    return false;
  return true;
}

// validation des coches
function testChecked(el){
  if(el.checked){
    return true;
  }
  return false;
}

// fonctions d'initialisation des values champs
function clearInputContent(el){
  el.value = "";
}

// Fonction de vérification des radio-boutons.
// Au moins 1 doit être checké
function radioButtonsChecked(){
  let checked = false;
  let town = "";
  // c'est dommage de ne pas pouvoir sortir du forEach quand on veut... à améliorer
  locationEl.forEach(function(loc){
    if(loc.checked){
      checked = true;
      town = loc.value;
    }
  });
  if(checked){
    locationEl[0].parentNode.setAttribute('data-error-visible','false');
    verifArray['location1']['last-value'] = town;
    return true;
  }
  locationEl[0].parentNode.setAttribute('data-error-visible','true');
  return false;
}

//
// FONCTIONS D'INITIALISATION DES CHAMPS
//

// aucune ville choisie par défaut
function defaultLocation(el){
  locationEl.forEach(function(loc){
    loc.checked = false;
  });
}

// la case conditions d'utilisation est décochée par défaut
function clearCheckBox(el){
  el.checked = false;
}

// fonction d'initialisation des champs
function initFieldElement(el){
  el.parentNode.setAttribute('data-error-visible','false');
  verifArray[el.getAttribute('id')]['init'](el);
}

// fonction de validation commune aux évènements et au submit
function verifFieldElement(el){
  if(verifArray[el.getAttribute('id')]['verif'](el)){
    el.parentNode.setAttribute('data-error-visible','false');
    verifArray[el.getAttribute('id')]['last-value'] = el.value;
    return true;
  }
  el.parentNode.setAttribute('data-error-visible','true');
  return false;
}

// même fonction listener pour tous les éléments
function verifField(e){
  return verifFieldElement(e.target);
}

// Mise en place des listeners de chaque champ du formulaire
formData.forEach(function(f){
  let field = f.querySelector('input').getAttribute('id');
  f.querySelector('input').addEventListener(verifArray[field]['event'],verifField);
  f.setAttribute('data-error',verifArray[field]['data-error']);
});

// listener sur submit
// traitement des validités avant envoi
formEl.addEventListener("submit", function (event) {
  let ret = true;
  let retReturn = true;
  formData.forEach(function(f){
    let field = f.querySelector('input').getAttribute('id');
    ret = verifFieldElement(document.getElementById(field));
    if(ret == false){
      retReturn = false;
    }
  });
  // // traitement special pour les radio-boutons
  if(!radioButtonsChecked()){
    retReturn = false;
  }
  
  // de toute facon nous devons controler la marche des evenements
  // ...ou pas, si on veut que le submit se fasse automatiquement
  event.preventDefault();

  if(!retReturn){
    // pas la peine si il a déjà été appelé, sinon oui
    // event.preventDefault();
    return false;
  }
  // Alors on peut faire le fetch
  // Dans ce cas il faut faire le event.preventDefault
  // voilà la string originale envoyée automatiquement par le submit:
  // first=dd&last=dd&email=dd%40d.org&birthdate=2000-02-18&quantity=1&location=Portland
  var url = new URL(window.location.href);
  Object.keys(verifArray).forEach(function(k){
    if(k==='location1')
      url.searchParams.append('location',verifArray[k]['last-value']);
    else url.searchParams.append(k,verifArray[k]['last-value']);
  });
  // Et voici celle que j'envoie
  // http://localhost/GP4/?
  // first=dd&last=dd&email=dd%40d.org&birthdate=2001-02-03&quantity=2&location=San+Francisco&checkbox1=&checkbox2=
  fetch(url, {
    method: "GET"})
    // .then((response) => console.log("fetch ok?"+response.ok+response.status))
    // .catch(e => console.log("something went wrong: " + e))
  
  // on affiche la fenetre d'inscription effectuée si reponse serveur ok (bon ici il n'y a pas de serveur)
  modalbg1.style.display = "block"; 
  modalbg.style.display = "none";

  return true;
}, false);
