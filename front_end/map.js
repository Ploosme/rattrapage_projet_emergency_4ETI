var mymap = L.map('mapid').setView([45.771944, 4.8901709	], 12);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZmFyZXNibXIiLCJhIjoiY2twZTFsODFiMXRjZzJucDc5NTFoMzVkdCJ9.lbJmtUODt74bblFY7-yZzg'
  }).addTo(mymap);
  



// Récupération et gestion des feux------------------------------------------------------------------------------
var fireIcon = L.icon({
    iconUrl: 'fire.png',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


var listMarkerFire = new Array(0);
var listMarkerVehicle = new Array(0);

var HauteIntensite = new L.LayerGroup();
var FaibleIntensite = new L.LayerGroup();
var GrandeEtendue = new L.LayerGroup();
var FaibleEtendue = new L.LayerGroup();
var catA = new L.LayerGroup();
var catB_Gasoline = new L.LayerGroup();
var catB_Alcohol = new L.LayerGroup();
var catB_Plastics = new L.LayerGroup();
var catC_Flammable_Gases = new L.LayerGroup();
var catD_Metals = new L.LayerGroup();
var catE_Electric = new L.LayerGroup();



var voiture = new L.LayerGroup();
var citerne = new L.LayerGroup();
var pompes = new L.LayerGroup();
var camion = new L.LayerGroup();
var echelle = new L.LayerGroup();
var secours = new L.LayerGroup();


var polylineNavigation;
var idVehiculeNavigation;
var typeVehiculeNavigation;
var refreshNavigation;
var navigationIsVisible;
var closePopup = false;

function getFire(){
  setInterval(function(){
    let context = {
          method : 'GET'
    };
    fetch("http://localhost:8080/access/sim/fire", context)
    .then(value => value.json())
    .then(value => callbackFire(value))
    .catch(error => alert("Erreur : " + error));
  },
  2000);
}

function callbackFire(value){
  for(m of listMarkerFire){
    mymap.removeLayer(m);
    HauteIntensite.removeLayer(m);
    FaibleIntensite.removeLayer(m);
    GrandeEtendue.removeLayer(m);
    FaibleEtendue.removeLayer(m);
    catA.removeLayer(m);
    catB_Gasoline.removeLayer(m);
    catB_Alcohol.removeLayer(m);
    catB_Plastics.removeLayer(m);
    catC_Flammable_Gases.removeLayer(m);
    catD_Metals.removeLayer(m);
    catE_Electric.removeLayer(m);
  }
  listMarkerFire = new Array(0);
  for(let elt in value){

    if (value[elt]["intensity"] > 30){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(HauteIntensite).bindPopup("Intensité : " + value[elt]["intensity"] + " Type : " +value[elt]["type"] + " Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }



    if (value[elt]["intensity"] < 30){
      marker =new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(FaibleIntensite).bindPopup("Intensité : " + value[elt]["intensity"] + " Type : " +value[elt]["type"] + " Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }

    if (value[elt]["range"] > 30){
      marker =new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(GrandeEtendue).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + " Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }

    if (value[elt]["range"] < 30){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(FaibleEtendue).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }

    if (value[elt]["type"] == "A"){
      marker =new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(catA).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }

    if (value[elt]["type"] == "B_Gasoline"){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(catB_Gasoline).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }

    if (value[elt]["type"] == "B_Alcohol"){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(catB_Alcohol).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }

    if (value[elt]["type"] == "B_Plastics"){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(catB_Plastics).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }

    if (value[elt]["type"] == "C_Flammable_Gases"){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(catC_Flammable_Gases).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }
    if (value[elt]["type"] == "D_Metals"){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(catD_Metals).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }
    if (value[elt]["type"] == "E_Electric"){
      marker = new L.marker([value[elt]["lat"],value[elt]["lon"]], {icon: fireIcon}).addTo(catE_Electric).bindPopup("Intensité : " + value[elt]["intensity"] + "Type : " +value[elt]["type"] + "Etendue : " + value[elt]["range"]) ;
      listMarkerFire.push(marker);
    }
        
  }
}







//Gestion des véhicules-----------------------------------------------------------------------------------------------



var vehicleIcon = L.icon({
      iconUrl: 'car.png',
      iconSize:     [50, 50], // size of the icon
      iconAnchor:   [25 ,25], // point of the icon which will correspond to marker's location
      popupAnchor:  [0,-25] // point from which the popup should open relative to the iconAnchor
    });

var secourIcon = L.icon({
      iconUrl: 'secours.png',
      iconSize:     [50, 50], // size of the icon
      iconAnchor:   [25 ,25], // point of the icon which will correspond to marker's location
      popupAnchor:  [0,-25] // point from which the popup should open relative to the iconAnchor
    });

var pompesIcon = L.icon({
      iconUrl: 'pompes.png',
      iconSize:     [50, 50], // size of the icon
      iconAnchor:   [25 ,25], // point of the icon which will correspond to marker's location
      popupAnchor:  [0,-25] // point from which the popup should open relative to the iconAnchor
    });

var echelleIcon = L.icon({
      iconUrl: 'echelle.png',
      iconSize:     [50, 50], // size of the icon
      iconAnchor:   [25 ,25], // point of the icon which will correspond to marker's location
      popupAnchor:  [0,-25] // point from which the popup should open relative to the iconAnchor
    });

var citerneIcon = L.icon({
      iconUrl: 'citerne.png',
      iconSize:     [50, 50], // size of the icon
      iconAnchor:   [25 ,25], // point of the icon which will correspond to marker's location
      popupAnchor:  [0,-25] // point from which the popup should open relative to the iconAnchor
    });

var camionIcon = L.icon({
      iconUrl: 'camion.png',
      iconSize:     [50, 50], // size of the icon
      iconAnchor:   [25 ,25], // point of the icon which will correspond to marker's location
      popupAnchor:  [0,-25] // point from which the popup should open relative to the iconAnchor
    });











function getVehicle(){
  setInterval(function(){
  let context = {
  method : 'GET'
};
fetch("http://localhost:8080/access/sim/vehicle", context)
.then(response => response.json())
  .then(response => callbackVehicle(response))
  .catch(error => alert("Erreur : " + error));
},
3000);


}

function callbackVehicle(response){
  for(v of listMarkerVehicle){
    mymap.removeLayer(v);
    voiture.removeLayer(v);
    camion.removeLayer(v);
    secours.removeLayer(v);
    citerne.removeLayer(v);
    pompes.removeLayer(v);
    echelle.removeLayer(v);
  }
  listMarkerVehicle = new Array(0);

for (let vehicule in response){

    
  if (response[vehicule]["type"] == 'CAR'){
    marker = L.marker([response[vehicule]["lat"],response[vehicule]["lon"]], {icon: vehicleIcon}).addTo(voiture).bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]).on('popupopen',function(){idVehiculeNavigation = response[vehicule]["id"];
      majPrintNavigation();
      typeVehiculeNavigation =  voiture;
      navigationIsVisible = true;
  })
    .on('click',function(){
      if(closePopup){
        clearInterval(refreshNavigation);
      navigationIsVisible =false;
      closePopup=false}}) ;
      listMarkerVehicle.push(marker);
  }

  else if (response[vehicule]["type"] == 'TRUCK'){

    marker = L.marker([response[vehicule]["lat"],response[vehicule]["lon"]], {icon: camionIcon}).addTo(camion).bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]).on('popupopen',function(){idVehiculeNavigation = response[vehicule]["id"];
    majPrintNavigation();
    typeVehiculeNavigation =  camion;
    navigationIsVisible = true;
})
  .on('click',function(){
    if(closePopup){
      clearInterval(refreshNavigation);
    navigationIsVisible =false;
    closePopup=false}}) ;
    listMarkerVehicle.push(marker);
  }

  else if (response[vehicule]["type"] == 'FIRE_ENGINE'){
    
    marker = L.marker([response[vehicule]["lat"],response[vehicule]["lon"]], {icon: secourIcon}).addTo(secours).bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]).on('popupopen',function(){idVehiculeNavigation = response[vehicule]["id"];
    majPrintNavigation();
    typeVehiculeNavigation =  secours;
    navigationIsVisible = true;
})
  .on('click',function(){
    if(closePopup){
      clearInterval(refreshNavigation);
    navigationIsVisible =false;
    closePopup=false}}) ;
    listMarkerVehicle.push(marker);
  //L.marker([response[vehicule]["lat"], response[vehicule]["lon"]], {icon: vehicleIcon}).addTo(mymap)
  //.bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]);
  
  }
  else if (response[vehicule]["type"] == 'WATER_TENDER'){
  
    marker = L.marker([response[vehicule]["lat"],response[vehicule]["lon"]], {icon: citerneIcon}).addTo(citerne).bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]).on('popupopen',function(){idVehiculeNavigation = response[vehicule]["id"];
    majPrintNavigation();
    typeVehiculeNavigation =  citerne;
    navigationIsVisible = true;
})
  .on('click',function(){
    if(closePopup){
      clearInterval(refreshNavigation);
    navigationIsVisible =false;
    closePopup=false}}) ;
    listMarkerVehicle.push(marker);
  }

  else if (response[vehicule]["type"] == 'PUMPER_TRUCK'){

    marker = L.marker([response[vehicule]["lat"],response[vehicule]["lon"]], {icon: pompesIcon}).addTo(pompes).bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]).on('popupopen',function(){idVehiculeNavigation = response[vehicule]["id"];
    majPrintNavigation();
    typeVehiculeNavigation =  pompes;
    navigationIsVisible = true;
})
  .on('click',function(){
    if(closePopup){
      clearInterval(refreshNavigation);
    navigationIsVisible =false;
    closePopup=false}}) ;
    listMarkerVehicle.push(marker);
  } 
  else if (response[vehicule]["type"] == 'TURNTABLE_LADDER_TRUCK'){
  
    marker = L.marker([response[vehicule]["lat"],response[vehicule]["lon"]], {icon: echelleIcon}).addTo(echelle).bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]).on('popupopen',function(){idVehiculeNavigation = response[vehicule]["id"];
    majPrintNavigation();
    typeVehiculeNavigation =  echelle;
    navigationIsVisible = true;
})
  .on('click',function(){
    if(closePopup){
      clearInterval(refreshNavigation);
    navigationIsVisible =false;
    closePopup=false}}) ;
    listMarkerVehicle.push(marker);
//L.marker([response[vehicule]["lat"], response[vehicule]["lon"]], {icon: echelleIcon}).addTo(mymap)
//.bindPopup('Vehicule ' + response[vehicule]["id"] + response[vehicule]["type"]);

  }

  }

}

function majPrintNavigation(){
  refreshNavigation = setInterval(function(){
    if(typeof idVehiculeNavigation !== 'undefined'){
        console.log(idVehiculeNavigation);
        printNavigation(idVehiculeNavigation);
    }  
    }, 30)
  
}

function printNavigation(idVi){
  let context = {
    method : 'GET'
  };
  fetch("http://localhost:8080/access/mgn/navigation/vehicle/"+idVi, context)
  .then(response => response.json())
  .then(response => callbackPrintNavigation(response))
  .catch(error => alert("Erreur : " + error));
}

function callbackPrintNavigation(response){
  for(var i= 0; i < response.length; i++)
  {
    response[i].reverse();
  }
  if(typeof polylineNavigation !== 'undefined'){

    voiture.removeLayer(polylineNavigation);
    camion.removeLayer(polylineNavigation);
    secours.removeLayer(polylineNavigation);
    citerne.removeLayer(polylineNavigation);
    pompes.removeLayer(polylineNavigation);
    echelle.removeLayer(polylineNavigation);
  }
  if(navigationIsVisible){
    polylineNavigation = L.polyline(response, {color: 'red'}).addTo(typeVehiculeNavigation);
    closePopup=true;
  }
}

function submitAdd(){
  var selectBoxType = document.getElementById("typeVehicule");
  var selectedValueType = selectBoxType.options[selectBoxType.selectedIndex].value;
  var selectBoxCaserne = document.getElementById("caserne");
  var selectedValueCaserne = selectBoxCaserne.options[selectBoxCaserne.selectedIndex].value;

  selectedValueCaserne = parseInt(selectedValueCaserne,10)
  var caserneLon;
  var caserneLat;

  fetch("http://localhost:8080/access/mgn/caserne/"+selectedValueCaserne,
  {
      method: "GET",
  })
  .then(response => response.json())
  .then(function(response){
    caserneLon=response.lon;
    caserneLat=response.lat;


  fetch("http://localhost:8080/access/sim/vehicle",
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({lon: caserneLon,
        lat: caserneLat,
        type: selectedValueType,
        efficiency: 10.0,
        liquidType: "WATER",
        liquidQuantity: 100.0,
        liquidConsumption: 1.0,
        fuel: 100.0,
        fuelConsumption: 10.0,
        crewMember: 8,
        crewMemberCapacity: 8,
        facilityRefID: selectedValueCaserne})
  })
  .then(function(res){ console.log(res) })
})
}

function resetAllFire(){
  fetch("http://localhost:8080/access/sim/fire/reset",
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET",
  })
  .then(function(res){ console.log(res) })
}




// Interface de filtre des feux-------------------------------------------------------------------------------
var baseLayers = {};
var overlays = {
"Haute intensité" : HauteIntensite,
"Faible intensité" : FaibleIntensite,
"Grande étendue" : GrandeEtendue,
"Faible étendue" : FaibleEtendue,
"Type A" : catA,
"Type B_Gasoline" : catB_Gasoline,
"Type B_Alcohol" : catB_Alcohol,
"Type B_Plastics" : catB_Plastics,
"Type C_Flammable_Gases" : catC_Flammable_Gases,
"Type D_Metals" : catD_Metals,
"Type E_Electric" : catE_Electric,
};


L.control.layers(baseLayers, overlays, {collapsed :false}).addTo(mymap);

var baseLayers2 = {};
var overlays2 = {
"Voiture" : voiture,
"Secours" : secours,
"Pompes" : pompes,
"Citerne" : citerne,
"Echelle" : echelle,
"Camion" : camion,

};


L.control.layers(baseLayers2, overlays2, {collapsed :false}).addTo(mymap);









function getCaserne(){
  let context = {
    method : 'GET'
  };
  fetch("http://localhost:8080/access/mgn/caserne", context)
  .then(response => response.json())
  .then(response => callbackCaserne(response))
 .catch(error => alert("Erreur : " + error));


}



var marker;


function callbackCaserne(response) {
  for(c in response){
    var circle = L.circle([response[c]["lat"],response[c]["lon"]], {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.0,
        radius: 50000
    }).addTo(mymap);
    

    marker = L.marker([response[c]["lat"],response[c]["lon"]],{
      color: 'blue',
    }).addTo(mymap)
    .bindPopup('<iframe id="caserne" src= "./caserneInterface.html?caserneId='+response[c]["id"]+'" height="500" </iframe>');
  }

  var selectBox = document.querySelectorAll("#caserne");
  for(e of selectBox){
    for(c in response){
    var option = document.createElement('option');
    option.value = response[c]["id"];
    option.appendChild( document.createTextNode(""+response[c]["id"]) );
    e.appendChild(option);
  }
  }
 
        
}

function submitDelete(){
  var selectBoxVehicle = document.getElementById("vehicule");
  var selectedValueVehicle = selectBoxVehicle.options[selectBoxVehicle.selectedIndex].value;
  fetch("http://localhost:8080/access/sim/vehicle/"+selectedValueVehicle,
  {
      method: "DELETE",
  })
  .catch(error => alert("Erreur : " + error))
}
function changeFunc(){
  setTimeout(function() {
  let context = {
    method : 'GET'
  };
  fetch("http://localhost:8080/access/sim/vehicle", context)
  .then(response => response.json())
  .then(response => callbackChange(response))
  .catch(error => alert("Erreur : " + error));},300)
}

var option;
var optionList= new Array(0);

function callbackChange(response){
  console.log(response)
  var selectBox = document.getElementById("vehicule");
  var selectBoxCaserne = document.querySelectorAll("#caserne");
  var selectedValueCaserne = selectBoxCaserne[1].options[selectBoxCaserne[1].selectedIndex].value;
  console.log(selectedValueCaserne)
  while (selectBox.firstChild){
    selectBox.removeChild(selectBox.firstChild);
  }
  for(c in response){
    if(response[c]["facilityRefID"] == selectedValueCaserne){
      option = document.createElement('option');
      option.value = response[c]["id"];
      option.text = response[c]["id"]+"";
      selectBox.appendChild(option);
    }
  }
}

function changeCreationFire() {
  var inputFireCreationProbability = document.getElementById("fireCreationProbability").value;
  var inputFireCreationSleep = document.getElementById("fireCreationSleep").value;

  inputFireCreationSleep = parseInt(inputFireCreationSleep,10)
  inputFireCreationProbability = parseFloat(inputFireCreationProbability)
  fetch("http://localhost:8080/access/sim/config/creation",
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify({
        fireCreationProbability: inputFireCreationProbability,
        fireCreationSleep: inputFireCreationSleep,
        fireCreationZone: [
          {
            type: "Point",
            coordinates: [
                520820,
                5719535
            ]
          },
          {
            type: "Point",
            coordinates: [
              566984,
              5754240
            ]
          }
        ],
        max_INTENSITY: 50.0,
        max_RANGE: 50.0
      })
  })
  .then(function(res){ console.log(res) })
  .then(setTimeout(printCreationFire,500));
}

function printCreationFire(){
  let context = {
    method : 'GET'
  };
  fetch("http://localhost:8080/access/sim/config/creation", context)
  .then(response => response.json())
  .then(function(response) {
    var printFireCreationSleep = response.fireCreationSleep;
    var printFireCreationProbability = response.fireCreationProbability;
    document.getElementById("printCreationFire").innerHTML = "La probabilité de créer un feu est de "+printFireCreationProbability+" toutes les "+printFireCreationSleep+" millisecondes !";
  })
}

function changeBehaviorFire() {
  var inputReplicationProbability = document.getElementById("probaReplication").value;
  inputReplicationProbability = parseFloat(inputReplicationProbability)
  fetch("http://localhost:8080/access/sim/config/behavior",
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify({
        propagationThreshold: 5.0,
        attenuationFactor: 0.8,
        intensityReplicationThreshold: 10.0,
        replicationProbability: inputReplicationProbability,
        maxFireRange: 50.0,
        maxFireIntensity: 50.0,
        intensity_inc: 0.1,
        sleepTime: 5000
      })
  })
  .then(function(res){ console.log(res) })
  .then(setTimeout(printBehaviorFire,500));
}

function printBehaviorFire(){
  let context = {
    method : 'GET'
  };
  fetch("http://localhost:8080/access/sim/config/behavior", context)
  .then(response => response.json())
  .then(function(response) {
    var printProbaReplication = response.replicationProbability;
    document.getElementById("printBehaviorFire").innerHTML = "Le feu peut se propager avec une probabilité de "+printProbaReplication+" !";
  })
}

getFire();
getCaserne();
getVehicle();
printCreationFire();
printBehaviorFire();