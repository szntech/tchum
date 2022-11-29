/*global google*/ /*global $*/
(function () {
    "use strict";
    const shita = 0.53975; //R'Moshe ztzl
    const amos = 2000;
    const daledAmos = shita * 4;
    const distance = shita * amos;
    const center = { lat: 41.74667326366134, lng: -74.48988162625959 };//starting point
    const options = { zoom: 8, scaleControl: true, center: center, mapTypeId: 'hybrid' };
    const map = new google.maps.Map(document.getElementById('map'), options);
    let squareArr = [];

    const input = document.getElementById("pac-input");
    const aUutoCptions = {
        fields: ["geometry"],
        strictBounds: false,
    };
    const autocomplete = new google.maps.places.Autocomplete(input, aUutoCptions);
    autocomplete.bindTo("bounds", map);
    autocomplete.addListener("place_changed", () => {
        //console.log(autocomplete.getPlace());
        let currrentSpot = autocomplete.getPlace().geometry.location;
        map.panTo(currrentSpot);
        let theBounds = new google.maps.LatLngBounds();
        theBounds.extend(currrentSpot);
        let smallSquare = ExtendSquare(theBounds, daledAmos);
        let largeSquare = ExtendSquare(smallSquare, distance);
        map.fitBounds(largeSquare);
        const smSquare = CreateSquare(smallSquare, true, "#cc8e89", 0.4);
        const lgSquare = CreateSquare(largeSquare, false, "#cc8e89", 0.2);
        smSquare.addListener("bounds_changed", () => { lgSquare.setBounds(ExtendSquare(smSquare.getBounds(), distance)); });
        squareArr.push(smSquare);
        squareArr.push(lgSquare);
    });
    function ExtendSquare(bounds, distance) {
        let theBoundsTwo = new google.maps.LatLngBounds();
        theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(bounds.getNorthEast(), distance, 0));
        theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(bounds.getNorthEast(), distance, 90));
        theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(bounds.getSouthWest(), distance, 180));
        theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(bounds.getSouthWest(), distance, -90));
        return theBoundsTwo;
    }
    function CreateSquare(bounds, editDrag, fillColor, opacity = 0.35) {
        let square = new google.maps.Rectangle({//rectangle of the city
            clickable: false,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fillColor,
            fillOpacity: opacity,
            editable: editDrag,
            draggable: false,
            map,
            bounds: bounds
        });
        return square;
    }

    const resetBttn = document.createElement("button");

    resetBttn.textContent = "Clear";
    resetBttn.classList.add("custom-map-control-button");
    resetBttn.classList.add("material-symbols-outlined");

    resetBttn.addEventListener("click", () => {
        squareArr.forEach((square) => {
            square.setMap(null);
        });
        squareArr = [];
    });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(resetBttn);

    const modal = document.querySelector('#my-modal');
    //const closeBtn = document.querySelector('.close');
    $("#closeBttn").on("click", closeModal);
    $(".close").on("click", closeModal);
    window.addEventListener('click', outsideClick);
    function closeModal() {
        modal.style.display = 'none';
    }
    function outsideClick(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }
}());