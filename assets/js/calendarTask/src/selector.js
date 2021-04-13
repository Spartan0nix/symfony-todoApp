const { event } = require("jquery");

document.addEventListener('click', function(event){
    if(event.target.closest('.open-select')){
        toggleOptionsBox(event.target.closest('.select-container'));
    }else if(event.target.closest('.reset-selected')){
        resetSelectedOptions(event.target.closest('.select-container'));
    }else if(event.target.closest('.options-row') && event.target.closest('.select-options')){
        selectElement(event.target.closest('.select-container'),event.target.closest('.options-row'), event);
    }
})


/**
 * Toggle the options box
 * @param {*} container 
 */
function toggleOptionsBox(container){
    container.querySelector(".select-options").classList.toggle("active");
    container.querySelector(".open-select").classList.toggle("rotate");
}

/**
 * Remove all selected options
 * @param {*} container 
 */
function resetSelectedOptions(container){
    container.querySelector('.selected-elements').innerHTML = '';
}

function selectElement(container, element, event){
    event.preventDefault();

    var selectedElement = container.querySelector(".selected-elements");
    var input = element.querySelector("input[type='checkbox']");
    var id = "#"+input.id;

    if(input.checked){
        var elementId = `#element-${id}`;
        var elementClone = container.querySelector(`.selected-elements #element-${id}`).parentNode;
        elementClone.parentNode.removeChild(elementClone);
        input.checked = false;
    }else{
        input.checked = true;
        var elementClone = input.parentNode.cloneNode(true);
        selectedElement.appendChild(elementClone);
        var checkbox = selectedElement.querySelector(id);
        checkbox.parentNode.id = `element-${id}`;
        checkbox.parentNode.removeChild(checkbox)
    }
}