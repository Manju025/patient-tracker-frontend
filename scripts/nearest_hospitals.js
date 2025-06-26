document.addEventListener("DOMContentLoaded", () => {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 77 }, // Default view over India
        zoom: 5,
    });

    const hospitalResults = document.getElementById("hospital-results");
    let userMarker;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                const userLocation = { lat: userLat, lng: userLon };

                map.setCenter(userLocation);
                map.setZoom(14);

                // Add user marker
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
                    content: "<b>You are here</b>",
                });
                infoWindow.open(map, userMarker);

                // Fetch nearby hospitals
                fetchHospitals(userLocation);
            },
            (error) => {
                console.error("❌ Geolocation error:", error);
                alert("Please enable location to find nearby hospitals.");
            }
        );
    } else {
        alert("❌ Your browser doesn't support Geolocation.");
    }

    function fetchHospitals(location) {
        const service = new google.maps.places.PlacesService(map);

        service.nearbySearch(
            {
                location: location,
                radius: 5000, // 5km
                type: "hospital",
            },
            (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
                    hospitalResults.innerHTML = "<p>No hospitals found nearby.</p>";
                    return;
                }

                hospitalResults.innerHTML = "";

                results.forEach((place) => {
                    const { name, vicinity, geometry } = place;

                    // Add hospital marker
                    const marker = new google.maps.Marker({
                        position: geometry.location,
                        map: map,
                        icon: {
                            url: "https://cdn-icons-png.flaticon.com/512/3179/3179068.png",
                            scaledSize: new google.maps.Size(35, 35),
                        },
                        title: name,
                    });

                    const info = new google.maps.InfoWindow({
                        content: `<b>${name}</b><br>${vicinity}`,
                    });

                    marker.addListener("click", () => info.open(map, marker));

                    // Display in list
                    hospitalResults.innerHTML += `
                        <div class="hospital-card" style="border: 1px solid #ddd; padding: 10px; margin: 10px; border-radius: 8px; background: #f9f9f9;">
                            <h3 style="color: #333;">${name}</h3>
                            <p style="color: #666;">${vicinity}</p>
                            <a href="https://www.google.com/maps/search/?api=1&query=${geometry.location.lat()},${geometry.location.lng()}" target="_blank" style="color: #007bff;">View on Map</a>
                        </div>
                    `;
                });
            }
        );
    }
});
