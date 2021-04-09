const $ = require('jquery');
import 'webpack-jquery-ui/sortable';

import './src/task';
import './src/sort';
import './src/tag';

/*----------------------------------------------------------------------------------------------*/
// document.querySelectorAll('.table-content').forEach(element => {
//     element.addEventListener('click', addRow);
// })

// var selectRow = [];

// function addRow(){
//     let row = this.parentNode;
//     let index = selectRow.indexOf(row.id);
//     if(index === -1){
//         selectRow.push(row.id);
//         document.getElementById(row.id).classList.add("theme-selected");
//     }else{
//         document.getElementById(row.id).classList.remove("theme-selected");
//         selectRow.splice(index, 1);
//     }
// }
/*----------------------------------------------------------------------------------------------*/