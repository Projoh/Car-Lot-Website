function Car() {
    this.id = "";
    this.make = "";
    this.model = "";
    this.year = "";
    this.color = "";
    this.vin = "";
    this.doors = "";
    this.price = "";
    this.trans = ""
    this.features= "";
    this.mileage = "";
    this.images = "";
    this.visibility = true;
}
var allCars = [];

var database = firebase.database();
var storageRef = firebase.storage().ref();
var carsRef = database.ref('/cars/');
var newFilesToAdd = [];

function stopProgressBar() {
    var progressBar = $('.progress');
    progressBar.addClass("invisible");
}

function startProgressBar() {
    var progressBar = $('.progress');
    progressBar.removeClass("invisible");
}

function sanitizeInput(input) {
    return input.replace(/[&\/\\#,+() $~%'":*?<>{}]/g, '');
}

$( document ).ready(function() {
    console.log( "Initialized!" );
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            allCarsListener();
            //$('.modal').modal()
            //$('#modal1').modal('open')
        } else {
            window.location.href = "login.html";
        }
    });
});

function allCarsListener() {
    carsRef = database.ref('/cars/');
    carsRef.on('value', function(snapshot) {

        var carsData = snapshot.val();

        $.each(carsData, function(carID, carObject) {
            var car = new Car();
            car.id = carID;
            car.make = carObject["make"];
            car.model = carObject["model"];
            car.year = carObject["year"];
            car.color = carObject["color"];
            car.features = carObject["features"];
            car.images = carObject["images"];
            car.vin = carObject["vin"];
            car.doors = carObject["doors"];
            car.visibility = carObject["visibility"];
            car.price = carObject["price"];
            car.trans = carObject["trans"];
            car.mileage = carObject["mileage"];
            if(car.images){
                car.images = car.images.split(',');
            }
            Object.keys(car).forEach(function(key,index) {
                if(car[key] == undefined){
                    car[key] = "";
                }
            });
            allCars[carID] = car;
        });
        showAllCars();
        //loadCarImages();

    });
}

function showAllCars() {
    var carsContainer = $('.cars-container');
    carsContainer.html("");
    var carElements = "";
    for(var carID in allCars){
        var car = allCars[carID];
        carElements += "            <div class=\"card-panel waves-effect waves-green car-list-item\" onclick=\"editCar('";
        carElements += car.id;
        carElements += "')\">";
        carElements += "                <div class=\"row\">";
        carElements += "                    <div class=\"col l2 s4 m2\">";
        carElements += "                        <img id=\"img-"+carID+"\" src=\"http:\/\/via.placeholder.com\/100x100\">";
        carElements += "                    <\/div>";
        carElements += "                    <div class=\"col s6 m9\">";
        carElements += "                        <div class=\"flow-text\">";
        carElements += "                            <h6>";
        carElements += "                                " + car.year +" "+ car.make +" "+ car.model;
        carElements += "                            <\/br>";
        carElements += "                                " + car.color;
        carElements += "                            <\/h6>";
        carElements += "                            <h6 class=\"flow-text truncate\">";
        carElements += "                                "+(car.features ? car.features : "N/A");
        carElements += "                            <\/h6>";
        carElements += "                        <\/div>";
        carElements += "                    <\/div>";
        carElements += "                    <div class=\"col s1\">";
        carElements += "                        <p class=\"flow-text grey-text\"><i class=\"material-icons\">mode_edit<\/i><\/p>";
        carElements += "                    <\/div>";
        carElements += "                <\/div>";
        carElements += "            <\/div>";
    }
    carsContainer.append(carElements);
    stopProgressBar();
}




function addChip() {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
    input.addEventListener('change', function(e){
        //Get files
        var chipImageElement="";
        var chipImages = $('.car-chip-images');
        for (var i = 0; i < e.target.files.length; i++) {
            var fileName = e.target.files[i];
            newFilesToAdd.push(fileName);
            var idNumber = Math.floor((Math.random() * 100) + 1);
            chipImageElement += "<div class=\"chip " +idNumber +"\" id=\"";
            chipImageElement += fileName.name;
            chipImageElement += "\">";
            chipImageElement += "                            <img src=\"http:\/\/via.placeholder.com\/25x25\">";
            chipImageElement += fileName.name;
            chipImageElement += "                            <i class=\"delete material-icons\" onclick=\"deleteImage('";
            chipImageElement += idNumber;
            chipImageElement += "')\">close<\/i>";
            chipImageElement += "                        <\/div>";
        }

        chipImages.append(chipImageElement);
    });
}



function editCar(carID) {
    var isNewCar = false;
    var car;


    $('.modal-section').html(""); // Clear Modal
    checkNewCar();
    createModal();
    initializeModal();

    addChipsFromDatabase();




    function checkNewCar() {
        if(carID == undefined){
            isNewCar = true;
            car = new Car();
            car.id = "newCarID";
        } else {
            car = allCars[carID];
        }
    }



    function createModal() {
        var carElements="";
        carElements += "<div id=\"";
        carElements += car.id;
        carElements += "\" class=\"modal\">";
        carElements += "        <div class=\"modal-content\">";
        carElements += "            <h4>";
        carElements += car.year +" " + car.make + " " +car.model;
        carElements += "            <\/h4>";
        carElements += "            <div class=\"row\">";
        carElements += "                <form class=\"col s12\">";
        carElements += "";
        carElements += "                    <div class=\"row\">";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.year;
        carElements += "\" id=\"year\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"year\">Year<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.make;
        carElements += "\" id=\"make\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"make\">Make<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.model;
        carElements += "\" id=\"model\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"model\">Model<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.vin;
        carElements += "\" id=\"vin\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"vin\">VIN<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.price;
        carElements += "\" id=\"price\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"price\">Price<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.doors;
        carElements += "\" id=\"doors\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"doors\">Doors<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.mileage;
        carElements += "\" id=\"mileage\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"mileage\">Mileage<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.color;
        carElements += "\" id=\"color\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"color\">Color<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.trans;
        carElements += "\" id=\"trans\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"trans\">Trans<\/label>";
        carElements += "                        <\/div>";
        carElements += "                    <\/div>";
        carElements += "";
        carElements += "                    <div class=\"row\">";
        carElements += "                        <div class=\"input-field col s12\">";
        carElements += "                            <textarea id=\"features\" class=\"materialize-textarea\"><\/textarea>";
        carElements += "                            <label for=\"features\">Features<\/label>";
        carElements += "                        <\/div>";
        carElements += "                    <\/div>";
        carElements += "                    <div class=\"col s12\">";
        carElements += "                        <h6>Images<\/h6>";
        carElements += "                        <div class=\"car-chip-images\">";
        carElements += "";
        carElements += "                        <\/div>";
        carElements += "";
        carElements += "";
        carElements += "                        <a class=\"waves-effect waves-light btn-flat right\" onclick=\"addChip()\"><i class=\"large material-icons left\">add<\/i>ADD MORE<\/a>";
        carElements += "";
        carElements += "";
        carElements += "";
        carElements += "                    <\/div>";
        carElements += "                <\/form>";
        carElements += "            <\/div>";
        carElements += "        <\/div>";
        carElements += "        <div class=\"modal-footer\">";
        carElements += "            <a href=\"#!\" class=\"modal-action waves-effect waves-green btn-flat\" onclick=\"archiveCar('";
        carElements += car.id;
        carElements += "')\">";
        carElements += "                ARCHIVE";
        carElements += "            <\/a>";
        carElements += "            <a href=\"#!\" class=\"modal-action waves-effect waves-green btn-flat\" onclick=\"submitEditCar('";
        carElements += car.id;
        carElements += "')\">SAVE CHANGES<\/a>";
        carElements += "        <\/div>";
        carElements += "    <\/div>";
        $('.modal-section').append(carElements);
        $('#'+car.id).find('.materialize-textarea').val(car.features);
    }

    function addChipsFromDatabase() {
        var chipImageElement="";
        var chipImages = $('.car-chip-images');

        for (var image in car.images) {
            var idNumber = Math.floor((Math.random() * 100) + 1);
            chipImageElement += "<div class=\"chip " +idNumber +"\" id=\"";
            chipImageElement += car.images[image];
            chipImageElement += "\">";
            chipImageElement += "                            <img src=\"http:\/\/via.placeholder.com\/25x25\">";
            chipImageElement += car.images[image];
            chipImageElement += "                            <i class=\"delete material-icons\" onclick=\"deleteImage('";
            chipImageElement += idNumber;
            chipImageElement += "')\">close<\/i>";
            chipImageElement += "                        <\/div>";
        }

        chipImages.append(chipImageElement);
    }

    function initializeModal() {
        var carModel = $('#'+car.id);
        configureModalOptions();
        carModel.modal('open');
        Materialize.updateTextFields();
        carModel.find('.materialize-textarea').trigger('autoresize');
        function configureModalOptions() {
            var modal = $('.modal');
            modal.modal();
            carModel.modal({
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    inDuration: 150, // Transition in duration
                    outDuration: 100, // Transition out duration
                    startingTop: '4%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                        //
                    },
                    complete: function() {
                        newFilesToAdd = [];
                    } // Callback for Modal close
                }
            );
        }
    }
}

function deleteImage(imageNumber) {
    var chip = $('.'+imageNumber);
    chip.remove();
}


function submitEditCar(carID) {
    var isNewCar = false;
    startProgressBar();

    var form = $('#'+carID).find( "form" );
    var features = form.find('.materialize-textarea').val();
    var make = $('#make').val();
    var year = $('#year').val();
    var color = $('#color').val();
    var model = $('#model').val();
    var vin = $('#vin').val();
    var doors = $('#doors').val();
    var price = $('#price').val();
    var mileage = $('#mileage').val();
    var trans = $('#trans').val();
    var imagesInput = [];
    var imagesToUpload = [];

    if(carID.valueOf() == "newCarID"){
        var idNumber = Math.floor((Math.random() * 100000) + 1);
        isNewCar = true;
        carID = year + color + make + model + '_'+ idNumber;
    }


    var chips = form.find('.chip');
    for(var i = 0; i<chips.length;i++){
        imagesInput[i] = chips[i].id;
    }


    var carRef = database.ref('cars/' + carID);
    if(isNewCar){
        carRef.set({
            make:  make,
            year: year,
            color : color,
            model: model,
            vin : vin,
            price: price,
            mileage: mileage,
            trans: trans,
            visible : true,
            features: features
        }).then(function () {
            uploadImages();
        });

    } else {
        carRef.update({
            make:  make,
            year: year,
            color : color,
            model: model,
            vin : vin,
            price: price,
            mileage: mileage,
            trans: trans,
            visible : true,
            features: features
        }).then(function () {
            uploadImages();
        });
    }





    function uploadImages() {
        if(!isNewCar) {
            database.ref('cars/' + carID+'/images').once('value').then(function(snapshot) {
                var images = snapshot.val();
                var originalImages = [];
                if(images) {
                    originalImages= images.split(",");
                }
                var matchingImages = [];
                for(var carImage in imagesInput) {
                    if (originalImages.indexOf(carImage) > -1) {
                        matchingImages.push(imagesInput[carImage]);
                    } else {
                        imagesToUpload.push(imagesInput[carImage]);
                    }
                }
                images = matchingImages.join(',');

                if(images && images.count(',') < 2){
                    images = images.replace(',', "");
                }
                database.ref('cars/' + carID+'/images/').set(images).then(function () {
                    uploadNewImages();
                })
            });


        } else {
            imagesToUpload = imagesInput;
            uploadNewImages();
        }
    }


    function uploadNewImages() {
        var imageFiles = [];
        for(var image in imagesToUpload) {
            for(var imgToUp in newFilesToAdd) {
                if(newFilesToAdd[imgToUp].name.valueOf() == imagesToUpload[image]) {
                    imageFiles.push(newFilesToAdd[imgToUp]);
                }
            }
        }

        for(var imageFile in imageFiles) {
            uploadImageAsPromise(imageFiles[imageFile]);
        }

        var carModel = $('#'+carID);
        if(isNewCar) {
            carModel =$('#newCarID');
            carModel.modal('close');
        } else {
            carModel.modal('close');
        }

        function uploadImageAsPromise (imageFile) {
            return new Promise(function (resolve, reject) {
                var fileName = sanitizeInput(imageFile.name);
                startProgressBar();

                var storageRef = this.storageRef.child('cars/' + carID + '/' + fileName);
                var uploadTask = storageRef.put(imageFile);


                //Update progress bar
                uploadTask.on('state_changed',
                    function progress(snapshot) {
                        var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    },
                    function error(err) {
                        showCarEditErrorMessage(err.message);
                    },
                    function complete() {
                        var downloadURL = uploadTask.snapshot.downloadURL;

                        database.ref('cars/' + carID + '/images').once('value').then(function (snapshot) {
                            var images = snapshot.val();
                            images = (images) ? images + "," + fileName : fileName;
                            database.ref('cars/' + carID + '/images/').set(images).then(function () {
                                stopProgressBar();
                            });
                        });
                    }
                );
            });
        }
    }

    function showCarEditErrorMessage(message) {
        var errorMessageContainer = $('.car-edit-error-message');
        errorMessageContainer.html(message);

    }





    //var images = $('#model').val();



    stopProgressBar();
}

