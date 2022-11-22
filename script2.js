/*global google*/ /*global $*/
(function () {
    "use strict";
    const center = { lat: 41.74667326366134, lng: -74.48988162625959 };//starting point
    const options = { zoom: 15, scaleControl: true, center: center };
    const map = new google.maps.Map(document.getElementById('map'), options);

    const input = document.getElementById("pac-input");
    const aUutoCptions = {
        componentRestrictions: { country: "us" },
        fields: ["geometry"],
        strictBounds: false,
    };
    const autocomplete = new google.maps.places.Autocomplete(input, aUutoCptions);
    autocomplete.bindTo("bounds", map);
    autocomplete.addListener("place_changed", () => {
        console.log(autocomplete.getPlace());
        map.panTo(autocomplete.getPlace().geometry.location);
    });

    let pinNum = 0;
    let points = [];
    let colorArr = ["blue", "green", "red", "purple", "orange", "pink"];
    let colorIndex = 0;

    let measure = map.addListener("click", measureAmos);
    document.getElementById("measureDistance").addEventListener("click", () => {
        measure.remove();
        document.getElementsByTagName("fieldset")[0].disabled = true;
        pinNum = 0;
        measure = map.addListener("click", measureAmos);
    });

    function measureAmos(e) {
        points[pinNum % 2] = e.latLng;
        new google.maps.Marker({
            position: e.latLng,
            map: map,
            icon: {
                url: `http://maps.google.com/mapfiles/ms/icons/${colorArr[colorIndex % colorArr.length]}.png`
            }
        });

        if (pinNum++ % 2 === 1) {
            new google.maps.Polyline({ path: points, map: map });
            let distance = google.maps.geometry.spherical.computeDistanceBetween(points[0], points[1]);

            $("<div >Distance between markers: " + distance.toFixed(2) + " meter. <br> reb chim noe:" +
                distance * 2.083073 + "amos <br> chazon ish:" + distance * 1.666667 + "amos</div><hr>").prependTo("#msg").css("color", colorArr[colorIndex++ % colorArr.length]);
        }
    }
    document.getElementById("createSquare").addEventListener("click", () => {
        measure.remove();
        document.getElementsByTagName("fieldset")[0].disabled = false;

        let theBounds = new google.maps.LatLngBounds();
        pinNum = 0;
        measure = map.addListener("click", (e) => {
            pinNum++;
            new google.maps.Marker({ position: e.latLng, map: map });
            theBounds.extend(e.latLng);
            if (pinNum % 4 === 0) {
                let shita = $("#shita").val();
                let amos = $("#amos").val();
                let finalAmos = shita * amos;
                CreateSquare(theBounds, "#cc8e89", 0.8);

                let theBoundsTwo = new google.maps.LatLngBounds();
                theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(theBounds.getNorthEast(), finalAmos, 0));
                theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(theBounds.getNorthEast(), finalAmos, 90));
                theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(theBounds.getSouthWest(), finalAmos, 180));
                theBoundsTwo.extend(google.maps.geometry.spherical.computeOffset(theBounds.getSouthWest(), finalAmos, -90));
                CreateSquare(theBoundsTwo, "#cc8e89", 0.10);
                theBounds = new google.maps.LatLngBounds();
            }
        });
        function CreateSquare(bounds, fillColor, opacity = 0.35) {
            new google.maps.Rectangle({//rectangle of the city
                clickable: false,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: fillColor,
                fillOpacity: opacity,
                map,
                bounds: bounds
            });
        }

    });
}());