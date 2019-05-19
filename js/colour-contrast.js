
var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', loadImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var renderableHeight, renderableWidth;
var topDetectedColours = [];
var adjusted = [];
var start;

var oCanvas = document.getElementById("oCanvas");
var oCtx = oCanvas.getContext("2d");
var oWidth = oCanvas.width;
var oHeight = oCanvas.height;
var okToMove = false;
var myopacity = 0;
var startX;
var startY;
var lumB;
var dMaxSlider = 80, dMinSlider = 15, cSlider = 3;
var imageObj;
var impairment = false; var saturation = true;

var rect = {
    x: oWidth/3,
    y: oHeight/3,
    width: oWidth/3,
    height: oHeight/3
};
oCanvas.onmousedown = mouseDown;
oCanvas.onmouseup = mouseUp;
oCanvas.onmousemove = mouseMove;

var pick = new ColourCircle(document.querySelector('.color-space'));
reDraw();
function toggleImpairment(){
    if(impairment){
        impairment = false;
        document.getElementById("impairToggle").innerHTML = "Off";
    }else{
        impairment = true;
        document.getElementById("impairToggle").innerHTML = "On";
    }
    if(imageObj){
        imageHistogram();
    }
}
function toggleSaturation(){
    if(saturation){
        saturation = false;
        pick = new ColourCircle(document.querySelector('.color-space'));
    }else{
        saturation = true;
        pick = new ColourCircle(document.querySelector('.color-space'));
    }
    for(i=1;i<topDetectedColours.length;i++){

        if(i > 5){
            break;
        }
        pick.plotRgb(topDetectedColours[i].r, topDetectedColours[i].g, topDetectedColours[i].b, i);
    }
}
// redraw the scene
function reDraw() {
    oCtx.clearRect(0, 0, oWidth, oHeight);
    oCtx.beginPath();
    oCtx.lineWidth = 8;
    oCtx.strokeStyle = "white";
    oCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    oCtx.closePath();
    oCtx.stroke();

    oCtx.beginPath();
    oCtx.lineWidth = 4;
    oCtx.strokeStyle = "black";
    oCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    oCtx.closePath();
    oCtx.stroke();

}

function mouseDown(e) {

    e.preventDefault();
    e.stopPropagation();

    var mx = parseInt(e.clientX);
    var my = parseInt(e.clientY);

    okToMove = true;

    startX = mx;
    startY = my;
}


function mouseUp(e) {  
   
    e.preventDefault();
    e.stopPropagation();
    okToMove = false;
    imageHistogram();
}


function mouseMove(e) {
    // if we're dragging anything...
    if (okToMove) {

        e.preventDefault();
        e.stopPropagation();

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
        if (okToMove) {

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
        reDraw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }
}
//starts when image file is added
// https://sdqali.in/blog/2013/10/03/fitting-an-image-in-to-a-canvas-object/
function loadImage(e){
    var reader = new FileReader();
    
    reader.onload = function(event){
        imageObj = new Image();
       
        imageObj.onload = function(){

            var imageAspectRatio = imageObj.width / imageObj.height;
            var canvasAspectRatio = canvas.width / canvas.height;
            var xStart, yStart;
        
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

            document.getElementById("design").setAttribute("style", "display: none;");
            
            fadeOpacity();
            imageHistogram();
            
        };
        imageObj.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);  
}
function fadeOpacity() {
    document.getElementById('dl').style.display = "block";
   if (myopacity<1) {
      myopacity += .075;
     setTimeout(function(){fadeOpacity()},100);
   }
   document.getElementById('dl').style.opacity = myopacity;
}
//main method for now
function imageHistogram(){
    start = new Date().valueOf();
    topDetectedColours = []; 
    var tmpKeys=[]; 
    var r, g, b, a, index;
    var width = canvas.width; var height = canvas.height;
    var imgData = ctx.getImageData(rect.x, rect.y, width/3, height/3);
    
    //loops through the centre of the image
    for (var i = 0; i < imgData.data.length; i+=16) {
            
        r = imgData.data[i];
        g = imgData.data[i+1];
        b = imgData.data[i+2];
        a = imgData.data[i+3];  
        
        //Helper array to make final array indexed
        if( tmpKeys.indexOf(r+"."+g+"."+b) == -1) {
            tmpKeys.push(r+"."+g+"."+b);
        }
        index = tmpKeys.indexOf(r+"."+g+"."+b);

        //Inserting values if new color
        if( !topDetectedColours[ index ] ) {

            topDetectedColours[ index ] = {
                v: 1, r : r, b : b, g: g
            };
               
        }
        //Already exists. Incrementing occurences value 
        else{
            topDetectedColours[ index ].v = topDetectedColours[ index ].v + 1;   
        }  
    }
   
    //sorting by number of occurences (v)
    topDetectedColours = topDetectedColours.sort(function(a, b) {return b.v - a.v;});
    
    //filters<
    topDetectedColours = topColoursAddDelta(topDetectedColours);
    topDetectedColours = trimToDeltaDiff(topDetectedColours);
    topDetectedColours = trimToDeltaDiffFG(topDetectedColours);

    changeConstrastImage(imgData);
}

function changeConstrastImage(imgData){

    var r, g, b, a, lumF, contrast, tmpKeys = [];
    var bgLab = rgb2lab(topDetectedColours[0].r,topDetectedColours[0].g,topDetectedColours[0].b); 
    lumB = getRelLuminance(topDetectedColours[0].r,topDetectedColours[0].g,topDetectedColours[0].b);
    adjusted=[];

    for (var i = 0; i < imgData.data.length; i+=4) {

        r = imgData.data[i];
        g = imgData.data[i+1];
        b = imgData.data[i+2];
        a = imgData.data[i+3];  

        //only for colors != the background color
        if( r+","+b+","+g !== topDetectedColours[0].r+","+topDetectedColours[0].b+","+topDetectedColours[0].g){
        
            var lab = rgb2lab(r,g,b);
            lumF = getRelLuminance(r,g,b);
            contrast = getContrast(lumF,lumB);

            //if within delta values and contrast is less than slider value
            if( (ciede2000(lab,bgLab) > dMinSlider) && (ciede2000(lab,bgLab) < dMaxSlider) && (cSlider > contrast) ) {
               
                if(!impairment){
                    var newRgb = adjustLightness(cSlider, lab, lumB, r, g, b);
                }else{
                    var newRgb = impairmentLightness(cSlider, lab, lumB, r, g, b) ;
                }
                lumF = getRelLuminance(newRgb[0],newRgb[1],newRgb[2]);
                var d = [ Math.round(newRgb[0]), Math.round(newRgb[1]), Math.round(newRgb[2]), a ];                        
                
                imgData.data[i]   = d[0];
                imgData.data[i+1] = d[1];
                imgData.data[i+2] = d[2];
                imgData.data[i+3] = d[3];
                
                //Helper array to make final array indexed
                if( tmpKeys.indexOf(r+"."+g+"."+b) == -1) {
                    tmpKeys.push(r+"."+g+"."+b);
                }
                index = tmpKeys.indexOf(r+"."+g+"."+b);

                //Inserting values if new color
                if( !adjusted[ r+"."+g+"."+b ] ) {
                    adjusted[ r+"."+g+"."+b ] = {
                        v: 1, r : d[0], g : d[1], b: d[2], c: Math.round(getContrast(lumF,lumB)*10) / 10
                    };
                }
                //Already exists. Incrementing occurences value 
                else{
                    adjusted[ r+"."+g+"."+b ].v = adjusted[ r+"."+g+"."+b ].v + 1; 
                }
                
            }
                
        }
        
    }
   
    drawAnalysis(imgData);
    
}
function drawAnalysis(imgData){

    oCtx.putImageData(imgData,rect.x,rect.y);

    var oldColour, h=50, e=0; 
    var bg = "rgb("+topDetectedColours[0].r+","+topDetectedColours[0].g+","+topDetectedColours[0].b+")";
    var needCorrectionHtml="", suggestedHtml = ""
    var detectedColours="<div style='background-color: "+bg+"; height:50px;' onclick='copyRGB(this)' onmouseover='showDetails(this,0)' onmouseout='hideDetails(this)'>BG</div>";

    document.getElementById('message').innerHTML = "";
    pick = new ColourCircle(document.querySelector('.color-space'));
    
    for(i=1; (i<topDetectedColours.length) && (i<=5);i++){

        h = h - (h*0.15);
        pick.plotRgb(topDetectedColours[i].r, topDetectedColours[i].g, topDetectedColours[i].b, i);
        oldColour = topDetectedColours[i].r+","+topDetectedColours[i].g+","+topDetectedColours[i].b;
        
        var c = topDetectedColours[i].r+"."+topDetectedColours[i].g+"."+topDetectedColours[i].b;
        detectedColours+="<div class='detected' style='background-color: rgb("+oldColour+"); height:"+h+"px' onclick='copyRGB(this)' onmouseover='showDetails(this,"+i+")' onmouseout='hideDetails(this)'>"+i+"</div>"; 
        if( adjusted[c] != undefined){
              
            needCorrectionHtml += "<div class ='changed' style='background-color: rgb("+oldColour+");' onclick='copyRGB(this)' onmouseover='showDetails(this,"+i+")' onmouseout='hideDetails(this)'>"+i+"</div>";    
            suggestedHtml += "<div class ='changed' style='background-color: rgb("+adjusted[c].r+","+adjusted[c].g+","+adjusted[c].b+");' onclick='copyRGB(this)' onmouseover='showDetails(this,"+i+",a,b)' onmouseout='hideDetails(this)'>"+i+"</div>";
            e++;
        }
    }

    document.getElementById('topColours').innerHTML = detectedColours;      //Horiztonal histogram
    document.getElementById('histogram').innerHTML = needCorrectionHtml;    //Colours that need to change
    document.getElementById('suggestion').innerHTML = suggestedHtml;        //Changed colours
    document.getElementById('corrections').style.height = e*38+"px";

    if( suggestedHtml === ""){
        document.getElementById('message').innerHTML = "<p>Contrast requirement is met or no colours within ΔE* range</p>";
    }
    var end = new Date().valueOf();
    document.getElementById("toast").innerHTML = "<p>"+(end-start)+" ms</p>";
    setTimeout("document.getElementById('toast').innerHTML = ''", 1300);
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

function showDetails(element,i,a,b){
    var rgb = getComputedStyle(element).getPropertyValue("background-color");
    var bg = "rgb("+topDetectedColours[0].r+", "+topDetectedColours[0].g+", "+topDetectedColours[0].b+")";
    document.getElementById('details').style.display = "block";
    document.getElementById('details').style.zIndex = "99";
    document.getElementById('details').style.background = bg;

    if(i>0){
        var lum = getRelLuminance(topDetectedColours[i].r, topDetectedColours[i].g, topDetectedColours[i].b);
        var delta = topDetectedColours[i].dE.toFixed(2);
        if(a){
            var c = topDetectedColours[i].r+"."+topDetectedColours[i].g+"."+topDetectedColours[i].b;
            delta = ciede2000( rgb2lab(adjusted[c].r, adjusted[c].g, adjusted[c].b), rgb2lab(topDetectedColours[0].r, topDetectedColours[0].g, topDetectedColours[0].b));
            delta = delta.toFixed(2);
            lum = getRelLuminance(adjusted[c].r, adjusted[c].g, adjusted[c].b);
        }

        var c = getContrast(lum,lumB);
        c = c.toFixed(2);
        var v = topDetectedColours[i].v;
        if(i > 1){
            v = ( v / topDetectedColours[1].v ) * 100;
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
        else if(e == 3){
            if((c >= 3) && (c < 4.5) ){
                 element.classList.add("aa");
            }else if(c >= 4.5){
                element.classList.add("aaa");
            }
        }
        if(c < cSlider){
            if(b && !impairment){
                c = c + " (maxed out)";
            }else{
                c = c + " (!)";   
            }
            
        }
        document.getElementById('details').innerHTML += "<div class='info'><p> Colour: "+rgb+"</p><p>Brightness: "+lum.toFixed(2)+"</p><p>Contrast: "+c+"</p><p> ΔE*: "+delta+"</p><p>Instances: "+topDetectedColours[i].v+"</p><p>this/top FG: "+v.toFixed(2)+"%</p></div>";
        document.getElementById('details').innerHTML += "<div class='readThis' style='"+bg+";'><p style='font-size:8px;color:"+rgb+"'>Can you read this?</p><p style='color:"+rgb+"'>Can you read this?</p><p style='font-size:30px;color:"+rgb+"'>Can you read this?</p><p style='font-size:40px;color:"+rgb+"'>Can you read this?</p></div>";
    }else{
        document.getElementById('details').innerHTML = "<div class='info'><p><b>Calculated background colour:</b></p><p> Colour: "+rgb+"</p><p>Brightness: "+lumB.toFixed(2)+"</p><p>Instances: "+topDetectedColours[i].v+"</p></div>";
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
}

function topColoursAddDelta(top){
    var bg = rgb2lab(top[0].r,top[0].g,top[0].b);
    for(i=1;i<top.length;i++){
        lab = rgb2lab(top[i].r,top[i].g,top[i].b);
        top[i].dE = ciede2000(bg, lab);
    }
    return top;
}
function trimToDeltaDiff(arr){
    var tmp=[];
    tmp[0]=topDetectedColours[0];
    for(i=1;i<arr.length;i++){
        if(arr[i].dE >= 3){
            tmp.push(topDetectedColours[i]);
        }
    }
    return tmp;
}

function trimToDeltaDiffFG(arr){

    var tmp=[];
    var mainFgLab, tmpLab, tmpLab2, bgLab, mainFgAmount;

    tmp[0]=arr[0]; 

    if(arr[1] != undefined){
        tmp.push(arr[1]);  
        mainFgLab = rgb2lab(arr[1].r, arr[1].g, arr[1].b);  
        mainFgAmount = arr[1].v;
        bgLab = rgb2lab(tmp[0].r, tmp[0].g, tmp[0].b);
    }  
    
    mainLoop:
    for(i = 1; i+1 < arr.length; i++){

        tmpLab = rgb2lab(arr[i].r, arr[i].g, arr[i].b); 
 
        // checks if color is within delta limit, background and main foreground colour
        if( (ciede2000(tmpLab, mainFgLab) > dMinSlider) && (ciede2000(tmpLab, bgLab) < dMaxSlider) && (ciede2000(tmpLab, bgLab) > dMinSlider)){
    
                for(j = 0; j < tmp.length; j++){
                    if( ciede2000(tmpLab, rgb2lab(tmp[j].r, tmp[j].g, tmp[j].b)) < dMinSlider){
                        continue mainLoop;
                    }
                }
                tmp.push(arr[i]);    
        }
    }
    tmp = tmp.slice(0,6);
    return tmp;
}

function getContrast(flum,blum){
    var L1 = Math.max(flum,blum);
    var L2 = Math.min(flum,blum);
    var ratio = (L1 + 0.05) / (L2 + 0.05);
    return ratio;
}

function getRelLuminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}


function adjustLightness(c, lab, blum, r, g, b){
    
    var rgb, relLum, b1, b2;
    var contrast=0, count=1, l = lab[0];   

    while( l >= 0 ){
        // l equals in
        rgb = lab2rgb( [l, lab[1], lab[2] ] );
        relLum = getRelLuminance(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(relLum,blum);

        if( contrast >= c){
            return rgb;
        }
        
        b1 = relLum;
        l = l - (0.5*count);  
        count++;
    }
    l = lab[0]; count = 1;

    while( l <= 100 ){
        // l equals in
        rgb = lab2rgb( [l, lab[1], lab[2] ] );
        relLum = getRelLuminance(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(relLum,blum);
        if( contrast >= c){
            return rgb;
        }
        
        b2 = relLum;
        l = l + (0.5*count);
        count++;
    }
    
    if(  Math.abs(b2-blum) > Math.abs(b1-blum) ){
        return [255,255,255];
    }else{
        return [0,0,0];
    }
    
}
function impairmentLightness(c, lab, blum, r, g, b){
    var rgb, relLum, b1, b2;
    var contrast=0, count=1, l = lab[0];   

    while( l >= 0 ){
        // l equals in
        rgb = lab2rgb( [l, lab[1], lab[2] ] );
        relLum = getRelLuminance(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(relLum,blum);

        if( contrast*1.7 >= c){
            return rgb;
        }
        
        b1 = relLum;
        l = l - (0.5*count);  
        count++;
    }
    l = lab[0]; count = 1;

    while( l <= 100 ){
        // l equals in
        rgb = lab2rgb( [l, lab[1], lab[2] ] );
        relLum = getRelLuminance(rgb[0], rgb[1], rgb[2]);
        contrast = getContrast(relLum,blum);
        if( contrast*1.7 >= c){
            return rgb;
        }
        
        b2 = relLum;
        l = l + (0.5*count);
        count++;
    }
    
    if(  Math.abs(b2-blum) > Math.abs(b1-blum) ){
        return [255,255,255];
    }else{
        return [0,0,0];
    }
    
}

function ColourCircle(element,r,g,b) {

    document.getElementById("cs").innerHTML = '';
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
        var sat;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var cx = cy = radius;
       
        var thickness = 1;
        var x = canvas.width / 2;
        var y = canvas.height / 2;
       
        var gradient;
        if(saturation){
            sat = "100%";
        }else{
            sat = "0%";
        }
        for(var angle=0; angle<360; angle+=1){
            var startAngle = (angle-2)*Math.PI/180;
            var endAngle = angle * Math.PI/180;
            var x2 = x + radius * Math.cos(endAngle);
            var y2 = y + radius * Math.sin(endAngle);
            gradient = ctx.createLinearGradient(x, y, x2, y2);
            gradient.addColorStop(0  , 'hsl('+angle+', '+sat+', 100%)');
            gradient.addColorStop(0.1, 'hsl('+angle+', '+sat+', 90%)');
            gradient.addColorStop(0.2, 'hsl('+angle+', '+sat+', 80%)');
            gradient.addColorStop(0.3, 'hsl('+angle+', '+sat+', 70%)');
            gradient.addColorStop(0.4, 'hsl('+angle+', '+sat+', 60%)');
            gradient.addColorStop(0.5, 'hsl('+angle+', '+sat+', 50%)');
            gradient.addColorStop(0.6, 'hsl('+angle+', '+sat+', 40%)');
            gradient.addColorStop(0.7, 'hsl('+angle+', '+sat+', 30%)');
            gradient.addColorStop(0.8, 'hsl('+angle+', '+sat+', 20%)');
            gradient.addColorStop(1, 'hsl('+angle+', '+sat+', 5%)');
           
            ctx.beginPath();
            ctx.arc(x, y, (1-thickness/2)*radius, startAngle, endAngle, false);
            ctx.lineWidth = radius;
            ctx.strokeStyle = gradient;
            ctx.stroke();
        }

    };

    this.plotRgb = function(red, g, b, v) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
       
        var hsl = rgbToHsl(red, g, b);
        var rgb = [red,g,b];

        var theta = hsl[0] * 2* Math.PI;
        var maxRadius = canvas.width / 2;
        var r = (1 - hsl[2]) * maxRadius;
        var x = r * Math.cos(theta) + maxRadius,
            y = r * Math.sin(theta) + maxRadius;
       
        if(!saturation){
            rgb = hslToRgb(hsl[0],0,hsl[2]);
        }
        
        ctx.fillStyle = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
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

            if(!saturation){
                rgb = hslToRgb(hsl[0],0,hsl[2]);
            }else{
                rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
            }

            ctx.fillStyle = 'rgb('+rgb[0]+', '+rgb[1]+', '+rgb[2]+')';
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
        } 
              
    }

    this.init();
}


