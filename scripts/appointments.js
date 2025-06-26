function openAddAppointmentModal() {
    document.getElementById("appointmentModal").style.display = "flex";
}

function closeAppointmentModal() {
    document.getElementById("appointmentModal").style.display = "none";
}

document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Create FormData object

    fetch("saveAppointment.php", {
        method: "POST",
        body: formData // Send form data
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Appointment saved successfully!");
            closeAppointmentModal();
            // Optionally, you could reload the appointments here
        } else {
            console.error(data.message); // Log the error message to the console
            alert("Error saving appointment: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again.");
    });
});

document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Create FormData object

    // Log form data for debugging
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    // Log that the form is about to be submitted
    console.log("Form submitted");

    fetch("backend/scripts/saveAppointments.php", {
        method: "POST",
        body: formData // Send form data
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Appointment saved successfully!");
            closeAppointmentModal(); // Close the modal
        } else {
            alert("Error saving appointment: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again.");
    });
});

