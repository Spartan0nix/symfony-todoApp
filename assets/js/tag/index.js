import { displayFlash } from '../helper';

/**
 * Event Listeners
 */
document.querySelector('#modals').addEventListener('submit', function(event) {
    if(event.target.classList.contains('delete-submit')){
        removeTag(event);
    }else if(event.target.classList.contains('update-submit')){
        updateTag(event);
    }
});

/* EventListener for handling modal closing */
document.querySelector('#modals').addEventListener('click', function(event){
    if(event.target.classList.contains('close-modal') ||
    event.target.parentNode.classList.contains('close-modal') ||
    event.target.parentNode.parentNode.classList.contains('close-modal')){
        event.preventDefault();
        closeModal();
    }
})

document.querySelectorAll('.table-action > button.btn-danger').forEach(element => {
    element.addEventListener("click", openDeleteModal);
});;
document.querySelectorAll('.table-action > button.btn-primary').forEach(element => {
    element.addEventListener('click', openUpdateModal);
})

/**
 * Open the delete Modal
 */
function openDeleteModal(){
    var id = this.closest("._tag").id;
    document.getElementById("modals").innerHTML = `<div class="modal-wrapper deleteTagModal">
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
        document.querySelector("#modals > .deleteTagModal").style.visibility = 'visible';
        document.querySelector("#modals > .deleteTagModal").style.opacity = '1';
    }, 50);
}

/**
 * Open the update modal
 */
function openUpdateModal(){
    var id = this.closest("._tag").id;
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    var request = new XMLHttpRequest();

    function handleResponse(){
        if(request.readyState === 4 && request.status === 200){
            var data = JSON.parse(request.responseText);
            var tag = data.tag;
            var slider = createTagSlider(tag);
            createUpdateModal(data, tag, slider);
        }else if(request.status === 400){
            var response = JSON.parse(request.responseText);
            displayFlash("warning", response.message)
        }else if(request.status === 404){
            var response = JSON.parse(request.responseText);
            displayFlash("error", response.message)
        }
    }

    request.open("GET", "/api/tag?id="+id, true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send();

    function createTagSlider(tag){
        return `<div class="color-picker-container">
                    <div class="color-picker-select">
                        <section class="color-picker-slider">
                            <label for="color-picker-red">Rouge</label>
                            <input type="range" min="0" max="255" class="slider" id="color-picker-red">
                            <label for="color-picker-green">Vert</label>
                            <input type="range" min="0" max="255" class="slider" id="color-picker-green">
                            <label for="color-picker-blue">Bleu</label>
                            <input type="range" min="0" max="255" class="slider" id="color-picker-blue">
                        </section>
                        <section class="color-picker-render">
                            <div id="color-render"></div>
                        </section>
                    </div>
                    <div class="color-picker-hexa">
                        <input type="hidden" id="update_tag_color" name="color" value="${ tag.color }"> 
                    </div>
                </div>`;
    }

    function createUpdateModal(data, tag, slider){
        document.getElementById("modals").innerHTML =  `<div class="modal-wrapper updateTagModal">
                                                            <form action="#" class="update-submit" method="POST">
                                                                <div class="modal">
                                                                    <div class="modal-header">
                                                                        <h2 class="font-semibold">Modifier votre tag</h2>
                                                                    </div>
                                                                    <div class="modal-content">
                                                                        <input type="hidden" name="id" value="${ tag.id }">
                                                                        <input type="hidden" name="token" value="${ data.token }">
                                                                        <div class="input-text title">
                                                                            <div>
                                                                                <label for="tag-${ tag.id }-name">Nom</label>
                                                                                <input type="text" id="tag-${ tag.id }-name" name="name" value="${ tag.name }">
                                                                            </div>
                                                                        </div>
                                                                        ${ slider }
                                                                    </div>
                                                                    <div class="modal-btn">
                                                                        <button type="submit" class="btn btn-primary flex items-center">Modifier</button>
                                                                    </div>  
                                                                    <span class="close-modal"><i class="fa fa-times" aria-hidden="true"></i></span>      
                                                                </div>
                                                            </form>
                                                        </div>`;
        setTimeout(function(){
            document.querySelector("#modals > .updateTagModal").style.visibility = 'visible';
            document.querySelector("#modals > .updateTagModal").style.opacity = '1';
        }, 50);
    }
}

/**
 * Handle delete modal submit
 * @param {*} event 
 */
function removeTag(event){
    event.preventDefault();
    if(event.submitter.classList.contains('cancel-modal')){
        closeModal();
    }else{
        var Apitoken = document.querySelector('input[name="userToken"]').value;
        var id = event.submitter.parentNode.querySelector('input[name="id"]').value;
        var request = new XMLHttpRequest();

        function handleResponse(){
            closeModal();
            if(request.readyState === 4 && request.status === 200){
                // Parse server response
                var response = JSON.parse(request.responseText);
                // Delete root element
                var row = document.getElementById(response.id);
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
        let body = JSON.stringify({ tagId: id });

        request.open('POST', '/api/tag/delete', true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('X-Auth-Token', Apitoken);
        request.onreadystatechange = handleResponse;
        request.send(body);
    }
}

/**
 * Handle update modal submit
 * @param {*} event 
 */
function updateTag(event){
    event.preventDefault();
    var tagId = event.target.elements['id'].value;
    var name = event.target.elements['name'].value;
    var color = event.target.elements['color'].value;
    var token = event.target.elements['token'].value;
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    var currentTag = document.getElementById(tagId);
    var request = new XMLHttpRequest();

    event.submitter.innerHTML += '<span class="ml-3 loading animate-spin"></span>';
    function handleResponse(){
        if(request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            displayFlash("success", response.message)
            // Update tag information
            currentTag.querySelector('.tag').style.backgroundColor = response.tag.color;
            currentTag.querySelector('.tag').innerHTML = response.tag.name;
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
        id: tagId,
        name: name,
        color: color,
        token: token
    });

    request.open("POST", "/api/tag/update", true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send(body);
}

/**
 * Close the modal
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
}