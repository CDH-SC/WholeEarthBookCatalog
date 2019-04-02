/**
    Name: Vasco Madrid
*/

var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

// Set up SVG
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

//set up select 
for(var i=1900; i<=1960; i++){
    var select = document.getElementById("year");
    var option = document.createElement("OPTION");
	select.options.add(option);
	option.text = i;
	option.value = i;
}

var time = 0,
	lastYear = 1960,
	firstYear = 1900,
	minEditions = 1,
	maxEditions = 100,
	minPublishers = 1,
	maxPublishers = 60,
	minAuthors = 1,
	maxAuthors = 300;


// Scales
var x = d3.scaleLog()
    .base(10)
    .range([0, width])
    .domain([minAuthors, maxAuthors]);
    //console.log(x)
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([minPublishers, maxPublishers]);
var area = d3.scaleLinear()
    .range([25*Math.PI, 1000*Math.PI])
    .domain([minEditions, maxEditions]);
    //console.log(area)
var continentColor = d3.scaleOrdinal(d3.schemeSet1);

// Labels
var xLabel = g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Number of Authors");
var yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Number of Publishing Companies");
var timeLabel = g.append("text")
    .attr("id", "tLabel")
    .attr("y", height -10)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text(firstYear);

// X Axis
var xAxisCall = d3.axisBottom(x)
    .ticks(4, "s");
g.append("g")
    .attr("class", "axisWhite")
    .attr("transform", "translate(0," + height +")")
    .call(xAxisCall);

// Y Axis
var yAxisCall = d3.axisLeft(y)
    .tickFormat(function(d){ return +d; });
g.append("g")
    .attr("class", "axisWhite")
    .call(yAxisCall);

//console.log("before data");
d3.json("data/data.json").then(function(data){
	//console.log("data gottt");
	//clean data
	const formattedData = data.map(function(year) {
	  return year["countries"].filter(function(country){
	    var dataExists = (country.editions && country.authors && country.publishers);
	    return dataExists;
	  }).map(function(country){
	    country.editions = +country.editions;
	    country.authors = +country.authors;
	    country.publishers = +country.publishers;
	    return country;
          })
	});

	formattedData[0].forEach(function(d) { return data.country; });

	var circles = g.selectAll("circle").data(formattedData[0],function(d){
	  	return d.country;        
	});

	circles.enter()
		.append("circle")
		.attr("class", "enter")
		.attr("fill", function(d) {
		  return continentColor(d.continent);})
		.merge(circles)
		.attr("cy", function(d) { return y(d.publishers); })
		.attr("cx", function(d) { return x(d.authors); })
		.attr("r", function(d) {
		  return Math.sqrt(area(d.editions) / (Math.PI)); })
		.on("mouseover", function(d) {	
			console.log("mouseover");	
            		div.transition()		
                		.duration(200)		
                		.style("opacity", .9);		
	                 div .html(d.continent + "<br/>"  + d.country +
					"<br/>Editions: " + d.editions + 
					"<br/>Authors: " + d.authors + 
					"<br/>Publishers: " + d.publishers)	
                		.style("left", (d3.event.pageX) + "px")		
                		.style("top", (d3.event.pageY - 28) + "px");})
        	.on("mouseout", function(d) {		
            		div.transition()		
                		.duration(500)		
                		.style("opacity", 0);	
        	});
		

	//set speed for update
	var slider = document.getElementById("myRange");
        var startButton = document.getElementById("startButton");

	var interval = 100;
	var timeInterval = 1;

       	startButton.onclick = function(){
		interval = (101 - slider.value);
		//console.log(slider.value + ", " + interval);
	        time = 0;
		var setInt = setInterval(function() {
			if(time*timeInterval <= lastYear - firstYear){
				//stops updating at last year		
			    	update(formattedData[time], time*timeInterval);
			    	time++;
				}else{clearInterval(setInt);}
			}, interval);
                        interval = (101 - slider.value);
			update(formattedData[0], time*timeInterval);
			return;
        	}
        var dropDown = document.getElementById("year");
        
	dropDown.onclick = function(){
       		var year = dropDown.options[dropDown.selectedIndex].value;
                update(formattedData[year-firstYear], time*timeInterval);
		d3.select("#tLabel")
			.text(year);
	}		
        
});

function update(fData, time){
	//update data assigned to circles
	circles = g.selectAll("circle").data(fData, function(d){
		return d.country;
	});
	//redraw circles
	circles.enter()
		.append("circle")
		.attr("class", "enter")
		.attr("fill", function(d) {
			return continentColor(d.continent);})
		.merge(circles)
		.attr("cy", function(d) { return y(d.publishers); })
		.attr("cx", function(d) { return x(d.authors); })
		.attr("r", function(d) { 
		  	return Math.sqrt(area(d.editions) / Math.PI)
		})
		.on("mouseover", function(d) {	
            		div.transition()		
                		.duration(200)		
                		.style("opacity", .9);		
	                 div .html(d.continent + "<br/>"  + d.country +
					"<br/>Editions: " + d.editions + 
					"<br/>Authors: " + d.authors + 
					"<br/>Publishers: " + d.publishers)
                		.style("left", (d3.event.pageX) + "px")		
                		.style("top", (d3.event.pageY - 28) + "px");})
        	.on("mouseout", function(d) {		
            		div.transition()		
                		.duration(500)		
                		.style("opacity", 0);
		});
	//update time label
	d3.select("#tLabel")
		.text(firstYear + time);
	return;
		
}

//console.log("end"); 
