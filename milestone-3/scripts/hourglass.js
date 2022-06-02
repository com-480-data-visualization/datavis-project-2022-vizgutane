// set the dimensions and margins of the graph
var margin2 = {top: 90, right: 300, bottom: 10, left: 55},
    width2 = 900 - margin2.left - margin2.right,
    height2 = 350 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#hourglass")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right )
    .attr("height", height2 + margin2.top + margin2.bottom)
    .attr("class", "hourglassgraph")
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

var cuisine_timeseries = d3.csv("./milestone-3/data/out.csv")

// Parse the Data
Promise.all([cuisine_timeseries]).then(function([data]){ 

  // List of groups = header of the csv files
  var keys = data.columns.slice(1)

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.x; }))
    .range([ 0, width2 ]);
  svg2.append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 4000])
    .range([ height2, 0 ]);
  svg2.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])

  //stack the data?
  var stackedData = d3.stack()
    .keys(keys)
    (data)
    //console.log("This is the stack result: ", stackedData)

  // Show the areas
  svg2
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", d3.area()
        .x(function(d, i) { return x(d.data.x); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )

    // Add one dot in the legend for each name.
    const size = 20
    svg2.selectAll("myrect")
        .data(keys)
        .join("rect")
        .attr("x", 20)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})


    // Add one dot in the legend for each name.
    svg2.selectAll("mylabels")
        .data(keys)
        .join("text")
        .attr("x", 1100 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")


 
})


d3.select("#hourglass").append("img")
    .attr("src","./milestone-3/images/hourglass4.svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom + 22)
    .attr("class", "hourglass")
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")")

