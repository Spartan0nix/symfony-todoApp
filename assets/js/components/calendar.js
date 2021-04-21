import { displayFlash } from "../helper.js";

const month = { 1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'}
var currentDate = new Date();
var currentMonth = currentDate.getMonth()+1;
var currentYear = currentDate.getFullYear();

if(document.querySelector('.calendar-container')){
    var monthContainer = document.querySelector('.calendar-header');
    var weekDaysContainer = document.querySelector('.calendar-weekdays');
    var daysContainer = document.querySelector('.calendar-days-display');
}

/**
 * Event listener to change month
 */
document.addEventListener('click', function(event) {
    if(event.target.closest('#last-month')){
        getLastMonth()
    }else if(event.target.closest('#next-month')){
        getNextMonth()
    }else if(event.target.closest('.open-calendar')){
        if(event.target.closest('.calendar-selector-container').querySelector('.small-calendar-container').style.display === 'none'){
            var calendarSelectorContainer = event.target.closest('.calendar-selector-container');
            calendarSelectorContainer.style.position = 'relative';
            calendarSelectorContainer.querySelector('.small-calendar-container').style.display = 'block';
            calendarSelectorContainer.querySelector('.calendar-days-display').innerHTML = '';
            monthContainer = calendarSelectorContainer.querySelector('.calendar-header');
            weekDaysContainer = calendarSelectorContainer.querySelector('.calendar-weekdays');
            daysContainer = calendarSelectorContainer.querySelector('.calendar-days-display');
            createCalendar();
        }else{
            var calendarSelectorContainer = event.target.closest('.calendar-selector-container');
            calendarSelectorContainer.style.position = '';
            calendarSelectorContainer.querySelector('.small-calendar-container').style.display = 'none';
        }  
    }
})

/**
 * Start
 */
if(document.querySelector('#calendarIndex')){
    getDueTasks("page-loaded");
}

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
    if(document.querySelector('input[name="apiToken"')){
        var request = new XMLHttpRequest();
        var Apitoken = document.querySelector('input[name="apiToken"').value;
        
        if(currentMonth.length < 2) {
            currentMonth = "0"+currentMonth;
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

        request.open('GET', '/api/calendar/tasks?month='+currentMonth, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('X-Auth-Token', Apitoken);
        request.onreadystatechange = handleResponse;
        request.send(null);
    }else{
        if(trigger === "page-loaded") {
            createCalendar();
        }else if(trigger === "update-calendar"){
            // getDueTasks was called when the user change the current Month
            updateCalendar();
        }
    }
    
}

/**
 * Create the calendar when loading the page 
 * @param {Array} tasks 
 */
 function createCalendar(tasks = "") {
    let numberOfDays = getDaysInMonth(currentMonth, currentYear);
    let currentDay = '#day-'+currentDate.getDate();

    if(currentMonth.length < 2) {
        currentMonth = "0"+currentMonth;
    }

    if(tasks){
        monthContainer.querySelector('h3').innerHTML = month[Number(currentMonth)]+' - '+currentYear;
        for (let index = 1; index <= numberOfDays; index++) {
            daysContainer.innerHTML += `<a class="calendar-day" id="day-${index}" href="/calendrier/${index}-${currentMonth}-${currentYear}/tasks">
                                            <span class="day-title">${index}</span>
                                        </a>`
        }

        tasks.forEach(element => {
            var elementDay = element['due_date'].slice(8,10);
            if(elementDay < '10'){
                var dayIndex = '#day-'+elementDay.slice(1,2);
            }else{
                var dayIndex = '#day-'+element['due_date'].slice(8,10);
            }
            daysContainer.querySelector(dayIndex).innerHTML += `<p class="calendar-task">${element['title']}</p>`;
        });

        setTimeout(getNumberOfTask(), 100);
    }else{
        monthContainer.querySelector('h3').innerHTML = month[Number(currentMonth)]+' - '+currentYear;
        for (let index = 1; index <= numberOfDays; index++) {
            daysContainer.innerHTML += `<a class="calendar-day" id="day-${index}" href="#" data-value="${index}-${currentMonth}-${currentYear}">
                                            <span class="day-title">${index}</span>
                                        </a>`
        }
    }
    
    daysContainer.querySelector(currentDay).classList.toggle('currentDay');
    
}

/**
 * Update calendar innerHTML
 */
 function updateCalendar(tasks = ""){
    let numberOfDays = getDaysInMonth(currentMonth, currentYear);

    if(currentMonth.length < 2) {
        currentMonth = "0"+currentMonth;
    }

    monthContainer.querySelector('h3').innerHTML = month[Number(currentMonth)]+' - '+currentYear;
    daysContainer.innerHTML = '';

    if(tasks){
        for (let index = 1; index <= numberOfDays; index++) {
            daysContainer.innerHTML += `<a class="calendar-day" id="day-${index}" href="/calendrier/${index}-${currentMonth}-${currentYear}/tasks">
                                            <span class="day-title">${index}</span>
                                        </a>`;
        }

        tasks.forEach(element => {
            let dayIndex = '#day-'+element['due_date'].slice(8,10);
            daysContainer.querySelector(dayIndex).innerHTML += `<p class="calendar-task">${element['title']}</p>`;
        });
    
        setTimeout(getNumberOfTask(), 100);
    }else{
        monthContainer.querySelector('h3').innerHTML = month[Number(currentMonth)]+' - '+currentYear;
        for (let index = 1; index <= numberOfDays; index++) {
            daysContainer.innerHTML += `<a class="calendar-day" id="day-${index}" href="#" data-value="${index}-${currentMonth}-${currentYear}">
                                            <span class="day-title">${index}</span>
                                        </a>`
        }
    }

    if(currentMonth === currentDate.getMonth() + 1){
        let currentDay = '#day-'+currentDate.getDate();
        daysContainer.querySelector(currentDay).classList.toggle('currentDay');
    }
    
}

/**
 * Get the number of days in the month
 * @param {number} month 
 * @param {number} year 
 */
 function getDaysInMonth(month, year){
    return new Date(year, month, 0).getDate();
}

/**
 * Add a span with the number of task for each day
 */
function getNumberOfTask(){
    document.querySelectorAll('.calendar-day').forEach(element => {
        var taskCount = element.querySelectorAll('.calendar-task').length;
        if(taskCount != 0){
            var taskCounter = document.createElement('span');
            taskCounter.classList.add('calendar-task-count');
            taskCounter.innerHTML = `${taskCount} <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                                                </svg>`;
            element.appendChild(taskCounter);
        }
    })
}

export { createCalendar, updateCalendar }