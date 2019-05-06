
var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var renderableHeight, renderableWidth;
var histogram = [];
var topDetectedColors = [];
var adjusted = [];
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
var lumB;
var dMaxSlider = 80, dMinSlider = 15, cSlider = 3;
var imageObj;
var impairment = false;
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
var pick = new ColorPicker(document.querySelector('.color-space'));
function toggleImpairment(){
    if(impairment){
        impairment = false;
        document.getElementById("impairToggle").innerHTML = "Off";
    }else{
        impairment = true;
        document.getElementById("impairToggle").innerHTML = "On";
    }
    if(imageObj){
        imageHistogram( offscreenContext, cSlider, dMinSlider, dMaxSlider);
    }
}
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
    imageHistogram( offscreenContext, cSlider, dMinSlider, dMaxSlider);
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
        imageObj = new Image();
       
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
           
            imageHistogram( offscreenContext, cSlider, dMinSlider, dMaxSlider );
            
           
            
            
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
   // document.getElementById('data').style.opacity = myopacity;
   // document.getElementById('dl').style.opacity = myopacity;
   // document.getElementById('desc').style.opacity = myopacity;
}
//main method for now
function imageHistogram(canvasImg, zC, zD, zDmax){
    document.getElementById('diploma-st-aa').style.display = "none";
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

    iBg.r = Math.abs(255-topDetectedColors[0].r);
    iBg.b = Math.abs(255-topDetectedColors[0].b);
    iBg.g = Math.abs(255-topDetectedColors[0].g);
    
    for(i=0;i<topDetectedColors.length;i++){
    	colorsToChange[topDetectedColors[i].r+"."+topDetectedColors[i].g+"."+topDetectedColors[i].b] = topDetectedColors[i];
    }
    
    changeConstrastImage(zC, zD, zDmax, imgData);
}
var colors=[];
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
    var fgLab;
    if(topDetectedColors[1] != undefined){
        fgLab = rgb2lab(topDetectedColors[1].r,topDetectedColors[1].g,topDetectedColors[1].b);
    }
    
    lumB = getBrightness(topDetectedColors[0].r,topDetectedColors[0].g,topDetectedColors[0].b);
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
                if(!impairment){
                    //comparing similarity with the top 10 colors
                    if( (ciede2000(lab,bgLab) > delta) && (ciede2000(lab,fgLab) < maxDelta) && (desiredContrast > contrast) ) {
                       
                        // if(!impairment){
                            var newRgb = adjustLightness(desiredContrast, lab, lumF, lumB, r, g, b) ;
                        // }else{
                        //     desiredContrast = 1;
                        //     var newRgb = impairmentLightness(desiredContrast, lab, lumF, lumB, r, g, b) ;
                        // }
                        
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
                }else if(impairment){
                    if( (ciede2000(lab,bgLab) > delta) && (ciede2000(lab,fgLab) < maxDelta)  ) {  

                        desiredContrast = cSlider - 1.5;
                        if(desiredContrast < 1){
                            desiredContrast = 1;
                        } 
                        var newRgb = impairmentLightness(desiredContrast, lab, lumF, lumB, r, g, b) ;
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
        
    }
   
    oCtx.putImageData(imgData,rect.x,rect.y);
    adjusted = adjusted.sort(function(a, b) { return b.v - a.v;});

    var div, oldC="", detectedColours=""; var oldColor; document.getElementById("suggestion").innerHTML = ""; 
    var html = "";
    
    var bg = "rgb("+topDetectedColors[0].r+","+topDetectedColors[0].g+","+topDetectedColors[0].b+")";
    var htmlcontrast; 

    document.getElementById("cs").innerHTML = '';
    document.getElementById('message').innerHTML = "";
    pick = new ColorPicker(document.querySelector('.color-space'));
    var h = 50;
    
    pick.plotBg(topDetectedColors[0].r, topDetectedColors[0].g, topDetectedColors[0].b);  
    detectedColours+="<div style='background-color: "+bg+"; height:50px;' onclick='copyRGB(this)' onmouseover='showDetails(this,0)' onmouseout='hideDetails(this)'>BG</div>";
    for(i=1;i<topDetectedColors.length;i++){

        if(i > 5){
            break;
        }
        h = h - (h*0.15);
        pick.plotRgb(topDetectedColors[i].r, topDetectedColors[i].g, topDetectedColors[i].b, i);
        oldColor = topDetectedColors[i].r+","+topDetectedColors[i].g+","+topDetectedColors[i].b;
        
        var c = topDetectedColors[i].r+"."+topDetectedColors[i].g+"."+topDetectedColors[i].b;
        
        if( adjusted[c] != undefined){
            detectedColours+="<div class='detected' style='background-color: rgb("+oldColor+"); height:"+h+"px' onclick='copyRGB(this)' onmouseover='showDetails(this,"+i+")' onmouseout='hideDetails(this)'>"+i+"</div>";
            colors.push(adjusted[c].r+","+adjusted[c].g+","+adjusted[c].b);
          
           
            oldC += "<div class ='changed' style='background-color: rgb("+oldColor+");' onclick='copyRGB(this)' onmouseover='showDetails(this,"+i+")' onmouseout='hideDetails(this)'>"+i+"</div>";    
            
            
            div = "<div class ='changed' style='background-color: rgb("+adjusted[c].r+","+adjusted[c].g+","+adjusted[c].b+");' onclick='copyRGB(this)' onmouseover='showDetails(this,"+i+",a)' onmouseout='hideDetails(this)'>"+i+"</div>";
            html += div;
        
        }
        else{
            var color = "rgb("+Math.abs(topDetectedColors[i].r-255) + "," + Math.abs(topDetectedColors[i].g-255) + "," + Math.abs(topDetectedColors[i].b)-255+")";
            detectedColours+="<div style='background-color: rgb("+oldColor+"); height:"+h+"px' onclick='copyRGB(this)' onmouseover='showDetails(this,"+i+")' onmouseout='hideDetails(this)'>"+i+"</div>";
            div+="<div style='background-color: rgb("+oldColor+");border:3px solid "+bg+";color:"+color+";' onclick='copyRGB(this)'>"+i+"<br><z>✔</z></div>";
            
            // div += "<div style='background-color: rgb("+topDetectedColors[i].r+","+topDetectedColors[i].g+","+topDetectedColors[i].b+");border:3px solid "+bg+";color:"+color+";' onclick='copyRGB(this)'>"+i+"</div>";
        }
    }
    if( html === ""){
        document.getElementById('message').innerHTML = "<p>Contrast requirement is met or no colours within ΔE* range</p>";
    }
   
    document.getElementById('topColours').innerHTML = detectedColours;
    document.getElementById('histogram').innerHTML = oldC;
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

function showDetails(element,i,a){
    var rgb = getComputedStyle(element).getPropertyValue("background-color");
    var bg = "rgb("+topDetectedColors[0].r+", "+topDetectedColors[0].g+", "+topDetectedColors[0].b+")";
    document.getElementById('details').style.display = "block";
    document.getElementById('details').style.zIndex = "99";
    document.getElementById('details').style.background = bg;

    if(i>0){
        var lum = getBrightness(topDetectedColors[i].r, topDetectedColors[i].g, topDetectedColors[i].b);
        var delta = topDetectedColors[i].dE.toFixed(2);
        if(a){
            var c = topDetectedColors[i].r+"."+topDetectedColors[i].g+"."+topDetectedColors[i].b;
            delta = ciede2000( rgb2lab(adjusted[c].r, adjusted[c].g, adjusted[c].b), rgb2lab(topDetectedColors[0].r, topDetectedColors[0].g, topDetectedColors[0].b));
            delta = delta.toFixed(2);
            lum = getBrightness(adjusted[c].r, adjusted[c].g, adjusted[c].b);
        }
        
        var c = getContrast(lum,lumB);
        c = c.toFixed(2);
        var v = topDetectedColors[i].v;
        if(i > 1){
            v = ( v / topDetectedColors[1].v ) * 100;
        }else{
            v = 100;
        }
        var e = document.getElementById("typeSelect").value;
        var element = document.getElementById("details");
        var cssClass="";
        if(e == 1){
            if((c >= 4.5) && (c < 7) ){
                 element.classList.add("aa");
            }else if(c >= 7){
                element.classList.add("aaa");
            }
        }else if(e == 2){
            if((c >= 3) && (c < 4.5) ){
                 element.classList.add("aa");
            }else if(c >= 4.5){
                element.classList.add("aaa");
            }
        }
        if(c < cSlider){
            c = c + " (!)";
        }
        document.getElementById('details').innerHTML += "<div class='info'><p> Colour: "+rgb+"</p><p>Brightness: "+lum.toFixed(2)+"</p><p>Contrast: "+c+"</p><p> ΔE*: "+delta+"</p><p>Instances: "+topDetectedColors[i].v+"</p><p>%: "+v.toFixed(2)+"%</p></div>";
        document.getElementById('details').innerHTML += "<div class='readThis' style='"+bg+";'><p style='font-size:8px;color:"+rgb+"'>Can you read this?</p><p style='color:"+rgb+"'>Can you read this?</p><p style='font-size:30px;color:"+rgb+"'>Can you read this?</p><p style='font-size:40px;color:"+rgb+"'>Can you read this?</p></div>";
    }else{
        document.getElementById('details').innerHTML = "<div class='info'><p><b>Calculated background colour:</b></p><p> Colour: "+rgb+"</p><p>Brightness: "+lumB.toFixed(2)+"</p><p>Instances: "+topDetectedColors[i].v+"</p></div>";
    }
}
function hideDetails(element){

    document.getElementById('details').style.display = "none";
    document.getElementById('details').style.zIndex = "-1";
    document.getElementById('details').innerHTML = "";
    document.getElementById('details').className = "";
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
        }
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
            // if( arr[i].v/mainFgAmount > 0.003){
                
               
                for(j = 0; j < tmp.length; j++){
                    
                    //
                    if( ciede2000(tmpLab, rgb2lab(tmp[j].r, tmp[j].g, tmp[j].b)) < delta){
                        continue mainLoop;
                        
                    }
                }
                tmp.push(arr[i]);    
            // }
            
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


function adjustLightness(c, lab, flum, blum, r, g, b){
    var contrast=0; var count=1;  var brightness, b1, b2;
  
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
        }
        
        b1 = brightness;
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
        
        b2 = brightness;
        l = l + (0.5*count);
        count++;
    }
    if( (brightness / blum) < 0 ){
        return [255,255,255];
    }else{
        return [0,0,0];
    }
    
}
function impairmentLightness(c, lab, flum, blum, r, g, b){
    var contrast=0; var count=1;  var brightness, b1, b2;
  
    var rgb = [r,g,b];
    var lab = rgb2lab(r,g,b);
    var l = lab[0];   
    contrast = getContrast(flum,blum);

    while( (l >= 0) && (l <=100) ){
        // l equals in
        rgb = lab2rgb( [l, lab[1], lab[2] ] );
        brightness = getBrightness(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(brightness,blum);

        if( contrast + 0.2 >= c){
            return rgb;
        }
        
        l = l - (0.5*count);  
        count++;
        if( (flum / blum) < 0 ){
            l = l - (0.5*count);
        }else{
            l = l + (0.5*count);
        }
    }
    
   
    
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

        this.renderColorMap();

        element.appendChild(canvas);

        
    };

    this.renderColorMap = function() {

       
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        var radius = canvas.width / 2;
        var toRad = (2 * Math.PI) / 360;
        var step = 1 / radius;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var cx = cy = radius;
       
        var thickness = 1;
        var x = canvas.width / 2;
        var y = canvas.height / 2;
       
       var gradient;
        for(var angle=0; angle<360; angle+=1){
            var startAngle = (angle-2)*Math.PI/180;
            var endAngle = angle * Math.PI/180;
            var x2 = x + radius * Math.cos(endAngle);
            var y2 = y + radius * Math.sin(endAngle);
            gradient = ctx.createLinearGradient(x, y, x2, y2);
            gradient.addColorStop(0, 'hsl('+angle+', 100%, 100%)');
            gradient.addColorStop(0.1, 'hsl('+angle+', 100%, 90%)');
            gradient.addColorStop(0.2, 'hsl('+angle+', 100%, 80%)');
            gradient.addColorStop(0.3, 'hsl('+angle+', 100%, 70%)');
            gradient.addColorStop(0.4, 'hsl('+angle+', 100%, 60%)');
            gradient.addColorStop(0.5, 'hsl('+angle+', 100%, 50%)');
            gradient.addColorStop(0.6, 'hsl('+angle+', 100%, 40%)');
            gradient.addColorStop(0.7, 'hsl('+angle+', 100%, 30%)');
            gradient.addColorStop(0.8, 'hsl('+angle+', 100%, 20%)');
            // gradient.addColorStop(0.9, 'hsl('+angle+', 100%, 10%)');
            gradient.addColorStop(1, 'hsl('+angle+', 100%, 5%)');
           

            ctx.beginPath();
            ctx.arc(x, y, (1-thickness/2)*radius, startAngle, endAngle, false);
            ctx.lineWidth = radius;
            ctx.strokeStyle = gradient;
            ctx.stroke();

            

        }

    };


    
   
    this.plotBg = function(r, g, b){

        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var hsl = rgbToHsl(r, g, b);

        var r1 = r; var g1=g; var b1=b;
        var l = hsl[2];
       

        // ctx.beginPath();
        // ctx.arc(100,100, 100*(1-l), 0, 2 * Math.PI);
        // ctx.strokeStyle = 'rgb(0,0,0)';
        // ctx.lineWidth = 3;
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.arc(100,100, 100*(1-l), 0, 2 * Math.PI);
        // ctx.strokeStyle = 'rgb(255,255,255)';
        // ctx.lineWidth = 2;
        // ctx.stroke();
    }

   
    this.plotRgb = function(red, g, b, v) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var hsl = rgbToHsl(red, g, b);
       
        var theta = hsl[0] * 2* Math.PI;
        var maxRadius = canvas.width / 2;
        var r = (1 - hsl[2]) * maxRadius;
        var x = r * Math.cos(theta) + maxRadius,
            y = r * Math.sin(theta) + maxRadius;
        
        ctx.fillStyle = 'rgb('+red+','+g+','+b+')';
        ctx.beginPath();
        ctx.arc(x,y, 6, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgb(0,0,0)';
        
        ctx.lineWidth = 1;
        ctx.closePath();
        ctx.fill();
        ctx.font = '10pt Calibri';
        ctx.textAlign = 'center';

        ctx.fillStyle ="rgb(0,0,0)";  
        ctx.fillText(v, x, y+16);
        ctx.stroke();
       
        if(adjusted[red+'.'+g+'.'+b] != undefined){
            hsl = rgbToHsl(adjusted[red+'.'+g+'.'+b].r, adjusted[red+'.'+g+'.'+b].g, adjusted[red+'.'+g+'.'+b].b);
            theta = hsl[0] * 2* Math.PI;
            r = (1 - hsl[2]) * maxRadius;
            var x2 = r * Math.cos(theta) + maxRadius,
            y2 = r * Math.sin(theta) + maxRadius;

            var arrowX = x + 0.75; 
            var arrowTopY = y - 0.707*(0.25);  
            var arrowBottomY = y + 0.707*(0.25); 

            ctx.fillStyle = 'rgb('+adjusted[red+'.'+g+'.'+b].r+', '+adjusted[red+'.'+g+'.'+b].g+', '+adjusted[red+'.'+g+'.'+b].b+')';
            ctx.beginPath();
            ctx.arc(x2,y2, 6, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.lineWidth = 1;
            ctx.closePath();
            ctx.moveTo(x, y); 
            ctx.lineTo(x2, y2); 
            ctx.fill();
            ctx.stroke();
            
            var strokeColor = 'rgb(0,0,0)';
            var PI2 = Math.PI * 2;
            var dx = x2 - x;
            var dy = y2 - y; 
            var radians = (Math.atan2(dy, dx) + PI2) % PI2;
            ctx.save();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.translate(x2, y2);
            ctx.rotate(radians);
            ctx.moveTo(0, 0);
            ctx.lineTo(-8, 4);
            ctx.lineTo(-8, -4);
            ctx.closePath();
            ctx.fillStyle = strokeColor;
            ctx.fill();
            ctx.restore();
            // this.drawArrow(ctx,x,y,x2,y2);
               // console.log(adjusted[red+'.'+g+'.'+b].r); 
        }       
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

var deltaMinMaxSlider = document.getElementById('deltaSliderCombine');

noUiSlider.create(deltaMinMaxSlider, {
    start: [15,80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});

deltaMinMaxSlider.noUiSlider.on('end', function (values, handle) {

    var value = values[handle];
    dMinSlider = Math.round( this.get()[0] );
    dMaxSlider = Math.round( this.get()[1] );
    document.getElementById("deltaControl").innerHTML = "ΔE* range: ["+dMinSlider+", "+dMaxSlider+"]<img class='help' src='q.png' height='14' width='14' onclick='deltaModal.open()'>";
    if(imageObj){
        imageHistogram( offscreenContext, cSlider, dMinSlider, dMaxSlider);
    }  
});
deltaMinMaxSlider.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    dMinSlider = Math.round( this.get()[0] );
    dMaxSlider = Math.round( this.get()[1] );
    document.getElementById("deltaControl").innerHTML = "ΔE* range: ["+dMinSlider+", "+dMaxSlider+"]<img class='help' src='q.png' height='14' width='14' onclick='deltaModal.open()'>";
});
document.getElementById("contrastControl").innerHTML = "Contrast: "+cSlider+"<img class='help' src='q.png' height='14' width='14' onclick='contrastModal.open()'>"; 
document.getElementById("deltaControl").innerHTML = "ΔE* range: ["+dMinSlider+", "+dMaxSlider+"]<img class='help' src='q.png' height='14' width='14' onclick='deltaModal.open()'>"; 

var contrastSlider = document.getElementById('cSlider');

noUiSlider.create(contrastSlider, {
    start: [3],
    connect: true,
    range: {
        'min': 1,
        'max': 20
    }
});

contrastSlider.noUiSlider.on('end', function (values, handle) {
    cSlider = Math.round( this.get() * 10 ) / 10;
    document.getElementById("contrastControl").innerHTML = "Contrast: "+cSlider+"<img class='help' src='q.png' height='14' width='14' onclick='contrastModal.open()'>";
    if(imageObj){
        imageHistogram( offscreenContext, cSlider, dMinSlider, dMaxSlider);
    }
});
contrastSlider.noUiSlider.on('update', function (values, handle) {
    cSlider = Math.round( this.get() * 10 ) / 10;
    document.getElementById("contrastControl").innerHTML = "Contrast: "+cSlider+"<img class='help' src='q.png' height='14' width='14' onclick='contrastModal.open()'>";
});

var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
var analysingModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2']
});

// set content
var analysingContent = '<h1>Analysis target</h1>';
    analysingContent += '<img src="img/analysing.png">';
    analysingContent += '<p>By selecting a target for analysis WCAG2.0 badges will appear while hovering colours in the "Colour analysis" column if they meet the criteria.</p>';
    analysingContent += '<img src="img/hover.png"/>';
    analysingContent += '<img src="img/analysing2.png"/>';
    analysingContent += '<p><a href="https://www.w3.org/TR/WCAG20/#visual-audio-contrast" target="_blank">More information</p>';
analysingModal.setContent(analysingContent);

// add a button
analysingModal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', function() {
    analysingModal.close();
});


// instanciate new deltaModal
var deltaModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2']
});

// set content
var deltaContent = '<h1>ΔE* range</h1>';
    deltaContent += '<img src="img/delta.png">';
    deltaContent += '<p>The ΔE* is the perceptual difference between the background and the foreground colour. The bigger the ΔE* the easier it is for humans to distinguish different colours. Adjust the range to pinpoint the colours you would like to analyze. Adjusting the minimum value will usually suffice.</p>';
    deltaContent += '<p><a href="http://www.colorwiki.com/wiki/Delta_E:_The_Color_Difference" target="_blank">More information</p>';
deltaModal.setContent(deltaContent);

// add a button
deltaModal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', function() {
    deltaModal.close();
});

var contrastModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2']
});

// set content
var contrastContent = '<h1>Contrast adjustments</h1>';
    contrastContent += '<img src="img/contrast.png">';
    contrastContent += '<p>Contrast is the brightness ratio between two colours. Increasing the slider will increase the brightness ratio by making the foreground either darker or brighter.</p>';
    contrastContent += '<p>Contrast is calculated according to <a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html" target="_blank">WCAG2.0</a> standards.</p>';
contrastModal.setContent(contrastContent);

// add a button
contrastModal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', function() {
    contrastModal.close();
});

var analysisModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2']
});

// set content
var analysisModalContent = '<h1>Colour Analysis</h1>';
    analysisModalContent += '<img src="img/analysis-wheel.png">';
    analysisModalContent += '<p>The colour wheel plots colours according to its hue and lightness. The lightness goes from zero at the outer edges to its maximum value in the center. The saturation of the colours is ignored. Black arrows indicate a lightness adjustment inward or outward.</p>';
    analysisModalContent += '<img src="img/histogram-corrections.png">';
    analysisModalContent += '<p>The histogram shows the order of the colours based on occurences in the analyzed image. While the order is true - the scale is not. Lastly, in the left column, the old colours which need correction are listed. To the right are the suggested, corrected colours.</p>';
    analysisModalContent += '<p><b>Hover any of the colours for more information. Clicking any of them will copy its RGB value to the clipboard.</b></p>'
analysisModal.setContent(analysisModalContent);
    analysisModalContent = null;
// add a button
analysisModal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', function() {
    analysisModal.close();
});


/* Mobile check */
var mobModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2']
});

var info = "<p>For the intended experience - use a computer.</p>";
mobModal.setContent('<h1>Mobile browser detected</h1>' + info);
mobModal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', function() {
mobModal.close();

});
window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
if(mobileAndTabletcheck()){
    mobModal.open();
}
