function Car() {
    this.id = "";
    this.make = "";
    this.model = "";
    this.year = 0;
    this.color = "";
}

var allCars = [];

var database = firebase.database();



$( document ).ready(function() {
    console.log( "Initialized!" );
    pullAllCars();
});



function pullAllCars() {
    return database.ref('/cars/').once('value').then(function(snapshot) {
        var carsData = snapshot.val();
        $.each(carsData, function(carID, carObject) {
            var car = new Car();
            car.id = carID;
            car.make = carObject["Make"];
            car.model = carObject["Model"];
            car.year = carObject["Year"];
            car.color = carObject["Color"];
            allCars[carID] = car;
        });
        showAllCars();
    });
}


// Updates Database value
function updateCar(car) {
    database.ref('cars/' + car.id).set({
        Make: car.make,
        Year: car.year,
        Color : "blue",
        Model: car.model
    });
}

// Quick function to create car objects for testing
function TESTcreateCar() {
    database.ref('cars/one/').set({
        Make: "Ford",
        Year: 2017,
        Color : "Blue",
        Model: "Escape"
    });
}

function createCar(make,model,color,year) {
    var idNumber = Math.floor((Math.random() * 100000) + 1);
    database.ref('cars/' + year + color + make + model + '_'+ idNumber + '/').set({
        Make: make,
        Year: year,
        Color : color,
        Model: model
    });
}


function showAllCars() {
    var carElements = "";
    for(var carID in allCars){
        var car = allCars[carID];
        carElements+= "";
        carElements += "<div class=\"car\">";
        carElements += "                <div class=\"title\">";
        carElements += car.make + " " + car.model + " " + car.year;
        carElements += "<\/div>";
        carElements += "                <div class=\"description\">";
        carElements += car.color;
        carElements += "<\/div>";
        carElements += "            <\/div>";
    }
 $('.cars-container').append(carElements);
}
