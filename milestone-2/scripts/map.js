var w = 958;
var h = 447;

var svg = d3.select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color","white")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content", true);

var projection = d3.geoEquirectangular().translate([w/2, h/2]);
var path = d3.geoPath().projection(projection);

// load data  
var worldmap = d3.json("../data/countries_optimalized.geojson");

// customizable and expandable async function to draw 
Promise.all([worldmap]).then(function( values){    

    svg.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","continent")
        .attr("d", path)

    });
