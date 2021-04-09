var red = document.getElementById("color-picker-red");
var green = document.getElementById("color-picker-green");
var blue = document.getElementById("color-picker-blue");
var hexaDisplay = document.getElementById("tag_color");
var render = document.getElementById('color-render');

if(document.getElementById('modals').querySelector('.updateTagModal')){
    hexaDisplay = document.getElementById('update_tag_color');
}

render.style.backgroundColor = `rgb(${red.value}, ${green.value}, ${blue.value})`;
hexaDisplay.value = `#${Number(red.value).toString(16)}${Number(green.value).toString(16)}${Number(blue.value).toString(16)}`;

red.addEventListener('input', function(){
    updateTagValue();
})
green.addEventListener('input', function(){
    updateTagValue();
})
blue.addEventListener('input', function(){
    updateTagValue();
})

function updateTagValue(){
    render.style.backgroundColor = `rgb(${red.value}, ${green.value}, ${blue.value})`;
    
    var redValue = Number(red.value).toString(16);
    var greenValue = Number(green.value).toString(16);
    var blueValue = Number(blue.value).toString(16);
    
    if(redValue.length === 1){
        redValue = redValue.replace(/^/, "0");
    }
    if(greenValue.length === 1){
        greenValue = greenValue.replace(/^/, "0");
    }
    if(blueValue.length === 1){
        blueValue = blueValue.replace(/^/, "0");
    }

    hexaDisplay.value = `#${redValue}${greenValue}${blueValue}`;
}

