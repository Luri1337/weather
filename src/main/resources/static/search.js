document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchCity");
    const resultsBox = document.getElementById("searchResults");

    loadUserLocations();

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        if (query.length < 2) {
            resultsBox.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`/searchLocations?city=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!data.length) {
                resultsBox.innerHTML = `<div class="list-group-item text-muted">No results found</div>`;
                resultsBox.style.display = "block";
                return;
            }

            resultsBox.innerHTML = data.map(loc => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${loc.name}</strong> ${loc.country ? `(${loc.country})` : ''}
                    </div>
                    <div class="d-flex">
                        <form action="/addLocation" method="post" style="margin-right: 5px;">
                            <input type="hidden" name="name" value="${loc.name}">
                            <input type="hidden" name="country" value="${loc.country || ''}">
                            <input type="hidden" name="lat" value="${loc.lat}">
                            <input type="hidden" name="lon" value="${loc.lon}">
                            <button type="submit" class="btn btn-sm btn-success">Add</button>
                        </form>

                        <form action="/weather" method="get">
                            <input type="hidden" name="lat" value="${loc.lat}">
                            <input type="hidden" name="lon" value="${loc.lon}">
                            <button type="submit" class="btn btn-sm btn-info">Weather</button>
                        </form>
                    </div>
                </div>
            `).join("");

            resultsBox.style.display = "block";
        } catch (e) {
            console.error(e);
        }
    });

    async function loadUserLocations() {
        try {
            const response = await fetch('/getUserLocations');
            if (!response.ok) {
                throw new Error('Failed to load user locations');
            }

            const locations = await response.json();
            displayUserLocations(locations);
        } catch (error) {
            console.error('Error loading user locations:', error);
            document.getElementById('userLocationsContainer').innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Failed to load your locations. Please try again later.
                </div>
            `;
        }
    }

    function displayUserLocations(locations) {
        const container = document.getElementById('userLocationsContainer');

        if (!locations || locations.length === 0) {
            container.innerHTML = `
                <p class="text-muted">You don't have any saved locations yet</p>
            `;
            return;
        }

        container.innerHTML = `
            <ul class="list-group">
                ${locations.map(loc => `
                    <li class="list-group-item d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <strong>${loc.name}</strong>
                            <span class="text-muted"> [${loc.lat}, ${loc.lon}]</span>
                        </div>
                        <div class="d-flex">
                            <form action="/weather" method="get" class="me-2">
                                <input type="hidden" name="lat" value="${loc.lat}">
                                <input type="hidden" name="lon" value="${loc.lon}">
                                <button type="submit" class="btn btn-sm btn-info">Weather</button>
                            </form>
                            
                            <form action="/deleteLocation" method="post">
                                <input type="hidden" name="name" value="${loc.name}">
                                <input type="hidden" name="lat" value="${loc.lat}">
                                <input type="hidden" name="lon" value="${loc.lon}">
                                <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                            </form>     
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    document.addEventListener("click", (e) => {
        if (!resultsBox.contains(e.target) && e.target !== input) {
            resultsBox.style.display = "none";
        }
    });
});