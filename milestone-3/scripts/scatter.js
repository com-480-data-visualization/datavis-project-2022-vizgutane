var margin3 = {top: 30, right: 55, bottom: 20, left: 55},
    width3 = 1200 - margin3.left - margin3.right,
    height3 = 650 - margin3.top - margin3.bottom

var svg3 = d3.select("#scatter")
  .style("background-color","#333F50")
  .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
    .attr("transform","translate(" + margin3.left + "," + margin3.top + ")");

// Import flavor data
var flavors = d3.csv("./milestone-3/data/cuisine_flavors.csv")
Promise.all([flavors]).then(function([data]){ 

  // Creating x and y axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width3 ]);
  svg3.append("g")
    .attr("transform", "translate(0," + height3 + ")")
    .call(d3.axisBottom(x));
  var y = d3.scaleLinear()
    .domain([0, 1])
    .range([ height3, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

   // Adding the the options to the button
   d3.select("#selectButton")
   .selectAll('myOptions')
    .data(['Sweet','Sour','Salty','Piquant','Bitter','Meaty'])
   .enter()
   .append('option')
   .text(function (d) { return d; }) 
   .attr("value", function (d) { return d; }) 

   // When the button is changed, run the update chart function 
   d3.select("#selectButton").on("change", function(d) {
    var selectedOption = d3.select(this).property("value")
    update(selectedOption)
  })

  // scatter points
  var dots = svg3.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Healthyness); } )
      .attr("cy", function (d) { return y(d.Sweet); } )
      .attr("r", 5.5)
      .style("fill", "#F0D8B2")

  // Labels 
  var labels = svg3.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
    .append("text")
    .attr("x", function (d) { return x(d.Healthyness)  + 8; })
    .attr("y", function (d) { return y(d.Sweet) + 12; })
    .style("fill", "white")
    .text(function(d) { return d.cuisine;})
  
  // X axis  
  svg3.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width3)
    .attr("y", height3 - 6)
    .style("fill", "white")
    .text("Deviation from recommended nutritional values");

  // Dynamic y axis text  
  var y_axis_text = svg3.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("x", 110)
    .attr("dy", ".75em")
    .style("fill", "white")
    .text("Sweet score");  
  
  // Update function when button is pressed
  function update(selectedOption) {
    console.log(selectedOption);

    dots.transition()
    .duration(300).attr("cy", function(d) {
      return y(d[selectedOption])
    })

    labels.transition()
    .duration(300).attr("y", function(d) {
      return y(d[selectedOption])
    })

    y_axis_text.text( function() { return selectedOption + " score"})
  }
})

