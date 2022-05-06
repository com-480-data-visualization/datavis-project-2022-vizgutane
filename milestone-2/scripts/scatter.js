
// add svg object to page
var svg3 = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("", function(data) {

  // x axis
  var x = d3.scaleLinear()
    .domain([0, 4000])
    .range([ 0, width ]);
  svg3.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // y axis
  var y = d3.scaleLinear()
    .domain([0, 500000])
    .range([ height, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

  // scatter points
  svg3.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.GrLivArea); } )
      .attr("cy", function (d) { return y(d.SalePrice); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

})

