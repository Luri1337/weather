$(document).ready(function () {
    const $input = $("#searchCity");
    const $resultsBox = $("#searchResults");
    let isSearching = false;
    let currentResults = [];

    if (localStorage.getItem("lastCity")) {
        $input.val(localStorage.getItem("lastCity"));
        $input.addClass('shimmer');
        setTimeout(() => $input.removeClass('shimmer'), 1000);
    }

    loadUserLocations();

    $input.on("input", debounce(async function () {
        const query = $input.val().trim();

        if (isSearching) return;

        if (query === "") {
            hideResults();
            return;
        }

        localStorage.setItem("lastCity", query);

        if (query.length < 2) {
            hideResults();
            return;
        }

        isSearching = true;
        showLoading();

        try {
            const response = await fetch(`/searchLocations?city=${encodeURIComponent(query)}`);
            const data = await response.json();
            currentResults = data;

            if (!data.length) {
                showNoResults();
                return;
            }

            displayResultsWithAnimation(data);

        } catch (err) {
            console.error("Search error:", err);
            showError();
        } finally {
            isSearching = false;
        }
    }, 350));

    $(document).on("click", function (e) {
        if (!$(e.target).closest("#searchResults, #searchCity").length) {
            hideResults();
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            hideResults();
        }
    });

    async function loadUserLocations() {
        try {
            const res = await fetch("/getUserLocations");
            const locations = await res.json();

            $('#userLocationsContainer').addClass('shimmer');
            setTimeout(() => {
                renderLocations(locations);
                $('#userLocationsContainer').removeClass('shimmer');
            }, 500);

        } catch {
            showErrorMessage("Failed to load locations. Please try again.");
        }
    }

    function renderLocations(locations) {
        if (!locations.length) {
            $("#userLocationsContainer").html(`
            <div class="empty-state fade-in">
                <i class="bi bi-geo-alt empty-state-icon"></i>
                <h4>No locations saved yet</h4>
                <p style="margin-top: 10px; color: rgba(255, 255, 255, 0.5);">
                    Search for a city and click "Add" to save it here
                </p>
            </div>
        `);
            return;
        }

        let html = '<div class="locations-grid">';

        locations.forEach((loc, index) => {
            const lat = Math.round(loc.lat * 100) / 100;
            const lon = Math.round(loc.lon * 100) / 100;
            const temp = loc.temp ? Math.round(parseFloat(loc.temp)) : '--';

            html += `
            <div class="location-card fade-in" style="animation-delay: ${index * 0.1}s">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                    <div style="flex: 1; min-width: 200px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <i class="bi bi-geo-alt-fill" style="color: var(--primary); font-size: 1.2rem;"></i>
                            <strong style="font-size: 1.2rem; word-break: break-word;">${loc.name}</strong>
                        </div>
                        <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.85rem; margin-top: 5px;">
                            <i class="bi bi-geo"></i> ${lat.toFixed(2)}, ${lon.toFixed(2)}
                        </div>
                    </div>
                    <div class="location-actions" style="display: flex; gap: 8px; flex-shrink: 0;">
                        <form action="/weather" method="get" style="display: inline;">
                            <input type="hidden" name="lat" value="${loc.lat}">
                            <input type="hidden" name="lon" value="${loc.lon}">
                            <button class="btn btn-primary btn-sm" type="submit">
                                <i class="bi bi-cloud-sun"></i> <span class="btn-text">Weather</span>
                            </button>
                        </form>
                        <form action="/deleteLocation" method="post" style="display: inline;">
                            <input type="hidden" name="name" value="${loc.name}">
                            <input type="hidden" name="lat" value="${loc.lat}">
                            <input type="hidden" name="lon" value="${loc.lon}">
                            <button class="btn btn-danger btn-sm" type="submit">
                                <i class="bi bi-trash"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        });

        html += '</div>';
        $("#userLocationsContainer").html(html);
    }

    function displayResultsWithAnimation(locations) {
        const isMobile = window.innerWidth <= 480;

        const html = locations.map((loc, index) => {
            if (isMobile) {
                return `
                    <div class="result-item" style="animation-delay: ${index * 0.05}s; padding: 12px 15px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="width: 36px; height: 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                    border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="bi bi-buildings" style="color: white; font-size: 1rem;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 1rem; margin-bottom: 2px;">${loc.name}</div>
                                <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.85rem;">
                                    ${loc.country || ''}
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <form action="/addLocation" method="post" style="display: inline; flex: 1;">
                                <input type="hidden" name="name" value="${loc.name}">
                                <input type="hidden" name="country" value="${loc.country || ''}">
                                <input type="hidden" name="lat" value="${loc.lat}">
                                <input type="hidden" name="lon" value="${loc.lon}">
                                <button class="btn btn-success btn-sm" type="submit" style="width: 100%;">
                                    <i class="bi bi-plus-circle"></i> Add
                                </button>
                            </form>
                            <form action="/weather" method="get" style="display: inline; flex: 1;">
                                <input type="hidden" name="lat" value="${loc.lat}">
                                <input type="hidden" name="lon" value="${loc.lon}">
                                <button class="btn btn-primary btn-sm" type="submit" style="width: 100%;">
                                    <i class="bi bi-arrow-right-circle"></i> View
                                </button>
                            </form>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="result-item" style="animation-delay: ${index * 0.05}s">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                    border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="bi bi-buildings" style="color: white; font-size: 1.2rem;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 3px;">${loc.name}</div>
                                <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.9rem;">
                                    ${loc.country || ''} • ${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; flex-shrink: 0;">
                            <form action="/addLocation" method="post" style="display: inline;">
                                <input type="hidden" name="name" value="${loc.name}">
                                <input type="hidden" name="country" value="${loc.country || ''}">
                                <input type="hidden" name="lat" value="${loc.lat}">
                                <input type="hidden" name="lon" value="${loc.lon}">
                                <button class="btn btn-success btn-sm" type="submit">
                                    <i class="bi bi-plus-circle"></i> Add
                                </button>
                            </form>
                            <form action="/weather" method="get" style="display: inline;">
                                <input type="hidden" name="lat" value="${loc.lat}">
                                <input type="hidden" name="lon" value="${loc.lon}">
                                <button class="btn btn-primary btn-sm" type="submit">
                                    <i class="bi bi-arrow-right-circle"></i> View
                                </button>
                            </form>
                        </div>
                    </div>
                `;
            }
        }).join("");

        $resultsBox.html(html).slideDown(300);

        if (isMobile) {
            const inputRect = $input[0].getBoundingClientRect();
            const availableHeight = window.innerHeight - inputRect.bottom - 20;
            $resultsBox.css({
                'max-height': Math.min(350, availableHeight) + 'px',
                'position': 'fixed',
                'left': '10px',
                'right': '10px',
                'top': inputRect.bottom + 'px'
            });
        }

        if (!isMobile) {
            $('.result-item').hover(
                function() {
                    $(this).css('transform', 'translateX(8px)');
                },
                function() {
                    $(this).css('transform', 'translateX(0)');
                }
            );
        }
    }

    function showLoading() {
        $resultsBox.html(`
            <div class="result-item" style="text-align: center; padding: 2rem;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <div style="color: rgba(255, 255, 255, 0.6);">Searching locations...</div>
            </div>
        `).slideDown(300);
    }

    function showNoResults() {
        $resultsBox.html(`
            <div class="result-item" style="text-align: center; padding: 2rem;">
                <i class="bi bi-search" style="font-size: 2rem; color: rgba(255, 255, 255, 0.3); margin-bottom: 1rem;"></i>
                <div style="color: rgba(255, 255, 255, 0.6);">No locations found</div>
                <div style="font-size: 0.9rem; margin-top: 5px; color: rgba(255, 255, 255, 0.4);">
                    Try a different search term
                </div>
            </div>
        `).slideDown(300);
    }

    function showError() {
        $resultsBox.html(`
            <div class="result-item" style="text-align: center; padding: 2rem; color: var(--danger);">
                <i class="bi bi-exclamation-triangle-fill" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <div>Search temporarily unavailable</div>
                <div style="font-size: 0.9rem; margin-top: 5px;">Please try again later</div>
            </div>
        `).slideDown(300);
    }

    function showErrorMessage(message) {
        $('#userLocationsContainer').html(`
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle empty-state-icon" style="color: var(--danger);"></i>
                <h4>${message}</h4>
                <button class="btn btn-primary btn-sm mt-3" onclick="loadUserLocations()">
                    <i class="bi bi-arrow-clockwise"></i> Retry
                </button>
            </div>
        `);
    }

    function hideResults() {
        $resultsBox.slideUp(200, function() {
            $resultsBox.css({
                'position': '',
                'left': '',
                'right': '',
                'top': ''
            });
        });
    }

    function debounce(fn, delay) {
        let timer;
        return function () {
            clearTimeout(timer);

            if ($input.val().trim().length > 1) {
                $input.css('border-color', 'var(--primary)');
            }

            timer = setTimeout(() => {
                $input.css('border-color', 'rgba(255, 255, 255, 0.1)');
                fn();
            }, delay);
        };
    }

    $(document).on('submit', 'form', function(e) {
        const $form = $(this);
        const $button = $form.find('button[type="submit"]');
        const originalText = $button.html();

        if ($form.attr('action').includes('/addLocation')) {
            e.preventDefault();

            $button.html('<i class="bi bi-hourglass-split"></i> Adding...');
            $button.prop('disabled', true);

            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
                success: function(response) {
                    $button.html('<i class="bi bi-check-circle"></i> Added!');
                    $button.removeClass('btn-success').addClass('btn-primary');

                    hideResults();

                    $input.val('');

                    setTimeout(() => {
                        loadUserLocations();
                        $button.html(originalText);
                        $button.prop('disabled', false);
                        $button.removeClass('btn-primary').addClass('btn-success');
                    }, 1000);
                },
                error: function() {
                    $button.html('<i class="bi bi-x-circle"></i> Error');
                    $button.removeClass('btn-success').addClass('btn-danger');

                    setTimeout(() => {
                        $button.html(originalText);
                        $button.prop('disabled', false);
                        $button.removeClass('btn-danger').addClass('btn-success');
                    }, 1500);
                }
            });
        }
    });

    $(window).on('resize', function() {
        if ($resultsBox.is(':visible') && currentResults.length > 0) {
            displayResultsWithAnimation(currentResults);
        }
    });

    $input.on('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}