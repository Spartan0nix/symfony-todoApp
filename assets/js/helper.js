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
 * Create a tag selector base on all the user tags
 * @param {object} allUserTags 
 */
function createTagSelector(allUserTags){
    var input = '';
    var selectedTag = '';
    let i = 0;
    // Check if the tags are already used on this task
    allUserTags.forEach(element => {
        if(element.isused){

            selectedTag += ` <div class="tag tag-used ml-3 mt-1" style="background-color: ${element.color}">
                                <span id="selectedTask_${element.id}">${element.name}</span>
                            </div>
            `;

            input += `<div class="options-row">
                        <div class="options"> 
                            <div class="tag tag-used" style="background-color: ${element.color}">
                                <input type="checkbox" class="update_tag_id" name="task[${i}]" id="tag_${element.id}" value="${element.id}" checked>
                                <label for="tag_${element.id}">${element.name}</label>
                            </div>
                            <span class="ml-3 check"><i class="fa fa-check" aria-hidden="true"></i></span>
                        </div>
                    </div>
            `;
            i++;
        }else{
            input += `<div class="options-row">
                        <div class="options"> 
                            <div class="tag" style="background-color: ${element.color}">
                                <input type="checkbox" class="update_tag_id" name="task[${i}]" id="tag_${element.id}" value="${element.id}" >
                                <label for="tag_${element.id}">${element.name}</label>
                            </div>
                            <span class="ml-3 check"></span>
                        </div>
                    </div>
            `;
            i++;
        }
    });

    // Define the content of the modal
    var content = `<div class="select-container updateSelector">
                        <div class="selected">
                            <div class="selected-header">
                                <span class="selected-title">Sélectionner un ou plusieurs tags</span>
                                <span class="reset-tag">
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
                            <div class="selected-tags">
                                ${selectedTag}
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

export { displayFlash, createTagSelector, createTag };