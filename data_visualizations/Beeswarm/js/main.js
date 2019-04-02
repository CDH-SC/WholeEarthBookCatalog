/**
	Name: Vasco
	
	main.js
**/
var svg = d3.select("svg"),
    margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

var formatValue = d3.format(",d");

var x = d3.scaleLinear()
    .range([0, width]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var file = "data/some_editions2.tsv";
d3.tsv(file).then(function(data, error) {
  if (error) throw error;

  console.log(data);

  data.forEach(function(d) { 
    if (d.year.length > 4)
	d.year = d.year.substring(0,4);
    d.year = +d.year; 
    console.log(d.year);
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));

  var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return x(d.year); }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(4))
      .stop();

  for (var i = 0; i < 120; ++i) simulation.tick();

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10, "f"));

  var cell = g.append("g")
      .attr("class", "cells")
    .selectAll("g").data(d3.voronoi()
        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      .polygons(data)).enter().append("g");

  cell.append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return d.data.x; })
      .attr("cy", function(d) { return d.data.y; });

  cell.append("path")
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

  cell.append("title")
      .text(function(d) { return d.data.name + "\n" + formatValue(d.data.year); });
});

function type(d) {
  if (!d.year) return;
  if (d.year.length > 4)
	d.year = d.year.substring(0,4);
  d.year = +d.year;
  return d;
}

