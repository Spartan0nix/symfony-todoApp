import { displayFlash } from "../helper.js";

const month = { 1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'}
var currentDate = new Date();
var currentMonth = currentDate.getMonth()+1;
var currentYear = currentDate.getFullYear();

var monthContainer = document.querySelector('.calendar-header');
var weekDaysContainer = document.querySelector('.calendar-weekdays');
var daysContainer = document.querySelector('.calendar-days-display');

/**
 * Event listener to change month
 */
document.addEventListener('click', function(event) {
    if(event.target.closest('#last-month')){
        getLastMonth()
    }else if(event.target.closest('#next-month')){
        getNextMonth()
    }
})

/**
 * Start
 */
getDueTasks("page-loaded");


/**
 * Display last month
 */
function getLastMonth(){
    currentMonth -= 1;
    
    if(currentMonth <= 0){
        currentYear -= 1;
        currentMonth = 12;
    }
    getDueTasks("update-calendar");
}

/**
 * Display next month
 */
function getNextMonth(){
    currentMonth += 1;

    if(currentMonth > 12){
        currentYear += 1;
        currentMonth = 1;
    }
    getDueTasks("update-calendar");
}


/**
 * Get all the due tasks for the current Month
 * @param {String} trigger 
 */
function getDueTasks(trigger){
    var request = new XMLHttpRequest();
    var Apitoken = document.querySelector('input[name="apiToken"').value;
    
    if(currentMonth < 10) {
        var month = "0"+currentMonth;
    }
    
    function handleResponse(){
        if(request.readyState === 4 && request.status === 200){
            var response = JSON.parse(request.responseText);
            // User just accessed the page
            if(trigger === "page-loaded") {
                createCalendar(response.tasks);
            }else if(trigger === "update-calendar"){
                // getDueTasks was called when the user change the current Month
                updateCalendar(response.tasks);
            }
        }else if(request.status === 400){
            var response = JSON.parse(request.responseText);
            displayFlash("warning", response.message)
        }else if(request.status === 404){
            var response = JSON.parse(request.responseText);
            displayFlash("error", response.message)
        }
    }

    request.open('GET', '/api/calendar/tasks?month='+month, true);
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.setRequestHeader('X-Auth-Token', Apitoken);
    request.onreadystatechange = handleResponse;
    request.send(null);
}

/**
 * Create the calendar when loading the page 
 * @param {Array} tasks 
 */
 function createCalendar(tasks) {
    let numberOfDays = getDaysInMonth(currentMonth, currentYear);
    let currentDay = '#day-'+currentDate.getDate();
    if(currentMonth < 10) {
        var month = "0"+currentMonth;
    }

    monthContainer.querySelector('h3').innerHTML = month[currentMonth]+' - '+currentYear;
    for (let index = 1; index <= numberOfDays; index++) {
        daysContainer.innerHTML += `<p class="calendar-day" id="day-${index}">
                                        <span class="day-title">
                                            ${index}
                                            <a class="day-info" href="/calendrier/${index}-${month}-${currentYear}/tasks"></a>
                                        </span>
                                    </p>`
    }

    tasks.forEach(element => {
        let dayIndex = '#day-'+element['due_date'].slice(8,10);
        daysContainer.querySelector(dayIndex).innerHTML += `<p class="calendar-task">${element['title']}</p>`;
    });
    
    daysContainer.querySelector(currentDay).classList.toggle('currentDay');
    
}

/**
 * Update calendar innerHTML
 */
 function updateCalendar(tasks){
    let numberOfDays = getDaysInMonth(currentMonth, currentYear);
    monthContainer.querySelector('h3').innerHTML = month[currentMonth]+' - '+currentYear;
    daysContainer.innerHTML = '';
    if(currentMonth < 10) {
        var month = "0"+currentMonth;
    }

    for (let index = 1; index <= numberOfDays; index++) {
        daysContainer.innerHTML += `<p class="calendar-day" id="day-${index}">
                                        <span class="day-title">
                                            ${index}
                                            <a class="day-info" href="/calendrier/${index}-${month}-${currentYear}/tasks"></a>
                                        </span>
                                    </p>`
    }

    if(currentMonth === currentDate.getMonth() + 1){
        let currentDay = '#day-'+currentDate.getDate();
        daysContainer.querySelector(currentDay).classList.toggle('currentDay');
    }

    tasks.forEach(element => {
        let dayIndex = '#day-'+element['due_date'].slice(8,10);
        daysContainer.querySelector(dayIndex).innerHTML += `<p class="calendar-task">${element['title']}</p>`;
    });
}

/**
 * Get the number of days in the month
 * @param {Number} month 
 * @param {Number} year 
 */
 function getDaysInMonth(month, year){
    return new Date(year, month, 0).getDate();
}