document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchCity");
    const resultsBox = document.getElementById("searchResults");

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
                        <strong>${loc.name}</strong> (${loc.country})
                    </div>
                    <div class="d-flex">
                        <form action="/addLocation" method="post" style="margin-right: 5px;">
                            <input type="hidden" name="name" value="${loc.name}">
                            <input type="hidden" name="country" value="${loc.country}">
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

    document.addEventListener("click", (e) => {
        if (!resultsBox.contains(e.target) && e.target !== input) {
            resultsBox.style.display = "none";
        }
    });
});
