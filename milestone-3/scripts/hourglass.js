// set the dimensions and margins of the graph
const margin = {top: 60, right: 125, bottom: 50, left: 180},
    width = 1400 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
    spacing = 60

// append the svg object to the body of the page
const svg2 = d3.select("#hourglass")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`
);



// Parse the Data
d3.csv("./milestone-3/data/cuisine_aggregates.csv", conversor).then( function(data) {

    
    // List of groups = header of the csv files
    data = data.sort(function(x,y){return d3.ascending(x.avg_time, y.avg_time);})
    const keys = data.columns.slice(0)
    var cuisines = d3.map(data, function(d){return(d.cuisine)})

    console.log(data)



    // color palette
    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeSet3);
    //stack the data?
    
        

    // Add X axis
  /*  var ingredients = d3.map(data, function(d){return d.avg_n_ingredients})
    const x = d3.scaleLinear()
        .domain(d3.extent(ingredients))
        .range([0, width])
    
    
    const xAxis = svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(10))

            */
    // Add Y axis

    const y = d3.scaleLinear()
        .domain([0,d3.max(data, function(d) {return d.avg_time})])
        .range([ height, 0 ]);

    svg2.append("g")
        .call(d3.axisLeft(y).ticks(10)) 

    //////////
    // BRUSHING AND CHART //
    //////////

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg2.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    const brush = d3.brushX()                 // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the scatter variable: where both the circles and the brush take place
    const areaChart = svg2.append('g')
        .attr("clip-path", "url(#clip)")

    // Area generator
    var array = cuisines
   /* const area = d3.area()
        .x(data, function(d) { return x(d.data.avg_n_ingredients);})
        .y0(data, function(d) { return y(d.avg_time);})
        .y1(data, function(d) { return y(d.avg_time);}) */

    // Show the areas
    var series = svg2.selectAll("g.series")
        .data(cuisines)
        .enter().append("g")
        .attr("class", "series"); 
    
   /* series.append("path")
        .style("fill", d3.schemeSet3)
        .attr("d", function(d){return area(d);})
    areaChart.selectAll("mylayers")
        .data(cuisines)
        .join("path")
        .attr("class", function(d) { return "myArea " + d.key })
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area) */

    // Add the brushing
    series.append("g")
        .attr("class", "brush")
        .call(brush);

    let idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event,d) {
        extent = event.selection

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain(d3.extent(data, function(d) { return d.year; }))
        }else{
            x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
            areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and area position
       // xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
       // areaChart.selectAll("path")
       //     .transition().duration(1000)
       //     .attr("d", area)
    }



    //////////
    // HIGHLIGHT GROUP //
    //////////

  /*  // What to do when one group is hovered
    const highlight = function(event,d){
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function(event,d){
        d3.selectAll(".myArea").style("opacity", 1)
    } */



    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    const size = 20

    svg2.selectAll("myrect")
        .data(array)
        .join("rect")
        .attr("x", 70)
        .attr("y", function(d,i){ return (i)*(30)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", 900)
        .attr("height",30)
        .style("fill", function(d){ return color(d)})
       // .on("mouseover", highlight)
       // .on("mouseleave", noHighlight)


     // What to do when one group is hovered
     const highlight = function(d){
        // reduce opacity of all groups
        d3.selectAll("rect").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function(event,d){
        d3.selectAll("rect").style("opacity", 1)
    }

    const highlightText = function(d){
        // reduce opacity of all groups
        d3.selectAll("mylabels").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlightText = function(event,d){
        d3.selectAll("mylabels").style("opacity", 1)
    }

    // Squares for legend
    svg2.selectAll("myrect")
        .data(array)
        .join("rect")
        .attr("x", 1050)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseout", noHighlight)

    // Labels for the legends
    svg2.selectAll("mylabels")
        .data(array)
        .join("text")
        .attr("x", 1050 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlightText)
        .on("mouseout", noHighlightText)

})

//converts time and n_ingredients into floats from string
function conversor(d) {
    d.avg_time= Number(d.avg_time);
    d.avg_n_ingredients=Number(d.avg_n_ingredients)
    return d;
}

function randomNumberGenerator(max) {
    return Math.floor(Math.random() * max) + 1
}

