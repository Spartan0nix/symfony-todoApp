/**
 * Create a javascript flash message/notification
 * @param {string} type // success || warning || error || alert-primary (default)
 * @param {string} action // Message that will be display
 */
function displayFlash(type, action) {
    var div = document.getElementById("js-alert");
    var content = document.querySelector("#js-alert > div.alert-content");
    // Stored #js-alert second div child because we are going to remove the alert-progress-bar class
    var progressBar = document.querySelector("#js-alert > div:nth-child(2)");
    div.style.display = "flex";
    // Remove and add the alert-progress-bar class to restart the progress bar countdown each time the function is called
    // If a user validate and reopen a task, it will restart the countdown instead of only changing the inner html of the alert-content
    progressBar.classList.remove("alert-progress-bar");
    setTimeout(function(){
        progressBar.classList.add("alert-progress-bar");
    },1000)
    
    // Prevent stacking different classes
    div.classList.remove("alert-success", "alert-warning", "alert-error", "alert-primary");

    if(type === "success"){
        div.classList.add("alert-success");
        content.innerHTML = '<span><i class="fa fa-times-circle" aria-hidden="true"></i></span>';
    }else if(type === "warning"){
        div.classList.add("alert-warning");
        content.innerHTML = '<span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></span>';
    }else if(type === "error"){
        div.classList.add("alert-error");
        content.innerHTML = '<span><i class="fa fa-times-circle" aria-hidden="true"></i></span>'
    }else{
        div.classList.add("alert-primary")
        content.innerHTML = '<span><i class="fa fa-info-circle" aria-hidden="true"></i></span>'
    }
    
    content.innerHTML += "<p>"+action+"</p>";
}

/**
 * Create an element selector base on all the user element
 * @param {object} allUserElements 
 */
function createElementSelector(allUserElements, title){
    var input = '';
    var selectedElement = '';
    let i = 0;
    // Check if the element are already used
    allUserElements.forEach(element => {
        if(element.isused){

            // selectedElement += ` <div class="element element-used ml-3 mt-1" style="background-color: ${element.color}">
            //                     <span id="element_${element.id}">${element.name}</span>
            //                 </div>
            // `;
            selectedElement += `<span id="element_element_${element.id}" class="element" style="background-color: ${element.color}">${element.name}</span>`;

            input += `<div class="options-row">
                        <div class="options"> 
                            <div class="element element-used" style="background-color: ${element.color}">
                                <input type="checkbox" class="element_id" name="task[${i}]" id="element_${element.id}" value="${element.id}" checked>
                                <label for="element_${element.id}">${element.name}</label>
                            </div>
                            <span class="ml-3 check"><i class="fa fa-check" aria-hidden="true"></i></span>
                        </div>
                    </div>
            `;
            i++;
        }else{
            input += `<div class="options-row">
                        <div class="options"> 
                            <div class="element" style="background-color: ${element.color}">
                                <input type="checkbox" class="element_id" name="task[${i}]" id="element_${element.id}" value="${element.id}" >
                                <label for="element_${element.id}">${element.name}</label>
                            </div>
                            <span class="ml-3 check"></span>
                        </div>
                    </div>
            `;
            i++;
        }
    });

    // Define the content of the modal
    var content = `<div class="select-container">
                        <div class="selected">
                            <div class="selected-header">
                                <span class="selected-title">${title}</span>
                                <span class="reset-selected">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </span>
                                <span class="open-select">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="selected-elements">
                                ${selectedElement}
                            </div>
                        </div>
                        <div class="select-options">
                            ${input}
                        </div>
                    </div>`
    // return the modal as a single string
    return content;
}

function createTag(tag){
    var content = `<div class="tag ml-3 mt-1" style="background-color: ${tag.color}">
                        <input type="hidden" class="tag-color-input" color="${tag.color}">
                        ${tag.name}
                    </div>
            `;
    return content;
}

export { displayFlash, createElementSelector, createTag };