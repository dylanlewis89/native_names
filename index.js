var stateData = JSON.parse(JSON.stringify(require('./state.json')));

// Load external file with states and associated tribes
var stateTribeMappings = require('./state_mappings.js');

// Get all states that are associated with tribal names
var statesFromTribes = Object.keys(stateTribeMappings.mappings());

// Create two separate FeatureCollections
var stateNonTribeLayer = {features: [], type: "FeatureCollection"};
var stateTribeLayer = {features: [], type: "FeatureCollection"};

// Conditionally put feature objects into stateNonTribeLayer or stateTribeLayer FeatureCollections
var i;
for(i=0; i<stateData.features.length; i+=1) {
  console.log(stateData.features[i].properties.name)
  if (statesFromTribes.indexOf(stateData.features[i].properties.name) == -1) {
    stateNonTribeLayer.features.push(stateData.features[i]);
  } else {
    stateTribeLayer.features.push(stateData.features[i]);
  };
};

mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5sZXdpczg5IiwiYSI6ImNpbnYxN290dDEyc3d1Nmx5NXd5NHhqYXMifQ.cOH98d9HW4pAC2jaaTV42g';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [-94.61328125,
          39.842286020743394], // starting position
    zoom: 3.5 // starting zoom
});

map.on('load', function () {
    // Load all the states
    map.addSource('states', {
        'type': 'geojson',
        'data': stateData
    });

    // Load states without tribal names
    map.addSource('nonTribalStates', {
        'type': 'geojson',
        'data': stateNonTribeLayer
    });

    // Load states with tribal names
    map.addSource('tribalStates', {
        'type': 'geojson',
        'data': stateTribeLayer
    });

    // Create base layer of all states that is invisible
    map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': 'states',
        'paint': {
            'fill-color': 'rgba(0, 128, 128, 0.0)',
            'fill-outline-color': 'rgba(0, 128, 128, 0.0)'
        }
    });

    // Create layer of states without tribal names
    map.addLayer({
        'id': 'non-tribal-states-layer',
        'type': 'fill',
        'source': 'nonTribalStates',
        'paint': {
            'fill-color': 'rgba(0, 128, 128, 0.4)',
            'fill-outline-color': 'rgba(0, 128, 128, 1)'
        }
    });

    // Create layer of states with tribal names
    map.addLayer({
        'id': 'tribal-states-layer',
        'type': 'fill',
        'source': 'tribalStates',
        'paint': {
            'fill-color': 'rgba(255, 0, 0, 0.4)',
            'fill-outline-color': 'rgba(255, 0, 0, 1)'
        }
    });
});

// Allow full state layer to be clickable and display state name
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
