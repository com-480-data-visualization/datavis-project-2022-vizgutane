var w = 958;
var h = 477;

var svg = d3.select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color","white")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content", true);

var projection = d3.geoEquirectangular().translate([w/2, h/2]);
var path = d3.geoPath().projection(projection);

// load data  
var worldmap = d3.json("./milestone-3/data/countries_optimalized.geojson")
var coordinates = d3.csv("./milestone-3/data/cuisine_coordinates.csv")
var distances = d3.csv("./milestone-3/data/cuisine_distance_matrix.csv")

// customizable and expandable async function to draw 
Promise.all([worldmap, coordinates, distances])
    .then(function([worldmap_values, coordinate_values, distance_values]){ 
    
    // Map
    svg.selectAll("path")
        .data(worldmap_values.features)
        .enter()
        .append("path")
        .attr("class","continent")
        .attr("d", path)

        
    // Create data: coordinates of start and end
    var links = []
    distance_values.forEach(row => {
        // Create items array
        var items = Object.keys(row).map(function(key) {
            return [key, row[key]];
        });
        
        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        var current_cuisine = items[0][1];
        items = items.slice(1,6);

        var current_cuisine_coord = coordinate_values.filter(c => c.cuisine == current_cuisine)
        items.forEach(cuisine_obj => {
            var other_cuisine_coord =  coordinate_values.filter(c => c.cuisine == cuisine_obj[0])
            
            links.push(
                {type: "LineString",
                coordinates: [
                    [current_cuisine_coord[0]['longitude'], current_cuisine_coord[0]['latitude']],
                    [other_cuisine_coord[0]['longitude'], other_cuisine_coord[0]['latitude']]
                ],
                class:current_cuisine}
            )
        })
    })

    // Add the path
    svg.selectAll("myPath")
      .data(links)
      .enter()
      .append("path")
        .attr("d", function(d){ return path(d)})
        .style("fill", "none")
        .style("stroke", "rgba(0,0,0,0)")
        .style("stroke-width", 3)
        .attr("class", function(d){ return d.class}) // Add class


    coordinate_values.forEach(row => {
        var coordinates = projection([row['longitude'],row['latitude']]);
        var cuisine = row['cuisine'];

        // on-hover tooltip 
        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text(cuisine);

        svg.append("svg:circle")
            .attr("cx", coordinates[0])
            .attr("cy", coordinates[1])
            .attr("r", 5)
            .style("fill", "red")
            .on("mouseover.line", function(){return d3.selectAll('.'+cuisine).style("stroke", "blue")})
            .on("mouseover.tooltip", function(){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout.line", function(){return d3.selectAll('.'+cuisine).style("stroke", "rgba(0,0,0,0)")})
            .on("mouseout.tooltip", function(){return tooltip.style("visibility", "hidden");});
    });
    

});



