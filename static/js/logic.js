function createMap(earthquakeFeatures) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakeFeatures
    };
  
    // Create the map object with options
    var map = L.map("mapid", {
      center: [0, 0],
      zoom: 1,
      layers: [lightmap, earthquakeFeatures]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
   console.log(response);
    // Pull the "stations" property off of response.data
    var features = response.features;
  
    // Initialize an array to hold bike markers
    var earthquakes = [];
  
    // Loop through the stations array
    for (var index = 0; index < features.length; index++) {
      var feature = features[index];
  
      // For each station, create a marker and bind a popup with the station's name
      var earthquake = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
        .bindPopup("<h3>" + feature.properties.place + "<h3><h3>Capacity: " + feature.properties.place + "</h3>");
  
      // Add the marker to the bikeMarkers array
      earthquakes.push(earthquake);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakes));
  }
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson").then(createMarkers);
  