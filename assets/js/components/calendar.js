const month = { 1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'}
var currentDate = new Date();
var currentMonth = currentDate.getMonth()+1;
var currentYear = currentDate.getFullYear();

var monthContainer = document.querySelector('.calendar-header');
var weekDaysContainer = document.querySelector('.calendar-weekdays');
var daysContainer = document.querySelector('.calendar-days');

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
init();

function init() {
    let numberOfDays = getDaysInMonth(currentMonth, currentYear);
    let currentDay = '#day-'+currentDate.getDate();

    monthContainer.querySelector('h3').innerHTML = month[currentMonth];
    for (let index = 1; index <= numberOfDays; index++) {
        daysContainer.innerHTML += `<p id="day-${index}">${index}</p>`
    }
    
    daysContainer.querySelector(currentDay).classList.toggle('currentDay');
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
    updateCalendar();
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
    updateCalendar();
}

/*---------------------------------------------------------------*/
/*    Helpers                                                    */
/*---------------------------------------------------------------*/
/**
 * Update calendar innerHTML
 */
function updateCalendar(){
    let numberOfDays = getDaysInMonth(currentMonth, currentYear);
    monthContainer.querySelector('h3').innerHTML = month[currentMonth];
    daysContainer.innerHTML = '';

    for (let index = 1; index <= numberOfDays; index++) {
        daysContainer.innerHTML += `<p id="day-${index}">${index}</p>`
    }

    if(currentMonth === currentDate.getMonth() + 1){
        let currentDay = '#day-'+currentDate.getDate();
        daysContainer.querySelector(currentDay).classList.toggle('currentDay');
    }
}

/**
 * Get the number of days in the month
 * @param {Number} month 
 * @param {Number} year 
 */
function getDaysInMonth(month, year){
    return new Date(year, month, 0).getDate();
}