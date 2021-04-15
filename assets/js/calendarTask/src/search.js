document.querySelector('.selected-search').addEventListener('input', searchTag);

function searchTag(event){
    var searchString = event.target.value;
    var Apitoken = document.querySelector('input[name="userToken"]').value;
    var request = new XMLHttpRequest();

    function handleResponse(){
        if(request.readyState === 4 && request.status === 200){
            var response = JSON.parse(request.responseText);
            var tasks = response.tasks;
            var optionsContainer = document.querySelector('.select-options');
            var i = 0;
            optionsContainer.innerHTML = '';

            tasks.forEach(element => {
                optionsContainer.innerHTML += `<div class="options-row">
                                                    <div class="options">
                                                        <div class="element">
                                                            <input type="checkbox" name="element[${i}]" id="element_${element.id }" value="${element.id }">
                                                            <label for="element_${element.id }">${element.title }</label>
                                                        </div>
                                                        <span class="ml-3 check"></span>
                                                    </div>
                                                </div>`;
                i++;
            });
        }else if(request.readyState === 4 && request.status === 404){
            var response = JSON.parse(request.responseText);
            var optionsContainer = document.querySelector('.select-options');
            optionsContainer.innerHTML = response.message;
        }
    }

    request.open('GET', '/api/calendar/search?string='+searchString, true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send();
}