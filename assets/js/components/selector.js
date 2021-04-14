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
    var checkIcon = element.querySelector('.check');
    var id = input.id;
    console.log(element)

    if(input.checked){
        var elementClone = selectedElement.querySelector(`#element_${id}`);
        elementClone.parentNode.removeChild(elementClone);
        input.checked = false;
        checkIcon.innerHTML = "";
    }else{
        input.checked = true;
        var elementContent = element.querySelector('label').innerHTML;
        var elementColor = element.querySelector('.element').style.backgroundColor;
        var newElement = document.createElement("span");
        var newElementContent = document.createTextNode(elementContent);

        checkIcon.innerHTML += '<i class="fa fa-check" aria-hidden="true"></i>';

        newElement.appendChild(newElementContent);
        newElement.id = `element_${id}`;
        newElement.classList.add('element');
        newElement.style.backgroundColor = elementColor;
        selectedElement.appendChild(newElement);
    }
}