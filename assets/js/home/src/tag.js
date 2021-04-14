if(document.querySelector('.addRowModal')){
    var addRowModal = document.querySelector('.addRowModal');
    var AddRowSelectContainer = addRowModal.querySelector('.select-container');
    // Automatically change tag background color for addModal Tag
    AddRowSelectContainer.querySelectorAll('input[type="checkbox"]').forEach(element => {
        var color = element.attributes.color.value;
        // Get the tag element
        var tag = element.parentNode.parentNode.parentNode;
        // Update the tag background color
        tag.style.backgroundColor = color;

        //Prevent checkbox from beeing checked by default
        element.checked = false;
    })
}