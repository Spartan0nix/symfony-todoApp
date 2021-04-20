import { displayFlash, createElementSelector, createTag } from '../../helper';
import { createCalendarSelector } from './calendar';
import '../../components/calendar';
 
document.querySelectorAll('input[type="text"]').forEach(element => {
    element.innerHTML = ""
    element.value = ""
});

document.querySelectorAll('textarea').forEach(element => {
    element.innerHTML = ""
    element.value = ""
});

/*----------------------------------------------------------------------------------------------*/
/*    EventListener for tasks interactions                                                      */
/*----------------------------------------------------------------------------------------------*/
document.querySelectorAll(".checkbox > button.uncheck").forEach(element => {
    element.addEventListener("click", finishTask);
})
document.querySelectorAll(".checkbox > button.checked").forEach(element => {
    element.addEventListener("click", reOpenTask);
})

/*----------------------------------------------------------------------------------------------*/
/*    EventListener for modal interactions                                                      */
/*----------------------------------------------------------------------------------------------*/
if(document.getElementById('add-row')){
    document.getElementById('add-row').addEventListener('click', openAddModal);
}

document.querySelectorAll(".edit-btn").forEach(element => {
    element.addEventListener("click", openUpdateModal);
})
document.querySelectorAll(".table-action > button.btn-danger").forEach(element => {
    element.addEventListener("click", openDeleteModal);
})


/* EventListener for handling modal closing */
document.querySelectorAll('.modal').forEach(element => {
    element.addEventListener('click', function(event){
        if(event.target.classList.contains('close-modal') ||
        event.target.parentNode.classList.contains('close-modal') ||
        event.target.parentNode.parentNode.classList.contains('close-modal')){
            event.preventDefault();
            closeModal();
        }
    })
})

/* EventListener for handling modal closing */
document.querySelector('#modals').addEventListener('click', function(event){
    if(event.target.classList.contains('close-modal') ||
    event.target.parentNode.classList.contains('close-modal') ||
    event.target.parentNode.parentNode.classList.contains('close-modal')){
        event.preventDefault();
        closeModal();
    }
})

/* Close modal when clicking on the cancel button */
document.querySelector('#modals').addEventListener('submit', function(event) {
    if (event.target.classList.contains("cancel-modal")) {
        event.preventDefault();
        closeModal();
    }else if(event.target.classList.contains('update-submit')) {
        updateRow(event);
    }else if(event.target.classList.contains('delete-submit')) {
        removeTask(event);
    }
});

/*----------------------------------------------------------------------------------------------*/
/*    Open/Create Modal                                                                         */
/*----------------------------------------------------------------------------------------------*/
function openAddModal(){
    document.querySelector('.addRowModal').style.visibility = 'visible';
    document.querySelector('.addRowModal').style.opacity = '1';
    document.querySelector('body').style.overflowY = 'hidden';
}

function openUpdateModal(){
    var id = this.parentNode.parentNode.id;
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    var calendarSelector = createCalendarSelector();
    document.querySelector('body').style.overflowY = 'hidden';

    var request = new XMLHttpRequest();

    request.open('GET', '/api/task?id='+id, true);;
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onload = function(){
        if(request.readyState === 4 && request.status === 200){
            // // Stored the data
            var data = JSON.parse(request.responseText);
            // Stored the userTask information
            var task = data.task;
            var tags = task.tags;
            var userTags = data.userTags;

            /**
             * Loop to see which user tag are already applied on this task
             */
             for (let index = 0; index < userTags.length; index++) {
                if(tags.find(el => el.id === userTags[index].id)){
                    userTags[index].isused = true;
                }else{
                    userTags[index].isused = false;
                }
            }
            var tagSelector = createElementSelector(userTags, "Sélectionner un ou plusieurs tags");
            createModal(data, task, tagSelector);

        }else if(request.status === 400){
            var response = JSON.parse(request.responseText);
            displayFlash("warning", response.message)
        }else if(request.status === 401){
            var response = JSON.parse(request.responseText);
            displayFlash("error", response.message)
        }else if(request.status === 404){
            var response = JSON.parse(request.responseText);
            displayFlash("error", response.message)
        }
    }
    request.send();
    
    function createModal(data, userTask, tagSelector){
        document.getElementById("modals").innerHTML =  `<div class="modal-wrapper updateRowModal">
                                                            <form action="#" class="update-submit" method="POST">
                                                                <div class="modal">
                                                                    <div class="modal-header">
                                                                        <h2 class="font-semibold">Modifier votre tâche</h2>
                                                                    </div>
                                                                    <div class="modal-content">
                                                                        <input type="hidden" name="id" value="${ userTask.id }">
                                                                        <input type="hidden" name="token" value="${ data.token }">
                                                                        <div class="input-text title">
                                                                            <div>
                                                                                <label for="task-${ userTask.id }-title">Titre</label>
                                                                                <input type="text" id="task-${ userTask.id }-title" name="title" value="${ userTask.title }">
                                                                            </div>
                                                                        </div>
                                                                        <div class="input-text description">
                                                                            <div>
                                                                                <label for="task-${ userTask.id }-description">Description</label>
                                                                                <textarea id="task-${ userTask.id }-description" name="description" cols="5" rows="3">${ userTask.description }</textarea>   
                                                                            </div>
                                                                        </div>
                                                                        ${tagSelector}
                                                                        ${calendarSelector}
                                                                    </div>
                                                                    <div class="modal-btn">
                                                                        <button type="submit" class="btn btn-primary flex items-center">Modifier</button>
                                                                    </div>  
                                                                    <span class="close-modal"><i class="fa fa-times" aria-hidden="true"></i></span>      
                                                                </div>
                                                            </form>
                                                        </div>`;
        setTimeout(function(){
            document.querySelector("#modals > .updateRowModal").style.visibility = 'visible';
            document.querySelector("#modals > .updateRowModal").style.opacity = '1';
        }, 50);
    }
}

function openDeleteModal(){
    document.querySelector('body').style.overflowY = 'hidden';
    var id = this.parentNode.parentNode.id;
    document.getElementById("modals").innerHTML = `<div class="modal-wrapper deleteRowModal">
                                                    <form action="#" class="delete-submit" method="POST">
                                                        <div class="modal">
                                                            <div class="modal-header">
                                                                <h2 class="font-semibold">Confirmer la suppression de cette tâche.</h2>
                                                            </div>
                                                            <div class="modal-btn">
                                                                <input type="hidden" name="id" value="${ id }">
                                                                <button type="submit" class="btn btn-danger">Confirmer</button>
                                                                <button class="btn btn-primary cancel-modal">Annuler</button>
                                                            </div>  
                                                            <span class="close-modal"><i class="fa fa-times" aria-hidden="true"></i></span>      
                                                        </div>
                                                    </form>
                                                </div>`;
    setTimeout(function(){
        document.querySelector("#modals > .deleteRowModal").style.visibility = 'visible';
        document.querySelector("#modals > .deleteRowModal").style.opacity = '1';
    }, 50);
}

/**
 * Close modal with opacity animation
 * Remove the closed modal from the DOM
 */
function closeModal(){
    document.querySelectorAll('.modal-wrapper').forEach(element => {
        element.style.opacity = '0';
    })
    document.querySelectorAll('.modal-wrapper').forEach(element => {
        element.style.visibility = 'hidden';
    })

    document.querySelectorAll('.modal-wrapper').forEach(element => {
        element.addEventListener("transitionend", function(){
            document.getElementById("modals").innerHTML = "";
        })
    })

    document.querySelector('body').style.overflowY = '';
}

/*----------------------------------------------------------------------------------------------*/
/*    Ajax Request                                                                              */
/*----------------------------------------------------------------------------------------------*/
/**
 * Close the current Task
 */
function finishTask(){
    var request = new XMLHttpRequest();
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    // Store the current element (<button></button>)
    var button = this;
    // Store the first Parent of the element (<td></td>)
    var firstParent = this.parentNode;
    // Store the "root element" (<tr></tr>)
    var root = firstParent.parentNode;
    
    function handleResponse(){                
        if(request.readyState === 4 && request.status === 200){
            // Parse server response
            var response = JSON.parse(request.responseText);

            // Update button
            root.classList.add("theme-success");
            button.classList.remove("uncheck");
            button.classList.add("checked");
            button.innerHTML = '<span><i class="fa fa-check fa-lg" aria-hidden="true"></i></span>';

            // Remove ajax call EventListener
            button.removeEventListener("click", finishTask);  
            // Informe user
            displayFlash("success",response.message)
            // Update eventListener
            button.addEventListener("click", reOpenTask);
        }else if(request.status === 400){
            var response = JSON.parse(request.responseText);
            displayFlash("warning", response.message)
        }else if(request.status === 404){
            var response = JSON.parse(request.responseText);
            displayFlash("error", response.message)
        }
    }

    // Send 
    let body = JSON.stringify({
        TaskId: root.id
    });

    request.open('POST', '/api/task/finish', true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send(body);
}
/*----------------------------------------------------------------------------------------------*/
/**
 * ReOpen the current Task
 */
function reOpenTask() {
    var request = new XMLHttpRequest();
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    // Store the current element (<button></button>)
    var button = this;
    // Store the first Parent of the element (<td></td>)
    var firstParent = this.parentNode;
    // Store the "root element" (<tr></tr>)
    var root = firstParent.parentNode;
    
    function handleResponse(){
        if(request.readyState === 4 && request.status === 200){
            // Parse server response
            var response = JSON.parse(request.responseText);

            root.classList.remove("theme-success");
            // Update button
            button.classList.remove("checked");
            button.classList.add("uncheck");
            button.innerHTML = '';

            // Remove ajax call EventListener
            button.removeEventListener("click", reOpenTask);  
            // Informe user
            displayFlash("success",response.message)
            // Update eventListener
            button.addEventListener("click", finishTask);
        }else if(request.status === 400){
            var response = JSON.parse(request.responseText);
            displayFlash("warning", response.message)
        }else if(request.status === 404){
            var response = JSON.parse(request.responseText);
            displayFlash("error", response.message)
        }
    }

    // Send 
    let body = JSON.stringify({
        TaskId: root.id
    });

    request.open('POST', '/api/task/reopen', true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send(body);
}
/*----------------------------------------------------------------------------------------------*/
/**
 * Update the current Task
 * @param {*} event 
 */
function updateRow(event){
    event.preventDefault();
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    var data = event.target.elements;
    var addTagArray = [];
    var removeTagArray = [];
    var request = new XMLHttpRequest();
    var currentRow = document.getElementById(data['id'].value);
    var currentForm = event.target;

    currentForm.querySelectorAll('input[type="checkbox"]').forEach(element => {
        if(element.checked){
            addTagArray.push(element.value);
        }else{
            removeTagArray.push(element.value);
        }
    })

    // Change current button to loading button
    event.submitter.innerHTML += '<span class="ml-3 loading animate-spin"></span>';

    function handleResponse(){
        if(request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            var task = response.task;
            var tags = response.tags;
        
            displayFlash("success", response.message)
            // Update table row information
            currentRow.querySelector('h4').innerHTML = task.title;
            currentRow.querySelector('p').innerHTML = task.description;
            currentRow.querySelector('.task-tags-display').innerHTML = '';

            tags.forEach(element => {
                currentRow.querySelector('.task-tags-display').innerHTML += createTag(element);
            })

        }else if(request.status === 400){
            var response = JSON.parse(request.responseText);
            displayFlash("warning", response.message)
        }else if(request.status === 404 || request.status === 401){
            var response = JSON.parse(request.responseText);
            displayFlash("error", response.message)
        }
        closeModal();
    }

    let body = JSON.stringify({
        'id': data['id'].value,
        'title': data['title'].value,
        'description': data['description'].value,
        'token': data['token'].value,
        'addTags': addTagArray,
        'removeTag': removeTagArray
    });
    request.open('POST', '/api/task/update', true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send(body);
}
/*----------------------------------------------------------------------------------------------*/
/**
 * Remove the current Task
 * @param {} event 
 */
function removeTask(event) {
    event.preventDefault();
    var Apitoken = document.querySelector('input[name="userToken"]').value;

    if(event.submitter.classList.contains("cancel-modal")){
        closeModal();
    }else{
        var data = Object.fromEntries(new FormData(event.target));
        var request = new XMLHttpRequest();
        
        function handleResponse(){
            closeModal();
            if(request.readyState === 4 && request.status === 200){
                // Parse server response
                var response = JSON.parse(request.responseText);

                // Delete root element
                var row = document.getElementById(data.id);
                row.style.animation = "1s fadeout"
                setTimeout(function(){
                    row.parentElement.removeChild(row);
                },1000);

                displayFlash("success",response.message);
            }else if(request.status === 400){
                var response = JSON.parse(request.responseText);
                displayFlash("warning", response.message)
            }else if(request.status === 404){
                var response = JSON.parse(request.responseText);
                displayFlash("error", response.message)
            }
        }

        // Send 
        let body = JSON.stringify({ TaskId: data.id });

        request.open('POST', '/api/task/delete', true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('X-Auth-Token', Apitoken);
        request.onreadystatechange = handleResponse;
        request.send(body);
    }
}