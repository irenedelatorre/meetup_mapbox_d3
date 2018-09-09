
var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();


// mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaXJlbmVkZWxhdG9ycmUiLCJhIjoiY2psdjI0amR4MG9ybjNrcXg1cWMxaXpldCJ9.p2pLC5jzgpGPQaWGcjlATA';

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
    {x:-0.141905, y: 51.515487, t: 0}, //oxford circus
    {x:-0.145231, y: 51.516949, t: 20}
]

var path = [points[0], {x:-0.142699, y: 51.517443, t:10}, points[1]];


// animation data

var animation = [];


for (var i=0; i<21; i++){
    
    var point;
    
    if (i!==0 || i!==10 || i != 20){
       if (i<10){
           
           var scaleX = d3.scaleLinear().domain([path[0].t, path[1].t]).range([path[0].x, path[1].x]);
           var scaleY = d3.scaleLinear().domain([path[0].t, path[1].t]).range([path[0].y, path[1].y]);
           
           point = {
               x: scaleX(i),
               y: scaleY(i),
               t: i
           }
       } else{
           
           var scaleX = d3.scaleLinear().domain([path[1].t, path[2].t]).range([path[1].x, path[2].x]);
           var scaleY = d3.scaleLinear().domain([path[1].t, path[2].t]).range([path[1].y, path[2].y]);
           point = {
               x: scaleX(i),
               y: scaleY(i),
               t: i
           }
       }
    }else{
        if (i === 0){
            point = path[0];
        }else if (i === 10){
            point = path[1];
        }else if (i === 20){
            point = path[2];
        }
    }
    
   animation.push(point)
    
}





// create container
var container = mapboxMap.getCanvasContainer();

// get width and height of map div
var width = d3.select('#map').node().clientWidth,
    height = d3.select('#map').node().clientHeight;

// create canvas
d3.select(container).append("div").attr("id", "animation");

var canvas = d3.select("#animation").append("canvas").attr("id", "dots-moving").node();

canvas.width = 2 * width; // it gives better quality to the drawing
canvas.height = 2 * height;

var ctxPLOT = canvas.getContext("2d");


// animation settings
var t = 0; // starting time
var speed = 0.5; // animation speed
var color = '#00afff';

ctxPLOT.globalCompositeOperation = 'normal';
ctxPLOT.imageSmoothingEnabled = false;
ctxPLOT.globalAlpha = 1;
ctxPLOT.scale(2,2);

var pathLine = d3.line()
    .x(function (d) {
        return projection([d.x,d.y])[0]
    })
    .y(function (d) {
        return projection([d.x,d.y])[1]
    })
    .context(ctxPLOT);

window.requestAnimationFrame(draw);

function draw (){
    
    ctxPLOT.clearRect(0, 0, width, height);
    
    // select point in time
    var drawPoint = animation.filter(function(d){return d.t >= t && d.t<= t+speed});
    var drawLine = animation.filter(function(d){return d.t < t});
    
    // line of past points
    ctxPLOT.globalAlpha = 1;
    ctxPLOT.beginPath();
    pathLine(drawLine);
    ctxPLOT.lineWidth = 2;
    ctxPLOT.strokeStyle = color;
    ctxPLOT.stroke();
    ctxPLOT.globalAlpha = 1;
    
    // last position
    var xy = projection([drawPoint[0].x,drawPoint[0].y]);
    
    ctxPLOT.fillStyle = color;
    ctxPLOT.beginPath();
    ctxPLOT.arc(xy[0], xy[1], 5, 0,2*Math.PI);
    ctxPLOT.fill();
    ctxPLOT.closePath();
    
    points.forEach(function(d){
        var xyCircle = projection([d.x,d.y]);
    
        ctxPLOT.fillStyle = "rgba(255,255,255,0)";
        ctxPLOT.strokeStyle = "black";
        ctxPLOT.lineWidth = 3;
        ctxPLOT.beginPath();
        ctxPLOT.arc(xyCircle[0], xyCircle[1], 15, 0,2*Math.PI);
        ctxPLOT.stroke();
        ctxPLOT.closePath();
    })
    
    
    if (t<20){
        t = t + speed;
    }else{
        t = 0
    }
    
    window.requestAnimationFrame(draw);

}












