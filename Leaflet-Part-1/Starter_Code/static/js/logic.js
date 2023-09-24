// Creating the map

let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Creating tile layer

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  
// Url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Getting data with d3
d3.json(url).then(function(response) {

    console.log(response);
    features = response.features;
    console.log(features);

    // Add properties to the features array called radius and color
    for (i = 0; i < features.length; i++) {
        features[i].radius = Math.log(features[i].properties.mag) * 10000;

        // Get the radius value from the data source
        let radius = features[i].radius;

        // Check if the radius value is a valid number
        if (isNaN(radius)) {
        // Set the radius value to 0 if it is not a valid number
        radius = 0;
    }

    
    // set location variable
    let location = features[i].geometry
    
    // Set colors
    if (location.coordinates[2] >=-10 && location.coordinates[2] < 10) {
        depth_color = "#7DFFA2"
    } else if (location.coordinates[2] >= 10 && location.coordinates[2] < 30) {
        depth_color = "#D6FF7D"
    } else if (location.coordinates[2] >= 30 && location.coordinates[2] < 50) {
        depth_color = "#FFEB7D"
    } else if (location.coordinates[2] >= 50 && location.coordinates[2] < 70) {
        depth_color = "#FFC67D"
    } else if (location.coordinates[2] >= 70 && location.coordinates[2] < 90) {
        depth_color = "#FF977D"
    } else if (location.coordinates[2] >= 90) {
        depth_color = "#FF7D7D"
    }
        L.circle([location.coordinates[1], location.coordinates[0]], 
            {
                fillOpacity: 0.75,
                color: "White",
                fillColor: depth_color,
                radius: radius
            }).bindPopup(`<h1>Location: ${features[i].properties.place}<h1> <hr> <h3>Magnitude: ${features[i].properties.mag}<h3><h3> Depth: ${features[i].geometry.coordinates[2]} </h3>`).addTo(myMap);
    }

    // Legend 
    
    function createLegend() {
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'info legend');
            var colors = ["#7DFFA2", "#D6FF7D", "#FFEB7D", "#FFC67D", "#FF977D", "#FF7D7D"];
            var labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"]

            // title
            div.innerHTML += '<h4>Earthquake Depth</h4>';

            for (var i = 0; i < colors.length; i++) {
                div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                labels[i] + '<br>';
            }
            return div;
        };
        legend.addTo(myMap);

    }
    
    createLegend();
    
 });
