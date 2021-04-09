import { displayFlash } from '../../helper';
/*----------------------------------------------------------------------------------------------*/
/*    EventListener for tasks interactions                                                      */
/*----------------------------------------------------------------------------------------------*/
// Add eventListener to the default move button
document.getElementById('move-row').addEventListener("click", moveRow) ;


/*----------------------------------------------------------------------------------------------*/
/*    Manage sortable Jquery Feature                                                            */
/*----------------------------------------------------------------------------------------------*/
/**
 * Allow user to sort task table
 * Add confirm and cancel button
 * @param {*} event 
 */
function moveRow(event){
    event.preventDefault();
    // Disable a button to prevent form submitting
    document.querySelectorAll('button').forEach(element => { element.disabled = true; })
    // Hide the move-button
    document.getElementById('move-row').style.display = 'none';

    // Add confirm and cancel button
    document.getElementById('user-button-center').innerHTML += `<button id="validate-move-row" class="btn btn-success ml-6 my-5 justify-center">Valider</button>
                                                                <button id="cancel-move-row" class="btn btn-warning ml-4 my-5 justify-center">Annuler</button>`
    // Enable the confirm and cancel button otherwise the user can't do nothing :D
    document.getElementById('validate-move-row').disabled = false;
    document.getElementById('cancel-move-row').disabled = false;
    // Add animation
    document.getElementById('validate-move-row').style.animation = 'fadein 1.3s';
    document.getElementById('cancel-move-row').style.animation = 'fadein 1.3s';
    // Add corresponding EventListener
    document.getElementById('validate-move-row').addEventListener("click", disableMoveRow);
    document.getElementById('cancel-move-row').addEventListener("click", cancelMoveRow);

    // Initialize sortable Jquery function
    $('#task-list').sortable({
        placeholder: "sortable-hilight",
        cancel: "a,button"
    });
    // After initialization, enable the sortable function
    $("#task-list").sortable( "option", "disabled", false );
}

/**
 * Execute when the user click the confirm button
 * Send ajax request to update row order
 * @param {*} event 
 */
function disableMoveRow(event){
    event.preventDefault();
    document.querySelectorAll('button').forEach(element => { element.disabled = false; })
    document.querySelector('.toolbox-tag').disabled = false;
    // Disable sortable Jquery function
    $('#task-list').sortable('disable');
    // Add spinner animation
    document.getElementById('validate-move-row').innerHTML += '<span class="ml-3 loading animate-spin"></span>';
    // Add animation
    document.getElementById('validate-move-row').style.animation = 'fadeout 1.3s';
    document.getElementById('cancel-move-row').style.animation = 'fadeout 1.3s';

    document.getElementById('validate-move-row').removeEventListener("click", disableMoveRow);
    document.getElementById('cancel-move-row').removeEventListener("click", cancelMoveRow);

    // Remove confirm and cancel buttons from the DOM
    setTimeout(function(){
        var btn = event.target;
        var cancelBtn = document.getElementById('cancel-move-row');
        btn.remove();
        cancelBtn.remove();
        // Show move-button
        document.getElementById('move-row').style.display = 'flex';
    },50)

    // Create an associative array containing : position => task_id
    var page_id = {};
    // Initialize counter to 1
    let i = 1;
    $('#task-list tr').each(function(){
        page_id[i] = $(this).attr('id');
        i++;
    })
    // Ajax request
    updateOrder(page_id);
}

/**
 * Cancel sortable feature
 * @param {*} event 
 */
function cancelMoveRow(event){
    event.preventDefault();
    document.querySelectorAll('button').forEach(element => { element.disabled = false; });
    // Add spinner animation
    document.getElementById('cancel-move-row').innerHTML += '<span class="ml-3 loading animate-spin"></span>';
    // Add animation
    document.getElementById('validate-move-row').style.animation = 'fadeout 1.3s';
    document.getElementById('cancel-move-row').style.animation = 'fadeout 1.3s';

    $('#task-list').sortable('refresh');
    $('#task-list').sortable('disable');

    document.getElementById('validate-move-row').removeEventListener("click", disableMoveRow);
    document.getElementById('cancel-move-row').removeEventListener("click", cancelMoveRow);

    // Remove confirm and cancel buttons from the DOM
    setTimeout(function(){
        var btn = event.target;
        var confirmBtn = document.getElementById('validate-move-row');
        btn.remove();
        confirmBtn.remove();
        // Show move-button
        document.getElementById('move-row').style.display = 'flex';
    },50)
}
/*----------------------------------------------------------------------------------------------*/
/*    Ajax Request                                                                              */
/*----------------------------------------------------------------------------------------------*/
/**
 * Ajax request to keep track of the row order in the database
 * @param {Array} OrderArray 
 */
function updateOrder(OrderArray){
    
    var request = new XMLHttpRequest();
    
    function handleResponse(){
        if(request.readyState === 4 && request.status === 200){
            // Parse server response
            var response = JSON.parse(request.responseText);
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
    let body = JSON.stringify({ orderId: OrderArray });

    request.open('POST', '/api/task/reorder', true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.onreadystatechange = handleResponse;
    request.send(body);
}