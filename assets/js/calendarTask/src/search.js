document.querySelector('.selected-search').addEventListener('input', searchTag);
var selectedElement = [];

function searchTag(event){
    var searchString = event.target.value;
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    var request = new XMLHttpRequest();
    var optionsContainer = document.querySelector('.select-options');
    var selectedOptionsContainer = document.querySelector('.selected-options');

    function handleResponse(){
        if(request.readyState === 4 && request.status === 200){
            var response = JSON.parse(request.responseText);
            var tasks = response.tasks;
            
            if(optionsContainer.querySelector('.no-options-find')){
                let noOptionsFind = optionsContainer.querySelector('.no-options-find');
                noOptionsFind.parentNode.removeChild(noOptionsFind);
            }

            optionsContainer.querySelectorAll('input[type="checkbox"]:not(:checked)').forEach(element => {
                if(selectedElement.indexOf(element.value) != -1){
                    selectedElement.slice(selectedElement.indexOf(element.value), 1);
                }
                let optionsRow = element.closest('.options-row');
                optionsRow.parentNode.removeChild(optionsRow);
            });

            optionsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(element => {
                if(selectedElement.indexOf(element.value) === -1){
                    selectedElement += element.value;
                }
                selectedOptionsContainer.appendChild(element.closest('.options-row'));
            })
            
            tasks.forEach(element => {
                if(selectedElement.indexOf(element.id) === -1){
                    var content = document.createElement('div');
                    content.classList.add("options-row");
                    content.innerHTML = `<div class="options">
                                            <div class="element">
                                                <input type="checkbox" name="element[${element.id}]" id="element_${element.id }" value="${element.id }">
                                                <label for="element_${element.id }">${element.title }</label>
                                            </div>
                                            <span class="ml-3 check"></span>
                                        </div>`;
                    optionsContainer.appendChild(content);
                }
            });
        }else if(request.readyState === 4 && request.status === 404){
            var response = JSON.parse(request.responseText);
            
            if(!optionsContainer.querySelector('.no-options-find')){
                var content = document.createElement("div");
                content.classList.add("options-row");
                content.classList.add("no-options-find");
                content.innerHTML = response.message;

                optionsContainer.querySelectorAll('input[type="checkbox"]:not(:checked)').forEach(element => {
                    if(selectedElement.indexOf(element.value) != -1){
                        selectedElement.slice(selectedElement.indexOf(element.value), 1);
                    }
                    let optionsRow = element.closest('.options-row');
                    optionsRow.parentNode.removeChild(optionsRow);
                });

                optionsContainer.appendChild(content);
            }
        }
    }

    request.open('GET', '/api/calendar/search?string='+searchString, true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send();
}