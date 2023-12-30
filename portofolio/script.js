document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault(); 
        simulateSendEmailOrContact();

        // Notify the user
        alert('Email or contact form submitted successfully!');
    });
});

function simulateSendEmailOrContact() {
    console.log('Simulating sending email or contact form...');
}