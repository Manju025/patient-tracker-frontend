async function updateGPS(vehicleNumber, driverName, phone, latitude, longitude) {
    const formData = new FormData();
    formData.append('vehicle_number', vehicleNumber);
    formData.append('driver_name', driverName);
    formData.append('phone', phone);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    try {
        const response = await fetch('../Backend/scripts/gpsupdate.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log(result.message || result.error);
    } catch (error) {
        console.error('Error updating GPS data:', error);
    }
}

// Function to fetch latest GPS data for a specific ambulance
async function fetchLatestGPS(vehicleNumber) {
    try {
        const response = await fetch(`../Backend/scripts/fetchData.php?vehicle_number=${vehicleNumber}`);
        const data = await response.json();

        if (data.latitude && data.longitude) {
            updateMap(data.latitude, data.longitude, data.driver_name, data.phone);
        }
    } catch (error) {
        console.error('Error fetching GPS data:', error);
    }
}

// Function to update the map with the latest GPS coordinates
function updateMap(latitude, longitude, driverName, phone) {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: parseFloat(latitude), lng: parseFloat(longitude) }
    });

    new google.maps.Marker({
        position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        map,
        title: `Driver: ${driverName}, Phone: ${phone}`
    });
}

// Automatically fetch GPS data every 5 seconds
setInterval(() => fetchLatestGPS('XYZ1234'), 5000); // Replace 'XYZ1234' with the vehicle number

function initMap() {
    const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // Example coordinates
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: defaultLocation,
        zoomControl: true,
    });

    const icon = {
        url: "images/ambulance-icon.png", // Customize icon image path
        scaledSize: new google.maps.Size(50, 50),
    };

    new google.maps.Marker({
        position: defaultLocation,
        map,
        icon: icon,
        title: "Ambulance Location",
    });
}
