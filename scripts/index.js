document.addEventListener('DOMContentLoaded', function() {
    // Function to navigate to different pages
    function goToPage(page) {
        window.location.href = page;
    }

    // Role Selection Navigation
    const roleCards = document.querySelectorAll('.card');
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                goToPage(page);
            }
        });
    });

    // SOS Button Toggle
    const sosButton = document.querySelector('.sos-btn');
    const sosOptions = document.querySelector('.sos-options');

    sosButton.addEventListener('click', function() {
        if (sosOptions.style.display === 'block') {
            sosOptions.style.display = 'none';
        } else {
            sosOptions.style.display = 'block';
        }
    });

    // SOS Options Navigation
    const sosOptionButtons = document.querySelectorAll('.sos-options button');
    sosOptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                goToPage(page);
            }
        });
    });

    // Bed options navigation
    const bedOptions = document.querySelectorAll('.bed-option');
    bedOptions.forEach(bedOption => {
        bedOption.addEventListener('click', function(){
            const page = this.getAttribute('data-page');
            if(page){
                goToPage(page);
            }
        });
    });

    // bed booking button navigation
    const bedBookingButton = document.querySelector('.bed-booking-btn');
    bedBookingButton.addEventListener('click', function(){
        const page = this.getAttribute('data-page');
        if(page){
            goToPage(page);
        }
    });

    // Ambulance buttons navigation
    const ambulanceButtons = document.querySelectorAll('.ambulance-btn');
    ambulanceButtons.forEach(ambulanceButton => {
        ambulanceButton.addEventListener('click', function(){
            const page = this.getAttribute('data-page');
            if(page){
                goToPage(page);
            }
        });
    });

});