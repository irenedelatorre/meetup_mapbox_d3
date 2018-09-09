// mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaXJlbmVkZWxhdG9ycmUiLCJhIjoiY2psdjI0amR4MG9ybjNrcXg1cWMxaXpldCJ9.p2pLC5jzgpGPQaWGcjlATA'

//setup map
var mapboxMap = new mapboxgl.Map ({
    container: 'map', // id of the div where the map is going to be
    center: [-0.141099, 51.515419], //lonlat of the center of our map
    zoom: 15,
    style: 'mapbox://styles/irenedelatorre/cj3x776uy0w0q2ro1gp3ogtak'
})


// projection function
function projection (lonlat){
    
    var p = mapboxMap.project(new mapboxgl.LngLat(lonlat[0],lonlat[1]));
    
    return [p.x, p.y]
}


// lets draw circles and paths

var points = [
    {x:-0.141905, y: 51.515487}, //oxford circus
    {x:-0.145231, y: 51.516949}
]

var path = [points[0], {x:-0.142699, y: 51.517443}, points[1]]



// create svg
var container = mapboxMap.getCanvasContainer();
var plot = d3.select(container).append("svg");

// draw circles
var circles = plot.selectAll(".points")
    .data(points);

circles.enter()
    .append("circle")
    .attr("class","points")
    .attr("cx",function(d){return projection([d.x,d.y])[0]})
    .attr("cy",function(d){return projection([d.x,d.y])[1]})
    .attr("r",15)
    .style("fill", "#00afff");


// draw lines

var pathLine = d3.line()
    .x(function (d) {
        return projection([d.x,d.y])[0]
    })
    .y(function (d) {
        return projection([d.x,d.y])[1]
    });


plot
    .append("path")
    .attr("d",pathLine(path))
    .style("fill","none")
    .style("stroke-width",2)
    .style("stroke", "#00afff");


// update when map moves

mapboxMap.on("viewreset", update);
mapboxMap.on("moveend", update);

function update(){
    
    plot.selectAll(".points")
        .attr("cx",function(d){return projection([d.x,d.y])[0]})
        .attr("cy",function(d){return projection([d.x,d.y])[1]});
    
    plot.selectAll("path")
        .transition()
        .duration(1000)
        .attr("d",pathLine(path))
    
}










