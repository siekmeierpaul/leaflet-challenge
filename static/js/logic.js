function chooseColor(earthquakeDepth) {
    if (parseInt(earthquakeDepth) > 100) {
        return "black";
    } else if (parseInt(earthquakeDepth) > 75) {
        return "red";
    } else if (parseInt(earthquakeDepth) > 50) {
        return "orange";
    } else if (parseInt(earthquakeDepth) > 25) {
        return "yellow";
    } else {
        return "white";
    }
}  

function createMap(earthquakeFeatures) {
    // Create the tile layer that will be the background of our map
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Map": darkmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakeFeatures
    };
  
    // Create the map object with options
    var map = L.map("mapid", {
      center: [61.2181, -149.9003],    // centered on Anchorage, Alaska for family there
      zoom: 6,
      layers: [darkmap, earthquakeFeatures]
    });
  
    // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });
    
    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };
    // Add the info legend to the map
    info.addTo(map);
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
    
    document.querySelector(".legend").innerHTML = ["<p>Updated: " + "</p>"].join("");
}
  
function createMarkers(response) {
   console.log(response);
    // Pull the "features" property off of response
    var features = response.features;
  
    // Initialize an array to hold earthquakes
    var earthquakes = [];
  
    // Loop through the features array
    for (var index = 0; index < features.length; index++) {
      var feature = features[index];
  
      // For each feature, create a circle and bind a popup with the feature's place
      var earthquake = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "black",
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        radius: (feature.properties.mag * 10000)
      }).bindPopup("<h3>" + feature.properties.title + "</h3><h3>Place: " + feature.properties.place + "</h3>");
  
      // Add the circle to the earthquakes array
      earthquakes.push(earthquake);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakes));
}
  
// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);
  


    