const month = { 1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'}
var currentDate = new Date();

var monthContainer = document.querySelector('.calendar-header');
var weekDaysContainer = document.querySelector('.calendar-weekdays');
var daysContainer = document.querySelector('.calendar-days');

/**
 * Start
 */
init();


/**
 * Initialization actions
 */
function init() {
    let currentMonthIndex = currentDate.getMonth();
    let numberOfDays = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    let currentDay = '#day-'+currentDate.getDay();

    monthContainer.innerHTML = `<h3>${month[currentMonthIndex]}</h3>`;
    for (let index = 1; index <= numberOfDays; index++) {
        daysContainer.innerHTML += `<p id="day-${index}">${index}</p>`
        
    }
    
    daysContainer.querySelector(currentDay).style.backgroundColor = "#2A0C4E";
}

function getDaysInMonth(month, year){
    return new Date(year, month, 0).getDate();
}