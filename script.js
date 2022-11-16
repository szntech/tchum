/*global google*/
let map;
(function () {
  "use strict";
  let center = { lat: 41.74667326366134, lng: -74.48988162625959 };//starting pont
  const options = { zoom: 15, scaleControl: true, center: center };
  map = new google.maps.Map(document.getElementById('map'), options);
  let pinNum = 1;
  let latlng1; let latlng2;
  let colorArr = ["yellow", "blue", "green", "red", "purple", "orange", "pink"];
  let colorIndex = 1;

  let measure = map.addListener("click", (e) => { measureAmos(e); });
  function measureAmos(e) {
    if (pinNum % 2 === 1) {
      pinNum++;
      latlng1 = e.latLng;
      new google.maps.Marker({
        position: latlng1,
        map: map,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${colorArr[colorIndex % colorArr.length]}.png`
        }
      });
    }
    else {
      pinNum++;
      latlng2 = e.latLng;
      new google.maps.Marker({
        position: latlng2,
        map: map,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${colorArr[colorIndex % colorArr.length]}.png`
        }
      });
      new google.maps.Polyline({ path: [latlng1, latlng2], map: map });
      let distance = google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);
      $("<div >Distance between markers: " + distance.toFixed(2) + " meter. <br> reb chim noe:" +
        distance * 2.083073 + "amos <br> chazon ish:" + distance * 1.666667 + "amos</div><hr>").prependTo("#msg").css("color", colorArr[colorIndex % colorArr.length]);
      colorIndex++;
    }
  }
  document.getElementById("measureDistance").addEventListener("click", e => {
    measure.remove();
    document.getElementsByTagName("fieldset")[0].disabled = true;
    pinNum = 1;
    measure = map.addListener("click", (e) => { measureAmos(e); });
  });
  document.getElementById("createSquare").addEventListener("click", e => {
    measure.remove();
    document.getElementsByTagName("fieldset")[0].disabled = false;
    let squareArr = [];
    pinNum = 0;
    measure = map.addListener("click", (e) => {
      pinNum++;
      let lat = e.latLng.lat();
      let lng = e.latLng.lng();
      squareArr.push({ lat: lat, lng: lng });
      new google.maps.Marker({ position: e.latLng, map: map });
      if (pinNum === 4) {
        let shita = $("#shita").val(); let amos = $("#amos").val(); let finalAmos = shita * amos;
        let squareArrCoord = [squareArr[0], squareArr[0], squareArr[0], squareArr[0]];
        for (let index = 1; index < 4; index++) {
          squareArrCoord[0] = squareArrCoord[0].lat < squareArr[index].lat ? squareArr[index] : squareArrCoord[0];
          squareArrCoord[1] = squareArrCoord[1].lat > squareArr[index].lat ? squareArr[index] : squareArrCoord[1];
          squareArrCoord[2] = squareArrCoord[2].lng < squareArr[index].lng ? squareArr[index] : squareArrCoord[2];
          squareArrCoord[3] = squareArrCoord[3].lng > squareArr[index].lng ? squareArr[index] : squareArrCoord[3];
        }
        new google.maps.Rectangle({//rectangle of the city
          clickable: false,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map,
          bounds: {
            north: squareArrCoord[0].lat,
            south: squareArrCoord[1].lat,
            east: squareArrCoord[2].lng,
            west: squareArrCoord[3].lng,
          },
        });
        new google.maps.Rectangle({//rectangle of the tchum
          clickable: false,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: "#cc8e89",
          fillOpacity: 0.50,
          map,
          bounds: {
            north: google.maps.geometry.spherical.computeOffset(squareArrCoord[0], finalAmos, 0).lat(),
            south: google.maps.geometry.spherical.computeOffset(squareArrCoord[1], finalAmos, 180).lat(),
            east: google.maps.geometry.spherical.computeOffset(squareArrCoord[2], finalAmos, 90).lng(),
            west: google.maps.geometry.spherical.computeOffset(squareArrCoord[3], finalAmos, -90).lng(),
          },
        });
        pinNum = 0;
        squareArr = [];
      }
    });

  });
}());
