document.addEventListener("DOMContentLoaded", () => {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 77 },
        zoom: 5,
    });
    const hospitalResults = document.getElementById("hospital-results");
    let userMarker;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            const userLocation = { lat: userLat, lng: userLon };
            map.setCenter(userLocation);
            map.setZoom(14);

            userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                    url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                    scaledSize: new google.maps.Size(40, 40),
                },
                title: "You are here",
            });

            const infoWindow = new google.maps.InfoWindow({
                content: "<b>You are here</b>"
            });
            infoWindow.open(map, userMarker);

            fetchHospitals(userLat, userLon);
        }, error => {
            alert("Enable location to find hospitals near you!");
            console.error(error);
        });
    } else {
        alert("Geolocation not supported");
    }

    function fetchHospitals(lat, lon) {
        const url = `https://patient-tracker-backend.onrender.com/api/hospitals?lat=${lat}&lon=${lon}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const hospitals = data.elements || [];
                if (!hospitals.length) {
                    hospitalResults.innerHTML = "<p>No hospitals found nearby.</p>";
                    return;
                }

                hospitalResults.innerHTML = "";
                hospitals.forEach(hospital => {
                    const { lat, lon, tags } = hospital;
                    const name = tags.name || "Unnamed Hospital";
                    const address = tags["addr:street"] || "Address not available";

                    // Marker
                    const marker = new google.maps.Marker({
                        position: { lat, lng: lon },
                        map: map,
                        icon: {
                            url: "https://cdn-icons-png.flaticon.com/512/3179/3179068.png",
                            scaledSize: new google.maps.Size(35, 35)
                        },
                        title: name
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<b>${name}</b><br>${address}`
                    });
                    marker.addListener("click", () => infoWindow.open(map, marker));

                    // Card in list
                    hospitalResults.innerHTML += `
                        <div class="hospital-card" style="border: 1px solid #ddd; padding: 10px; margin: 10px; border-radius: 8px; background: #f9f9f9;">
                            <h3 style="color: #333;">${name}</h3>
                            <p style="color: #666;">${address}</p>
                            <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}" target="_blank" style="color: #007bff;">View on Map</a>
                        </div>
                    `;
                });
            })
            .catch(err => {
                console.error("Error fetching hospitals:", err);
                hospitalResults.innerHTML = "<p>Failed to load hospital data.</p>";
            });
    }
});
