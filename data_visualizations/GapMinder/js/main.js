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

// these values are taken manually from the data set
// needs improvement so it can handle a variety of data sets
var time = 0,
	lastYear = 1960,
	firstYear = 1900,
	minEditions = 1,
	maxEditions = 100,
	minPublishers = 1,
	maxPublishers = 60,
	minAuthors = 1,
	maxAuthors = 300;

//set up drop down select 
for(var i=firstYear; i<=lastYear; i++){
    var select = document.getElementById("year");
    var option = document.createElement("OPTION");
	select.options.add(option);
	option
	    .text = i
	    .value = i;
}

// sets up scales
var x = d3.scaleLog()
    .base(10)
    .range([0, width])
    .domain([minAuthors, maxAuthors]);
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([minPublishers, maxPublishers]);
var area = d3.scaleLinear()
    .range([25*Math.PI, 1000*Math.PI])
    .domain([minEditions, maxEditions]);

// set up continent colors
var continents = ["Americas", "Asia", "Europe", "Africa", "Australia"];
var colors = ['#FB1AB3', '#FE8401', '#FED901', '#BA0BFE', '#0B5FFE'];
var continentColor = d3.scaleOrdinal()
    .domain(continents)
    .range(colors);

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

// read data from file
d3.json("data/data.json").then(function(data){
	// clean data, improve by cleaning saved data
	const formattedData = data.map(function(year) {
	  return year["countries"].filter(function(country){
	    // returns only data that has values for every section (no empty values)
	    var dataExists = (country.editions && country.authors && country.publishers);
	    return dataExists;
	  }).map(function(country){
            // change var type to a number
	    country.editions = +country.editions;
	    country.authors = +country.authors;
	    country.publishers = +country.publishers;
	    return country;
          })
	});

	formattedData[0].forEach(function(d) { return data.country; });
        // draw data for first year
	update(formattedData[0], 0);	

	// set speed for update
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
                        interval = (interval+1 - slider.value);
			update(formattedData[0], time*timeInterval);
			return;
        	}
	// draw drop down

        var dropDown = document.getElementById("year");
        
	dropDown.onclick = function(){
       		var year = dropDown.options[dropDown.selectedIndex].value;
                update(formattedData[year-firstYear], time*timeInterval);
		d3.select("#tLabel")
			.text(year);
	}		
        
});

function update(fData, time){
	// update data assigned to circles
	circles = g.selectAll("circle").data(fData, function(d){
		return d.country;
	});
	// draw circles
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
		// tooltip that shows values for each circle when hovered apon
		.on("mouseover", function(d) {
            		div.transition()		
                		.duration(200)		
                		.style("opacity", .9);		
	                 div .html(d.continent + "<br/>"  + d.country +
					"<br/>Editions: " + d.editions + 
					"<br/>Authors: " + d.authors + 
					"<br/>Publishers: " + d.publishers)
                		.style("left", (d3.event.pageX) + "px")		
                		.style("top", (d3.event.pageY - 28) + "px");}) //IMPROVE, loose number
        	.on("mouseout", function(d) {		
            		div.transition()		
                		.duration(500)		
                		.style("opacity", 0);
		});
	// update time label
	d3.select("#tLabel")
		.text(firstYear + time);


	return;
		
}

//console.log("end"); 
