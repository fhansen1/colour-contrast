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
    document.getElementById("deltaControl").innerHTML = "ΔE* range: ["+dMinSlider+", "+dMaxSlider+"]<img class='help' alt='Question mark' src='img/q.png' height='14' width='14' onclick='deltaModal.open()'>";
    if(imageObj){
        imageHistogram( offscreenContext, cSlider, dMinSlider, dMaxSlider);
    }  
});
deltaMinMaxSlider.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    dMinSlider = Math.round( this.get()[0] );
    dMaxSlider = Math.round( this.get()[1] );
    document.getElementById("deltaControl").innerHTML = "ΔE* range: ["+dMinSlider+", "+dMaxSlider+"]<img class='help' alt='Question mark' src='img/q.png' height='14' width='14' onclick='deltaModal.open()'>";
});
document.getElementById("contrastControl").innerHTML = "Contrast: "+cSlider+"<img class='help' alt='Question mark' src='img/q.png' height='14' width='14' onclick='contrastModal.open()'>"; 
document.getElementById("deltaControl").innerHTML = "ΔE* range: ["+dMinSlider+", "+dMaxSlider+"]<img class='help' alt='Question mark' src='img/q.png' height='14' width='14' onclick='deltaModal.open()'>"; 

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
    document.getElementById("contrastControl").innerHTML = "Contrast: "+cSlider+"<img class='help' alt='Question mark' src='img/q.png' height='14' width='14' onclick='contrastModal.open()'>";
    if(imageObj){
        imageHistogram( offscreenContext, cSlider, dMinSlider, dMaxSlider);
    }
});
contrastSlider.noUiSlider.on('update', function (values, handle) {
    cSlider = Math.round( this.get() * 10 ) / 10;
    document.getElementById("contrastControl").innerHTML = "Contrast: "+cSlider+"<img class='help' alt='Question mark' src='img/q.png' height='14' width='14' onclick='contrastModal.open()'>";
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
    analysingContent += '<img src="img/analysing.png" alt="Select box example"/>';
    analysingContent += '<p>By selecting a target for analysis WCAG2.0 badges will appear while hovering colours in the "Colour analysis" column if they meet the criteria.</p>';
    analysingContent += '<img src="img/analysing2.png" alt="Calculated colour information example" />';
    analysingContent += '<img src="img/hover.png" alt="Pointer hovering calculated colour"/>';
    analysingContent += '<p><a href="https://www.w3.org/TR/WCAG20/#visual-audio-contrast" target="_blank">More information</p>';
analysingModal.setContent(analysingContent);

// add a button
analysingModal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', function() {
    analysingModal.close();
});

// instanciate new deltaModal
var startModal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2']
});

// set content
var startContent = '<h1>Introduction</h1>';
    startContent += '<img src="img/text.png" alt="Examples of different sizes of text on different colours"/>';
    startContent += '<p>In order for designs to be accessible for most people multiple factors must be taken into account. An important factor in accessibility is <b>contrast</b>.</p>';
    startContent += '<p>This tool attempts to make contrast easy by visualising suggested changes in real-time and making the new colour values readily available.</p>';
    startContent += '<p><b>Click the <img class="help" src="img/q.png" height="14" width="14">-marks for guidance.</b></p>';
    startContent += '<p><a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html" target="_blank">Read more about the WCAG2.0 guidelines</p>';
startModal.setContent(startContent);

// add a button
startModal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', function() {
    startModal.close();
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
    deltaContent += '<img src="img/delta.png" alt="Delta range slider example"/>';
    deltaContent += '<p>The ΔE* is the perceptual difference between the background and the foreground colour. The bigger the ΔE* the easier it is for humans to distinguish different colours. Adjust the range to pinpoint the colours you would like to analyze. Adjusting the minimum value will usually suffice.</p>';
    deltaContent += '<p>The ΔE* in this application is the perceptual difference between the detected background and current foreground colours.';
    deltaContent += '<p><b>Note: Only colours within the ΔE* range will be considered.</b></p>';
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
    contrastContent += '<img src="img/contrast.png" alt="Contrast slider example"/>';
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
    analysisModalContent += '<img src="img/analysis-wheel.png" alt="Colour circle with plotted, detected colours with hue"/>';
    analysisModalContent += '<img src="img/analysis-wheel-desat.png" alt="Colour circle with plotted, detected colours with hue"/>';
    analysisModalContent += '<p>The colour circle plots colours according to its hue and lightness. The lightness goes from zero at the outer edges to its maximum value in the center. The saturation of the colours is ignored. Black arrows indicate a lightness adjustment inward or outward.</p>';
    analysisModalContent += '<p><b>Click the colour circle to toggle between hue/lightness and saturation/lightness.</b></p>';
    analysisModalContent += '<img src="img/histogram-corrections.png" alt="Histogram of detected colours. Colours with too little and their corrections is also shown."/>';
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
