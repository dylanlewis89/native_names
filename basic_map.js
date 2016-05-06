
mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5sZXdpczg5IiwiYSI6ImNpbnYxN290dDEyc3d1Nmx5NXd5NHhqYXMifQ.cOH98d9HW4pAC2jaaTV42g';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [-94.61328125,
          39.842286020743394], // starting position
    zoom: 3.5 // starting zoom
});
