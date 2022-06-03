var w = 958;
var h = 477;

var svg = d3.select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color","#333F50")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content", true);

// Select projection
var projection = d3.geoEquirectangular().translate([w/2, h/2]);
var path = d3.geoPath().projection(projection);

// Load map data and distances
var worldmap = d3.json("./milestone-3/data/countries_optimalized.geojson")
var coordinates = d3.csv("./milestone-3/data/cuisine_aggregates.csv")
var distances = d3.csv("./milestone-3/data/cuisine_distance_matrix.csv")

Promise.all([worldmap, coordinates, distances]).then(function([worldmap_values, coordinate_values, distance_values]){ 
    svg.selectAll("path")
        .data(worldmap_values.features)
        .enter()
        .append("path")
        .attr("class","continent")
        .attr("d", path)

        
    // Construction of links
    var links = []
    distance_values.forEach(row => {
        var items = Object.keys(row).map(function(key) {
            return [key, row[key]];
        });
        
        // Soring array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        var current_cuisine = items[0][1];
        items = items.slice(1,6);

        // Getting cuisine coordinates and pushing into link object
        var current_cuisine_coord = coordinate_values.filter(c => c.cuisine == current_cuisine)
        items.forEach(cuisine_obj => {
            var other_cuisine_coord =  coordinate_values.filter(c => c.cuisine == cuisine_obj[0])
            links.push(
                {type: "LineString",
                coordinates: [
                    [current_cuisine_coord[0]['longitude'], current_cuisine_coord[0]['latitude']],
                    [other_cuisine_coord[0]['longitude'], other_cuisine_coord[0]['latitude']]
                ],
                thickness:cuisine_obj[1],
                class:current_cuisine}
            )
        })
    })

    // Adding the path
    svg.selectAll("myPath")
      .data(links)
      .enter()
      .append("path")
        .attr("d", function(d){ return path(d)})
        .style("fill", "none")
        .style("stroke", "rgba(0,0,0,0)")
        .style("stroke-width", function(d) {return 2 + (d.thickness**5)*7})
        .attr("class", function(d){ return d.class}) // Add class

    
    // Adding tooltips for each cuisine on hover
    coordinate_values.forEach(row => {
        var coordinates = projection([row['longitude'], row['latitude']]);
        var cuisine = row['cuisine'];
        var n_recipes = row['n_recipes'];

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background-color", "#F4B183")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "5px 10px")
            .html("<span><b>" + cuisine + "</b><br/> " + n_recipes + " recipes</span>");

        svg.append("svg:circle")
            .attr("cx", coordinates[0])
            .attr("cy", coordinates[1])
            .attr("r", 5)
            .style("fill", "#843C0C")
            .on("mouseover.line", function(){return d3.selectAll('.'+cuisine).style("stroke", "#EFA675")})
            .on("mouseover.tooltip", function(){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout.line", function(){return d3.selectAll('.'+cuisine).style("stroke", "rgba(0,0,0,0)")})
            .on("mouseout.tooltip", function(){return tooltip.style("visibility", "hidden");});
    });
});



