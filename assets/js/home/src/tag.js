/*----------------------------------------------------------------------------------------------*/
/*    EventListener for tags interactions                                                       */
/*----------------------------------------------------------------------------------------------*/
if(document.querySelector('.addRowModal')){
    const addRowModal = document.querySelector('.addRowModal');
    const AddRowSelectContainer = addRowModal.querySelector('.select-container');
    // Automatically change tag background color for addModal Tag
    AddRowSelectContainer.querySelectorAll('input[type="checkbox"]').forEach(element => {
        var color = element.attributes.color.value;
        // Get the tag element
        var tag = element.parentNode.parentNode.parentNode;
        // Update the tag background color
        tag.style.backgroundColor = color;

        //Prevent checkbox from beeing checked by default
        element.checked = false;
    })

    // Reset the selected-tags box
    document.querySelector('.reset-tag').addEventListener('click', resetTag);
}

if(document.querySelector('.select-options')){
    const selectOption = document.querySelector('.select-options');
}

// Automaticaly add the tag color background for each tags under the tasks
document.querySelectorAll('.tag-color-input').forEach(element => {
    var color = element.attributes.color.value;
    var tag = element.parentNode;
    tag.style.backgroundColor = color;
})

/* Reset the selected tags box when closing the modal */
document.querySelectorAll('.modal').forEach(element => {
    element.addEventListener('click', function(event){
        if(event.target.classList.contains('close-modal') ||
        event.target.parentNode.classList.contains('close-modal') ||
        event.target.parentNode.parentNode.classList.contains('close-modal')){
            event.preventDefault();
            resetTag();
        }else if(event.target.closest('.open-select')){
            openTagOptions(event.target.closest('.open-select'));
        }else if(event.target.closest('.tag') && event.target.closest('.selected-tags')){
            event.preventDefault();
        }else if(event.target.closest('.tag')){
            addTag_RowAddModal(event,event.target.closest('.tag'));
        }
    })
})
document.querySelector('#modals').addEventListener('click', function(event){
    if(event.target.classList.contains('close-modal') ||
    event.target.parentNode.classList.contains('close-modal') ||
    event.target.parentNode.parentNode.classList.contains('close-modal')){
        event.preventDefault();
        resetTag();
    }else if(event.target.closest('.open-select')){
        openTagOptions(event.target.closest('.open-select'));
    }else if(event.target.closest('.tag') && event.target.closest('.selected-tags')){
        event.preventDefault();
    }else if(event.target.closest('.tag')){
        addTag(event,event.target.closest('.tag'));
    }
})

/*----------------------------------------------------------------------------------------------*/
/*    JS Functions                                                                              */
/*----------------------------------------------------------------------------------------------*/
/**
 * Open the tag select box
 */
function openTagOptions(element){
    element.classList.toggle('active');
    element.classList.toggle('rotate');
    // console.log(element.closest('.select-container'));
    // var optionsSelector = element.parentNode.parentNode.parentNode.querySelector('.select-options');
    var optionsSelector = element.closest('.select-container').querySelector('.select-options');
    optionsSelector.classList.toggle('active');
}

/**
 * Close the tag select box
 */
function closeTagOptions(){
    var openSelect = document.querySelector('.open-select');
    if(selectOption.classList.contains('active')){
        selectOption.classList.toggle('active');
        openSelect.classList.toggle('rotate');
    }
}

/**
 * Keep track of the selected tags
 */
var selectedTag = []

/**
 * Reset the selected-tags
 */
function resetTag(){
    var selector = document.querySelector('.selected-tags');
    selectedTag = [];
    selector.innerHTML = '';
}

/**
 * Add tag to the selected-tags box to keep user informe of each tags he choose to add
 * When the tag has already been had, remove it
 * @param {*} event 
 */
function addTag_RowAddModal(event, element){
    // Prevent duplication
    event.preventDefault();

    var input = element.querySelector('input[type="checkbox"]')
    // Clone the chosen tag
    var tag = element.cloneNode(true);
    // Get the tag id
    var tagId = input.value;
    // Get the selected tags box
    var selector = element.closest('.select-container').querySelector('.selected-tags');
    /**
     * If the tag id is not in the selectedTags array, add it and add the clone element to the selected-tags box
     * If the tag is in the selectedTags array, remove it and remove the element from the selected-tags box
     */
    let index = selectedTag.indexOf(tagId);
    if(index === -1){
        selectedTag.push(tagId);
        input.checked = true;
        selector.appendChild(tag);
    }else{
        selectedTag.splice(index, 1);
        input.checked = false;
        // Tag check icon
        // Get the tag in the selected-tags box
        var tagToRemove = selector.querySelector(`#task_tags_id_${tagId}`).closest('.tag');
        // Remove the element and the check icon
        tagToRemove.parentNode.removeChild(tagToRemove);
    }
}


function addTag(event,element){
    // Prevent duplication
    event.preventDefault();

    var container = element.closest('.select-container');
    var input = element.querySelector('.update_tag_id');
    var label = element.querySelector('label');
    // Clone the chosen tag
    var tag = element.cloneNode(true);
    // Get the tag id
    var tagId = input.value;
    // Get the selected tags box
    var selector = container.querySelector('.selected-tags');
    // Get the options div
    var options = element.closest('.options');
    
    // Update the tag innerHTML to remove the input and prevent duplication  when submitting the form
    tag.innerHTML = `<span id="selectedTask_${input.value}">${label.innerHTML}</span>`;

    /**
     * If the tag id is not in the selectedTags array, add it and add the clone element to the selected-tags box
     * If the tag is in the selectedTags array, remove it and remove the element from the selected-tags box
     */
    let index = selectedTag.indexOf(tagId);

    if(index === -1 && !element.classList.contains('tag-used')){
        // Update the selectedTag array
        selectedTag.push(tagId);
        // Check the input
        input.checked = true;
        selector.appendChild(tag);
        // Add a check icon to the current Tag
        options.querySelector('.check').innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
    }else if(element.classList.contains('tag-used')){
        input.checked = false;
        element.classList.remove('tag-used');
        // Remove the check icon
        options.querySelector('.check').innerHTML = ''
        // Get the tag in the selected-tags box
        var tagToRemove = selector.querySelector(`#selectedTask_${tagId}`).parentNode;
        // Remove the element
        tagToRemove.parentNode.removeChild(tagToRemove);
    }else{
        selectedTag.splice(index, 1);
        input.checked = false;
        // Remove the check icon
        options.querySelector('.check').innerHTML = ''
        // Get the tag in the selected-tags box
        var tagToRemove = selector.querySelector(`#selectedTask_${tagId}`).parentNode;
        // Remove the element
        tagToRemove.parentNode.removeChild(tagToRemove);
    }
}
/*----------------------------------------------------------------------------------------------*/
/*    Ajax Request                                                                              */
/*----------------------------------------------------------------------------------------------*/
