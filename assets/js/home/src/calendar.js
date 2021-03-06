function createCalendarSelector(){
    var content = `<div class="calendar-container small-calendar-container">
                        <section class="calendar-header">
                            <span id="last-month">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                                </svg>
                            </span>
                            <h3></h3>
                            <span id="next-month">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </span>
                        </section>
                        <section class="calendar-weekdays">
                            <p>Lun</p>
                            <p>Mar</p>
                            <p>Mer</p>
                            <p>Jeu</p>
                            <p>Ven</p>
                            <p>Sam</p>
                            <p>Dim</p>
                        </section>
                        <section class="calendar-days-display"></section>
                    </div>`;
    return content;
}

export { createCalendarSelector }