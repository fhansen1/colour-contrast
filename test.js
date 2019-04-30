
var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var renderableHeight, renderableWidth;
var histogram = [];
var topDetectedColors = [];
var start;
var colorsToChange=[];
var alreadyIn=[];
var offScreenCanvas, offscreenContext;
var oCanvas = document.getElementById("oCanvas");
var oCtx = oCanvas.getContext("2d");
var oWidth = oCanvas.width;
var oHeight = oCanvas.height;
var dragok = false;
var myopacity = 0;
var startX;
var startY;
var iBg = {r:0, g:0, b:0};
var rect = {
    x: oWidth/3,
    y: oHeight/3,
    width: oWidth/3,
    height: oHeight/3,
    isDragging: false
};
oCanvas.onmousedown = myDown;
oCanvas.onmouseup = myUp;
oCanvas.onmousemove = myMove;


// redraw the scene
function draw() {
    oCtx.clearRect(0, 0, oWidth, oHeight);
    oCtx.beginPath();
    oCtx.lineWidth = 3;
    oCtx.setLineDash([10, 20]);
    oCtx.strokeStyle = 'rgb('+iBg.r+','+iBg.g+','+iBg.b+')';
    oCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    oCtx.closePath();
    oCtx.fill();
}
// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX);
    var my = parseInt(e.clientY);

    dragok = true;
    rect.isDragging = true;

    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // clear all the dragging flags
    dragok = false;
    rect.isDragging = false;
    imageHistogram( offscreenContext, document.getElementById('contrastSlider').value, document.getElementById('deltaSlider').value, document.getElementById('deltaSliderMax').value );
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt(e.clientX);
        var my = parseInt(e.clientY);
        var collidingX = false;
        var collidingY = false;
        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;
      
        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        if( (rect.x <= 0) || (rect.x >= oWidth - (oWidth/3)) ){
            collidingX = true;
        }
       
        if( (rect.y <= 0) || (rect.y >= oHeight - (oHeight/3)) ){
            collidingY = true;
        }
        
        if (rect.isDragging) {

            if( !collidingX ){
                rect.x += dx;     
            }else{
                if(rect.x <= 0){ rect.x = 1; }
                if(rect.x >= oWidth - (oWidth/3)){ rect.x = rect.x - 1; }
                collidingX = false;
            }

            if( !collidingY ){
                rect.y += dy;   
            }else{
                if(rect.y <= 0){ rect.y = 1; }
                if(rect.y >= oHeight - (oHeight/3) ){ rect.y = rect.y - 1; }
                collidingY = false;
            }
            
        }
       
        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }
}
//starts when image file is added
// https://sdqali.in/blog/2013/10/03/fitting-an-image-in-to-a-canvas-object/
function handleImage(e){
    var reader = new FileReader();
    
    reader.onload = function(event){
        var imageObj = new Image();
       
        imageObj.onload = function(){

            var imageAspectRatio = imageObj.width / imageObj.height;
            var canvasAspectRatio = canvas.width / canvas.height;
            var xStart, yStart;
            offScreenCanvas = document.createElement('canvas');
            offScreenCanvas.width = imageObj.width;
            offScreenCanvas.height = imageObj.height;
            offscreenContext = offScreenCanvas.getContext("2d");
            // If image's aspect ratio is less than canvas's we fit on height
            // and place the image centrally along width
            if(imageAspectRatio < canvasAspectRatio) {
                renderableHeight = canvas.height;
                renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
                xStart = (canvas.width - renderableWidth) / 2;
                yStart = 0;
            }

            // If image's aspect ratio is greater than canvas's we fit on width
            // and place the image centrally along height
            else if(imageAspectRatio > canvasAspectRatio) {
                renderableWidth = canvas.width;
                renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
                xStart = 0;
                yStart = (canvas.height - renderableHeight) / 2;
            }

            // Happy path - keep aspect ratio
            else {
                renderableHeight = canvas.height;
                renderableWidth = canvas.width;
                xStart = 0;
                yStart = 0;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
            
            offscreenContext.clearRect(0, 0, imageObj.width, imageObj.height);
            offscreenContext.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
            document.getElementById("design").setAttribute("style", "display: none;");
            
            fadeOpacity();
            
            imageHistogram( offscreenContext, document.getElementById('contrastSlider').value, document.getElementById('deltaSlider').value, document.getElementById('deltaSliderMax').value );
            
            
        };
        imageObj.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);  
}
function fadeOpacity() {
   if (myopacity<1) {
      myopacity += .075;
     setTimeout(function(){fadeOpacity()},100);
   }
   document.getElementById('data').style.opacity = myopacity;
   document.getElementById('dl').style.opacity = myopacity;
   document.getElementById('desc').style.opacity = myopacity;
}
//main method for now
function imageHistogram(canvasImg, zC, zD, zDmax){
    
    histogram = []; topDetectedColors = []; adjusted=[];
   
    
    var tmpKeys=[]; 
    var red, green, blue, index;
    width = canvas.width; height = canvas.height;
    var count=0;
    

    imgData = ctx.getImageData(rect.x, rect.y, width/3, height/3);
    //loops through the centre of the image
    for (var i = 0; i < imgData.data.length; i+=16) {
            
        var red = imgData.data[i];
        var green = imgData.data[i+1];
        var blue = imgData.data[i+2];
        var alpha = imgData.data[i+3];  
        
        
        //Helper array to make final array indexed
        if( tmpKeys.indexOf(red+"."+green+"."+blue) == -1) {
            tmpKeys.push(red+"."+green+"."+blue);
        }
        index = tmpKeys.indexOf(red+"."+green+"."+blue);

        //Inserting values if new color
        if( !histogram[ index ] ) {
            histogram[ index ] = {
                v: 1, r : red, b : blue, g: green, x: (i / 4) % (width/3), y: Math.floor((i / 4) / (width/3))
            };
               
        }
        //Already exists. Incrementing occurences value 
        else{
            histogram[ index ].v = histogram[ index ].v + 1;   
        }
            
        
    }
    tmpKeys = null;
    
    //sorting by number of occurences (v)
    histogram = histogram.sort(function(a, b) {return b.v - a.v;});
    // histogram = histogram.splice(0,50);
    
    // topDetectedColors = addContrastToArrayData(histogram);
    topDetectedColors = topColours2lab(histogram);
    
    topDetectedColors = trimToDeltaDiff(topDetectedColors);
    
    
    //keeping top 5 foreground colors
    // topDetectedColors = topDistinctColors(topDetectedColors,6);
    topDetectedColors = trimToDeltaDiffFG(topDetectedColors, zD, zDmax);
    console.log(topDetectedColors);
    iBg.r = Math.abs(255-topDetectedColors[0].r);
    iBg.b = Math.abs(255-topDetectedColors[0].b);
    iBg.g = Math.abs(255-topDetectedColors[0].g);
    
    for(i=0;i<topDetectedColors.length;i++){
    	colorsToChange[topDetectedColors[i].r+"."+topDetectedColors[i].g+"."+topDetectedColors[i].b] = topDetectedColors[i];
    }

    changeConstrastImage(zC, zD, zDmax, imgData);
}

function changeConstrastImage(desiredContrast, delta, maxDelta, data){
    draw();
    start = new Date().valueOf();
    adjusted=[];
    var fCanvas = document.createElement('canvas');
    // var fCanvas = document.getElementById('filterCanvas');
    var fCtx = fCanvas.getContext('2d');
    
    var h = data.height, w = data.width;
    fCanvas.height = height / 3;
    fCanvas.width = width / 3;
    //call its drawImage() function passing it the source canvas directly
    fCtx.clearRect(0, 0, canvas.width, canvas.height);
    fCtx.putImageData(data, 0, 0);
    
    var bgLab = rgb2lab(topDetectedColors[0].r,topDetectedColors[0].g,topDetectedColors[0].b);
    var lumB = getBrightness(topDetectedColors[0].r,topDetectedColors[0].g,topDetectedColors[0].b);
    var lumF, contrast, tmpKeys = [];  
    
    for (var i = 0; i < imgData.data.length; i+=4) {

        var r = imgData.data[i];
        var g = imgData.data[i+1];
        var b = imgData.data[i+2];
        var a = imgData.data[i+3];  

        //only for colors != the background color
            if( r+","+b+","+g !== topDetectedColors[0].r+","+topDetectedColors[0].b+","+topDetectedColors[0].g){
            
                var lab = rgb2lab(r,g,b);
                lumF = getBrightness(r,g,b);
                contrast = getContrast(lumF,lumB);
                // console.log(lab);
                //comparing similarity with the top 10 colors
                if( (ciede2000(lab,bgLab) > delta) && (ciede2000(lab,bgLab) < maxDelta) && (desiredContrast > contrast)) {
                   
                    
                    var newRgb = adjustLightness(desiredContrast, lab, lumF, lumB, r, g, b) ;
                    lumF = getBrightness(newRgb[0],newRgb[1],newRgb[2]);
                    
                    var d=[];                        
                    d[0]   = Math.round(newRgb[0]);
                    d[1]   = Math.round(newRgb[1]);
                    d[2]   = Math.round(newRgb[2]);
                    d[3]   = a;
                    
                    imgData.data[i]   = d[0];
                    imgData.data[i+1] = d[1];
                    imgData.data[i+2] = d[2];
                    imgData.data[i+3] = a;
                    
                    //Helper array to make final array indexed
                    if( tmpKeys.indexOf(r+"."+g+"."+b) == -1) {
                        tmpKeys.push(r+"."+g+"."+b);
                    }
                    index = tmpKeys.indexOf(r+"."+g+"."+b);

                    //Inserting values if new color
                    if( !adjusted[ r+"."+g+"."+b ] ) {
                        adjusted[ r+"."+g+"."+b ] = {
                            v: 1, r : d[0], g : d[1], b: d[2], x: 0, y: 0, c: Math.round(getContrast(lumF,lumB)*10) / 10
                        };
                    }
                    //Already exists. Incrementing occurences value 
                    else{
                        adjusted[ r+"."+g+"."+b ].v = adjusted[ r+"."+g+"."+b ].v + 1; 
                    }
                    
                }
        }
        
    }
   
    oCtx.putImageData(imgData,rect.x,rect.y);
    adjusted = adjusted.sort(function(a, b) { return b.v - a.v;});
   
    var div, div2=""; var oldColor; document.getElementById("suggestion").innerHTML = ""; 
    var html = "";
    // html += "<p>Suggested foreground colors</p>";
    // div2 += "<p>Detected foreground colors</p>";
    
    var bg = "rgb("+topDetectedColors[0].r+","+topDetectedColors[0].g+","+topDetectedColors[0].b+")";
    var htmlcontrast; var colors=[];

    document.getElementById("cs").innerHTML = '';

    var pick = new ColorPicker(document.querySelector('.color-space'), topDetectedColors[0].r, topDetectedColors[0].g, topDetectedColors[0].b);

    var m = (10 - i) / 3;
    pick.plotBg(topDetectedColors[0].r, topDetectedColors[0].g, topDetectedColors[0].b, m);  

    for(i=1;i<topDetectedColors.length;i++){

        pick.plotRgb(topDetectedColors[i].r, topDetectedColors[i].g, topDetectedColors[i].b, m);
        oldColor = topDetectedColors[i].r+","+topDetectedColors[i].g+","+topDetectedColors[i].b;
        
        
        var c = topDetectedColors[i].r+"."+topDetectedColors[i].g+"."+topDetectedColors[i].b ;
        
        if( adjusted[c] != undefined){
            div2+="<div style='background-color: rgb("+oldColor+");border:3px solid "+bg+";' onclick='copyRGB(this)'>"+i+"</div>";
            colors.push(adjusted[c].r+","+adjusted[c].g+","+adjusted[c].b);
            div = "<div class ='changed' style='background-color: rgb("+adjusted[c].r+","+adjusted[c].g+","+adjusted[c].b+");border:3px solid "+bg+";' onclick='copyRGB(this)'>"+i+"</div>";
            html += div;
        
        }else{
            var color = "rgb("+Math.abs(topDetectedColors[i].r-255) + "," + Math.abs(topDetectedColors[i].g-255) + "," + Math.abs(topDetectedColors[i].b)-255+")";
            div2+="<div style='background-color: rgb("+oldColor+");border:3px solid "+bg+";color:"+color+";' onclick='copyRGB(this)'>"+i+"<br><z>✔</z></div>";
            
            html += "<div style='background-color: rgb("+topDetectedColors[i].r+","+topDetectedColors[i].g+","+topDetectedColors[i].b+");border:3px solid "+bg+";color:"+color+";' onclick='copyRGB(this)'>"+i+"</div>";
        }
    }

    
    document.getElementById('histogram').innerHTML = div2;
    document.getElementById('suggestion').innerHTML = html;
    var end = new Date().valueOf();

    console.log("bench: "+(end-start) );
    
}
function copyRGB(element) {
    
    var rgbToCopy = getComputedStyle(element).getPropertyValue("background-color");
    document.getElementById("toast").innerHTML = "<p>"+rgbToCopy+" <b>COPIED</b>!</p>";
    var dummy = document.createElement("input");
    var toast = "<textarea>COPIED</textarea>";
    document.body.appendChild(dummy);
    dummy.setAttribute('value', rgbToCopy);
    dummy.select();
    document.execCommand("copy");
    
    document.body.removeChild(dummy);
    setTimeout("document.getElementById('toast').innerHTML = ''", 1300);
   
}

updateContrastSlider(document.getElementById("contrastSlider").value);
updateDeltaSlider(document.getElementById("deltaSlider").value);
updateDeltaSliderMax(document.getElementById("deltaSliderMax").value);

function updateContrastSlider(slideAmount) {
    var sliderDiv = document.getElementById("sliderAmount");
    sliderDiv.innerHTML = "<b>Contrast:</b> "+slideAmount;
    if( (slideAmount >= 3) && (slideAmount < 7) ){
        sliderDiv.innerHTML = "<b>Contrast:</b> "+slideAmount+" <i>AA</i>";
    }
    if(slideAmount >= 7){
        sliderDiv.innerHTML = "<b>Contrast:</b> "+slideAmount+" <i>AAA</i>";
    }
    imageHistogram( offscreenContext, slideAmount, document.getElementById('deltaSlider').value );
}
function updateDeltaSlider(slideDeltaAmount){
    var sliderDiv = document.getElementById("sliderDeltaAmount");
        sliderDiv.innerHTML = "<b>ΔE*:</b> "+slideDeltaAmount;
        imageHistogram( offscreenContext, document.getElementById('contrastSlider').value, slideDeltaAmount, document.getElementById('deltaSliderMax').value);
}
function updateDeltaSliderMax(slideDeltaAmountMax){
    var sliderDiv = document.getElementById("sliderDeltaAmountMax");
        sliderDiv.innerHTML = "<b>max ΔE*:</b> "+slideDeltaAmountMax;
        imageHistogram( offscreenContext, document.getElementById('contrastSlider').value, document.getElementById('deltaSlider').value, slideDeltaAmountMax);
}
var cSlider = document.getElementById("contrastSlider");
var dSlider = document.getElementById("deltaSlider");
var dSliderMax = document.getElementById("deltaSliderMax");
cSlider.oninput = updateContrastValue;
dSlider.oninput = updateDeltaValue;
dSliderMax.oninput = updateDeltaValueMax;
function updateContrastValue(){
    var val = document.getElementById("contrastSlider").value;
    var sliderDiv = document.getElementById("sliderAmount");
    sliderDiv.innerHTML = "<b>Contrast:</b> "+val;
}
function updateDeltaValue(){
    var val = document.getElementById("deltaSlider").value;
    var sliderDiv = document.getElementById("sliderDeltaAmount");
    sliderDiv.innerHTML = "<b>ΔE*:</b> "+val;
}
function updateDeltaValueMax(){
    var val = document.getElementById("deltaSliderMax").value;
    var sliderDiv = document.getElementById("sliderDeltaAmountMax");
    sliderDiv.innerHTML = "<b>max ΔE*:</b> "+val;
}
function download() {
var download = document.getElementById("download");
var image = document.getElementById("oCanvas").toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
download.setAttribute("href", image);
//download.setAttribute("download","archive.png");
}
function topDistinctColors(arr,nr){
    var tmp = [], seen = [], c = 0;

    for(i=0;i<arr.length;i++){
        var lum = getBrightness(arr[i].r, arr[i].g, arr[i].b) + arr[i].r + arr[i].g;
        //rounding to 3 decimals
        lum = Math.round(lum*10) / 10;
        //If a similar luminance has not been seen before
        if( !seen.includes(lum) ){
        	var tmpLab= rgb2lab(arr[i].r,arr[i].g,arr[i].b);
            //It has now been seen. Adding to seen helper array
            seen.push( lum );
            arr[i].lab = tmpLab;
            tmp[c] = arr[i];
            c++;
            // break;
        }
        // for(j=0;j<tmp.length;j++){

        // }
    }
    //Keeping top nr
    tmp = tmp.splice(0,nr);
    return tmp;
}
function trimToDeltaDiff(arr){
    var tmp=[];
    tmp[0]=histogram[0];
    for(i=1;i<arr.length;i++){
        if(arr[i].dE > 3.5){
            tmp.push(histogram[i]);
        }
    }
    return tmp;
}

function trimToDeltaDiffFG(arr, delta, deltaMax){
    // console.log(arr);
    var tmp=[];
    var mainFgLab, tmpLab, tmpLab2, bgLab, mainFgAmount;

    tmp[0]=arr[0]; 
    // tmp[1]=arr[1];
    if(arr[1] != undefined){
        tmp.push(arr[1]);  
        mainFgLab = rgb2lab(arr[1].r, arr[1].g, arr[1].b);  
        mainFgAmount = arr[1].v;
        bgLab = rgb2lab(tmp[0].r, tmp[0].g, tmp[0].b);

    }  
   
    
    //l
    mainLoop:
    for(i = 2; i < arr.length; i++){
       
        tmpLab = rgb2lab(arr[i].r, arr[i].g, arr[i].b);

        //checks if color is within delta limit, background and main foreground colour
        if( (ciede2000(tmpLab, mainFgLab) > delta) && (ciede2000(tmpLab, bgLab) < deltaMax) && (ciede2000(tmpLab, bgLab) > delta)){
            //arbitrary limit to filter out less frequent colours
            if( arr[i].v/mainFgAmount > 0.003){
                
               
                for(j = 0; j < tmp.length; j++){
                    
                    //
                    if( ciede2000(tmpLab, rgb2lab(tmp[j].r, tmp[j].g, tmp[j].b)) < delta){
                        continue mainLoop;
                        
                    }
                }
                tmp.push(arr[i]);    
            }
            
        }
    }
    var test = []; var tmp2 = [];
    outerLoop:
    for(i = 0; i < tmp.length; i++){
        tmpLab = rgb2lab(tmp[i].r, tmp[i].g, tmp[i].b);
        for(j = i+1; j+1 < tmp.length; j++){
        

                tmpLab2 = rgb2lab(tmp[j+1].r, tmp[j+1].g, tmp[j+1].b);
                
                // if(ciede2000(tmpLab, tmpLab2) < 10){
                //     // console.log(tmpLab2);
                //     test.push(j);
                //     tmp = tmp.splice(0, j);
                //     continue outerLoop;
                //     // delete tmp[j];
                //     // tmp = tmp.splice(i, j);
                // }
                
            
            
        }
    }
    // for(i=0; i < test.length; i++){
    //     if(i == 0){
    //         delete tmp[test[i]];
    //     }else if( (i > 0) && (test[i]-1 > 0) ){
    //         delete tmp[test[i]-1];
    //     }
        
    // }
    console.log("test: "+test.length);
//     tmp.sort(function (a, b) {
//     var aSize = b.v;
//     var bSize = a.v;
//     var aLow = b.dE;
//     var bLow = a.dE;
//     // console.log(aLow + " | " + bLow);

//     if(aSize/bSize < 0.7)
//     {
//         return (aLow < bLow) ? -1 : (aLow > bLow) ? 1 : 0;
//     }
//     else
//     {
//         return (aSize < bSize) ? -1 : 1;
//     }
// });
    return tmp;
}

function getContrast(flum,blum){
    var L1 = Math.max(flum,blum);
    var L2 = Math.min(flum,blum);
    var ratio = (L1 + 0.05) / (L2 + 0.05);
    return ratio;
}
function addContrastToArrayData(arr){
	var blum = getBrightness(arr[0].r, arr[0].g, arr[0].b);
	var flum;
	for(i=1; i<arr.length; i++){
		flum = getBrightness(arr[i].r, arr[i].g, arr[i].b);
		arr[i].c = getContrast(flum,blum);
	}
	return arr;
}
function getBrightness(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function adjustL(c, hsl, flum, blum, r, g, b){
    var contrast=0; var count=1;  var brightness;
  
    var rgb = [r,g,b];
    var l = hsl[2];   
	contrast = getContrast(flum,blum);
    
    while( l >= 0 ){
        // l equals in
        rgb = hslToRgb(hsl[0], hsl[1], l );
        brightness = getBrightness(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(brightness,blum);
        if( contrast >= c){
            return rgb;
        }
        

        l = l - (0.00005*count);  
        count++;
    }
    l = hsl[2]; count = 0;
	while( l <= 1 ){
        // l equals in
        rgb = hslToRgb(hsl[0], hsl[1], l );
        brightness = getBrightness(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(brightness,blum);
        if( contrast >= c){
            return rgb;
        }
        // contrast = getContrast(brightness,blum);

        l = l + (0.00005*count);
        count++;
    }
    return rgb;
}

function adjustLightness(c, lab, flum, blum, r, g, b){
    var contrast=0; var count=1;  var brightness;
  
    var rgb = [r,g,b];
    var lab = rgb2lab(r,g,b);
    var l = lab[0];   
    contrast = getContrast(flum,blum);

    while( l >= 0 ){
        // l equals in
        rgb = lab2rgb( [l, lab[1], lab[2] ] );
        brightness = getBrightness(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(brightness,blum);

        if( contrast >= c){
            return rgb;
            // console.log(lab[0]+" "+l);
        }
        

        l = l - (0.5*count);  
        count++;
    }
    l = lab[0]; count = 0;
    while( l <= 100 ){
        // l equals in
        rgb = lab2rgb( [l, lab[1], lab[2] ] );
        brightness = getBrightness(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(brightness,blum);
        if( contrast >= c){
            return rgb;
        }
        // contrast = getContrast(brightness,blum);

        l = l + (0.5*count);
        count++;
    }
    return [0,0,0];
}
function rgb2hsv(r,g,b) 
{
  let v=Math.max(r,g,b), n=v-Math.min(r,g,b);
  let h= n && ((v==r) ? (g-b)/n : ((v==g) ? 2+(b-r)/n : 4+(r-g)/n)); 
  return [60*(h<0?h+6:h), v&&n/v, v];
} 
function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}  
function drawHistogram(ar){
	document.getElementById("histogram").innerHTML = '';
    document.getElementById("histogram").style.background = "rgb("+ar[0].r+", "+ar[0].g+", "+ar[0].b+")";
    var html="<p>Detected color palette</p>";
    var height, div, color;
    for(i=1;i<ar.length;i++){
        color = ar[i].r+", "+ar[i].g+", "+ar[i].b;
        height = (ar[i].v / ar[0].v) * 200;
      
        div = "<div style='background-color: rgb("+color+");'>"+i+"</div>";
        html += div;
    }
    document.getElementById('histogram').innerHTML = html;
}

function topColours2lab(top){
    var bg = rgb2lab(top[0].r,top[0].g,top[0].b);
    for(i=1;i<top.length;i++){
        lab = rgb2lab(top[i].r,top[i].g,top[i].b);
        top[i].dE = ciede2000(bg, lab);
    }
    return top;

}

/*********https://github.com/antimatter15/rgb-lab***************/

function lab2rgb(lab){
	var y = (lab[0] + 16) / 116,
		x = lab[1] / 500 + y,
		z = y - lab[2] / 200,
		r, g, b;

	x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
	y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
	z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);

	r = x *  3.2406 + y * -1.5372 + z * -0.4986;
	g = x * -0.9689 + y *  1.8758 + z *  0.0415;
	b = x *  0.0557 + y * -0.2040 + z *  1.0570;

	r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
	g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
	b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;

	return [Math.max(0, Math.min(1, r)) * 255, 
	      Math.max(0, Math.min(1, g)) * 255, 
	      Math.max(0, Math.min(1, b)) * 255]
}


function rgb2lab(r,g,b){
	var r = r / 255,
	  g = g / 255,
	  b = b / 255,
	  x, y, z;

	r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

	x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
	y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
	z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

	return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

// calculate the perceptual distance between colors in CIELAB
// https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs

function deltaE(labA, labB){
	var deltaL = labA[0] - labB[0];
	var deltaA = labA[1] - labB[1];
	var deltaB = labA[2] - labB[2];
	var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
	var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
	var deltaC = c1 - c2;
	var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
	deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
	var sc = 1.0 + 0.045 * c1;
	var sh = 1.0 + 0.015 * c1;
	var deltaLKlsl = deltaL / (1.0);
	var deltaCkcsc = deltaC / (sc);
	var deltaHkhsh = deltaH / (sh);
	var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
	return i < 0 ? 0 : Math.sqrt(i);
}

function ColorPicker(element,r,g,b) {
    this.element = element;

    this.init = function() {
        var diameter = 200;

        var canvas = document.createElement('canvas');
        canvas.height = diameter;
        canvas.width = diameter,
        this.canvas = canvas;

        this.renderColorMap(r,g,b);

        element.appendChild(canvas);

        
    };

    this.renderColorMap = function(r,g,b) {

        var hsv = rgbToHsv(r, g, b);
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        var radius = canvas.width / 2;
        var toRad = (2 * Math.PI) / 360;
        var step = 1 / radius;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var cx = cy = radius;
       
        var thickness = 0.35;
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var img = new Image();
        img.src = "gradient.png";
        ctx.drawImage(img,0,0,);
        // ctx.fillStyle = 'rgb('+r+', '+g+', '+b+')';
        // ctx.beginPath();
        // ctx.arc(x,y, 50, 0, 2 * Math.PI);
        // ctx.fill();
        
        // for(var angle=0; angle<360; angle+=1){
        //     var startAngle = (angle-2)*Math.PI/180;
        //     var endAngle = angle * Math.PI/180;

        //     ctx.beginPath();
        //     ctx.arc(x, y, (1/5)*radius, startAngle, endAngle, false);
        //     ctx.lineWidth = thickness*radius;
        //     ctx.strokeStyle = 'hsl('+hsv[0]*360+', 50%, '+(angle/360)*100+'%)';
        //     ctx.stroke();

        //     ctx.beginPath();
        //     ctx.arc(x, y, (1-thickness/2)*radius, startAngle, endAngle, false);
        //     ctx.lineWidth = thickness*radius;
        //     ctx.strokeStyle = 'hsl('+angle+', 100%, 50%)';
        //     ctx.stroke();

            

        // }

                // draw saturation gradient
        
        
        // render the rainbow box here ----------
    };

    this.renderMouseCircle = function(x, y, m) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var or = 75;

        
        ctx.beginPath();
        ctx.arc(x,y, 4, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.lineWidth = 1;
        ctx.stroke();
      
    };

    
    function rgbToHsv(r, g, b){
        r = r/255, g = g/255, b = b/255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if(max == min){
            h = 0; // achromatic
        }else{
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, v];
    }
    this.plotBg = function(r, g, b, m){

        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var hsv = rgbToHsv(r, g, b);
        var r1 = r; var g1=g; var b1=b;
        var h = hsv[2];
        var s = 0.45;
        
        var theta =  h * 2 * Math.PI ;
        var maxRadius = canvas.width / 2;
        var r = s * maxRadius;
        var x = r * Math.cos(theta) + maxRadius,
            y = r * Math.sin(theta) + maxRadius;

        this.renderBg(x, y, m, r1,g1,b1); 
    }

    this.renderBg = function(x, y, m, r1,g1,b1) {
      
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var or = 75;
        var ir=Math.abs(255-r1);
        var ig=Math.abs(255-g1);
        var ib=Math.abs(255-b1);
        // console.log('rgb('+r1+', '+ig+', '+ib+')');
        ctx.beginPath();
        ctx.moveTo(or,or);
        ctx.lineTo(x,y);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgb('+ir+', '+ig+', '+ib+')';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(or,or);
        ctx.lineTo(x,y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgb('+r+', '+g+', '+b+')';
        ctx.stroke();

        ctx.fillStyle = 'rgb('+r+', '+g+', '+b+')';
        ctx.beginPath();
        ctx.arc(x,y, 5, 0, 2 * Math.PI);
        ctx.fill();
   
    };

    this.plotRgb = function(r, g, b, m) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var hsv = rgbToHsv(r, g, b);
       
        var h = hsv[0];
        var s = 0.8;
        
        var theta = h * 2* Math.PI;
        var maxRadius = canvas.width / 2;
        var r = s * maxRadius;
        var x = r * Math.cos(theta) + maxRadius,
            y = r * Math.sin(theta) + maxRadius;

        this.renderMouseCircle(x, y, m);        
    }

    this.init();
}


/** https://gist.github.com/mjackson/5311256 **/
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}
function getHue(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h = (max + min) / 2;

  if (max == min) {
    h = 0; // achromatic
  } else {
    var d = max - min;

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return h;
}
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}


var sqrt = Math.sqrt;
var pow = Math.pow;
var cos = Math.cos;
var atan2 = Math.atan2;
var sin = Math.sin;
var abs = Math.abs;
var exp = Math.exp;
var PI = Math.PI;

/**
 * API FUNCTIONS
 */

/**
* Returns diff between c1 and c2 using the CIEDE2000 algorithm
* @param {labcolor} c1    Should have fields L,a,b
* @param {labcolor} c2    Should have fields L,a,b
* @return {float}   Difference between c1 and c2
*/
function ciede2000(c1,c2)
{
  /**
   * Implemented as in "The CIEDE2000 Color-Difference Formula:
   * Implementation Notes, Supplementary Test Data, and Mathematical Observations"
   * by Gaurav Sharma, Wencheng Wu and Edul N. Dalal.
   */

  // Get L,a,b values for color 1
  var L1 = c1[0];
  var a1 = c1[1];
  var b1 = c1[2];

  // Get L,a,b values for color 2
  var L2 = c2[0];
  var a2 = c2[1];
  var b2 = c2[2];
// console.log(L2);
  // Weight factors
  var kL = 1;
  var kC = 1;
  var kH = 1;

  /**
   * Step 1: Calculate C1p, C2p, h1p, h2p
   */
  var C1 = sqrt(pow(a1, 2) + pow(b1, 2)) //(2)
  var C2 = sqrt(pow(a2, 2) + pow(b2, 2)) //(2)

  var a_C1_C2 = (C1+C2)/2.0;             //(3)

  var G = 0.5 * (1 - sqrt(pow(a_C1_C2 , 7.0) /
                          (pow(a_C1_C2, 7.0) + pow(25.0, 7.0)))); //(4)

  var a1p = (1.0 + G) * a1; //(5)
  var a2p = (1.0 + G) * a2; //(5)

  var C1p = sqrt(pow(a1p, 2) + pow(b1, 2)); //(6)
  var C2p = sqrt(pow(a2p, 2) + pow(b2, 2)); //(6)

  var h1p = hp_f(b1, a1p); //(7)
  var h2p = hp_f(b2, a2p); //(7)

  /**
   * Step 2: Calculate dLp, dCp, dHp
   */
  var dLp = L2 - L1; //(8)
  var dCp = C2p - C1p; //(9)

  var dhp = dhp_f(C1,C2, h1p, h2p); //(10)
  var dHp = 2*sqrt(C1p*C2p)*sin(radians(dhp)/2.0); //(11)

  /**
   * Step 3: Calculate CIEDE2000 Color-Difference
   */
  var a_L = (L1 + L2) / 2.0; //(12)
  var a_Cp = (C1p + C2p) / 2.0; //(13)

  var a_hp = a_hp_f(C1,C2,h1p,h2p); //(14)
  var T = 1-0.17*cos(radians(a_hp-30))+0.24*cos(radians(2*a_hp))+
    0.32*cos(radians(3*a_hp+6))-0.20*cos(radians(4*a_hp-63)); //(15)
  var d_ro = 30 * exp(-(pow((a_hp-275)/25,2))); //(16)
  var RC = sqrt((pow(a_Cp, 7.0)) / (pow(a_Cp, 7.0) + pow(25.0, 7.0)));//(17)
  var SL = 1 + ((0.015 * pow(a_L - 50, 2)) /
                sqrt(20 + pow(a_L - 50, 2.0)));//(18)
  var SC = 1 + 0.045 * a_Cp;//(19)
  var SH = 1 + 0.015 * a_Cp * T;//(20)
  var RT = -2 * RC * sin(radians(2 * d_ro));//(21)
  var dE = sqrt(pow(dLp /(SL * kL), 2) + pow(dCp /(SC * kC), 2) +
                pow(dHp /(SH * kH), 2) + RT * (dCp /(SC * kC)) *
                (dHp / (SH * kH))); //(22)
  return dE;
}

/**
 * INTERNAL FUNCTIONS
 */
function degrees(n) { return n*(180/PI); }
function radians(n) { return n*(PI/180); }

function hp_f(x,y) //(7)
{
  if(x === 0 && y === 0) return 0;
  else{
    var tmphp = degrees(atan2(x,y));
    if(tmphp >= 0) return tmphp
    else           return tmphp + 360;
  }
}

function dhp_f(C1, C2, h1p, h2p) //(10)
{
  if(C1*C2 === 0)              return 0;
  else if(abs(h2p-h1p) <= 180) return h2p-h1p;
  else if((h2p-h1p) > 180)     return (h2p-h1p)-360;
  else if((h2p-h1p) < -180)    return (h2p-h1p)+360;
  else                         throw(new Error());
}

function a_hp_f(C1, C2, h1p, h2p) { //(14)
  if(C1*C2 === 0)                                     return h1p+h2p
  else if(abs(h1p-h2p)<= 180)                         return (h1p+h2p)/2.0;
  else if((abs(h1p-h2p) > 180) && ((h1p+h2p) < 360))  return (h1p+h2p+360)/2.0;
  else if((abs(h1p-h2p) > 180) && ((h1p+h2p) >= 360)) return (h1p+h2p-360)/2.0;
  else                                                throw(new Error());
}

