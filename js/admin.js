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

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

        } else {
            window.location.href = "login.html";
        }
    });
});
