function printVehicle(response){
  document.getElementById("caserneInfo").innerHTML = "Caserne : "+caserneId;
  if(indexMax==0){
    document.getElementById("nbCamion").innerHTML = "Pas de camion";
    document.getElementById("slideshow-container").style.display ="none"
  } else if(indexTruck<indexMax && indexTruck>=0) {
    var deleteArray = new Array(0);
    for(c of response){
      if(c.facilityRefID != caserneId){
        deleteArray.push(c);
      }
    }
    for(c of deleteArray){
      var pos = response.indexOf(c);
      response.splice(pos, 1);
    }
    document.getElementById("slideshow-container").style.display ="block"
    document.getElementById("nbCamion").innerHTML = "Nombre de Véhicule : "+response.length;
    w3.displayObject("truckInfo",response[indexTruck]);
  } 
}

function slide(){
  let context = {
      method : 'GET'
    };
  fetch("http://localhost:8080/access/sim/vehicle", context)
  .then(response => response.json())
  .then(response => printVehicle(response))
  .catch(error => alert("Erreur : " + error));
}


function getParameterByName(name)
{
 name = name.replace("/[[]/", "[").replace("/[]]/", "]");
 var regexS = "[?&]" + name + "=([^&#]*)";
 var regex = new RegExp(regexS);
 var results = regex.exec(window.location.search);
 if(results == null)
 return ;
 else
 return decodeURIComponent(results[1].replace("/+/g", ));
}

var caserneId = parseInt(getParameterByName("caserneId"));

function nbVehicleCaserne(){
  let context = {
    method : 'GET'
  };
  fetch("http://localhost:8080/access/sim/vehicle", context)
  .then(response => response.json())
  .then(response => callbackNbVehicleCaserne(response))
  .catch(error => alert("Erreur : " + error));
}
function callbackNbVehicleCaserne(response){
  var deleteArray = new Array(0);
  for(c of response){
    if(c.facilityRefID != caserneId){
      deleteArray.push(c);
    }
  }
  for(c of deleteArray){
    var pos = response.indexOf(c);
    response.splice(pos, 1);
  }
  indexMax= response.length;
}

function plusSlides(i){
  indexTruck+=i
  if(indexTruck>=indexMax && i==1 ){
    indexTruck = 0;
  } else if (indexTruck<0 && i==-1){
    indexTruck=indexMax-1;
  }
  slide()
}

var indexMax;
nbVehicleCaserne();
var indexTruck = 0;
slide();



