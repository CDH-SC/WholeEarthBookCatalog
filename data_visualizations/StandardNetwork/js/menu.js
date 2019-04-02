/**
	Name: Vasco
	
	menu.js
**/

function showText() {
    //get checkbox
    var checkBox = document.getElementById("showText");
    //get output
    var text = document.getElementById("text");

    if(checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function showPerson() {
    //get checkbox
    var checkBox = document.getElementById("showPerson");
    //get output
    var text = document.getElementById("text2");

    if(checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function showEdition() {
    //get checkbox
    var checkBox = document.getElementById("showEdition");
    //get output
    var text = document.getElementById("text3");

    if(checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function showPublisher() {
    //get checkbox
    var checkBox = document.getElementById("showPublisher");
    //get output
    var text = document.getElementById("text4");

    if(checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function showPlace() {
    //get checkbox
    var checkBox = document.getElementById("showPlace");
    //get output
    var text = document.getElementById("text5");

    if(checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}
