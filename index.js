var stateData = JSON.parse(JSON.stringify(require('./state.json')));

mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5sZXdpczg5IiwiYSI6ImNpbnYxN290dDEyc3d1Nmx5NXd5NHhqYXMifQ.cOH98d9HW4pAC2jaaTV42g';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [-94.61328125,
          39.842286020743394], // starting position
    zoom: 3.5 // starting zoom
});

map.on('load', function () {
    // Add marker data as a new GeoJSON source.
    map.addSource('states', {
        'type': 'geojson',
        'data': stateData
    });

        // Add a layer showing the markers.
    map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': 'states',
        'paint': {
            'fill-color': 'rgba(0, 128, 128, 0.4)',
            'fill-outline-color': 'rgba(0, 128, 128, 1)'
        }
    });
});

// When a click event occurs near a marker icon, open a popup at the location of
// the feature, with description HTML from its properties.

map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['states-layer'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    var popup = new mapboxgl.Popup()
        .setLngLat(map.unproject(e.point))
        .setHTML(feature.properties.name)
        .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['states-layer'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : 'not-allowed';
});
