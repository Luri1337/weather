class ForecastService {
    constructor() {
        this.currentTemp = 20;
        this.forecastData = null;
        this.chart = null;
    }

    init(currentTemperature) {
        this.currentTemp = currentTemperature;
        this.generateForecast();
        this.updateUI();
        this.setupEventListeners();
        this.showCurrentTime();
    }

    generateForecast() {
        const now = new Date();
        const currentHour = now.getHours();
        const forecast = [];

        const conditions = [
            { icon: 'bi-sun', name: 'Clear', code: 'clear', color: 'condition-clear', prob: 0.3 },
            { icon: 'bi-cloud-sun', name: 'Partly Cloudy', code: 'partly-cloudy', color: 'condition-partly-cloudy', prob: 0.4 },
            { icon: 'bi-cloud', name: 'Cloudy', code: 'cloudy', color: 'condition-cloudy', prob: 0.2 },
            { icon: 'bi-cloud-rain', name: 'Rain', code: 'rain', color: 'condition-rain', prob: 0.08 },
            { icon: 'bi-cloud-lightning-rain', name: 'Storm', code: 'storm', color: 'condition-storm', prob: 0.02 }
        ];

        const getTemperatureForHour = (hourOffset) => {
            const hour = (currentHour + hourOffset) % 24;

            let baseTemp = hourOffset === 0 ? this.currentTemp : this.currentTemp;
            let adjustment = 0;

            if (hour >= 5 && hour <= 9) {
                adjustment = -3 + (hour - 5) * 0.75;
            } else if (hour > 9 && hour <= 14) {
                adjustment = 0.5 - Math.pow((hour - 12) / 2, 2);
            } else if (hour > 14 && hour <= 18) {
                adjustment = 0 - (hour - 14) * 0.6;
            } else if (hour > 18 && hour <= 22) {
                adjustment = -2 - (hour - 18) * 0.8;
            } else if (hour > 22 || hour < 5) {
                adjustment = -6 + (hour === 23 || hour === 0 ? 0.5 : 0);
            } else {
                adjustment = -4;
            }

            const randomVariation = (Math.random() - 0.5) * 2;

            if (hourOffset === 0) {
                return this.currentTemp;
            }

            let finalTemp;
            if (hourOffset > 0) {
                const prevTemp = hourOffset === 1 ? this.currentTemp : getTemperatureForHour(hourOffset - 1);
                const targetTemp = Math.round(baseTemp + adjustment + randomVariation);

                const maxChange = 2;
                if (Math.abs(targetTemp - prevTemp) > maxChange) {
                    finalTemp = prevTemp + (targetTemp > prevTemp ? maxChange : -maxChange);
                } else {
                    finalTemp = targetTemp;
                }
            } else {
                finalTemp = Math.round(baseTemp + adjustment + randomVariation);
            }

            return finalTemp;
        };

        for (let i = 0; i < 24; i++) {
            const hourOffset = i;
            const hour = (currentHour + hourOffset) % 24;

            const temp = getTemperatureForHour(hourOffset);

            let condition;
            const rand = Math.random();
            let cumulativeProb = 0;

            const daySeed = Math.floor(currentHour / 6);
            const conditionRand = (Math.sin(daySeed + hourOffset * 0.1) + 1) / 2;

            for (const cond of conditions) {
                cumulativeProb += cond.prob;
                let timeAdjustedProb = cond.prob;

                if (cond.code === 'rain' && hour >= 12 && hour <= 17) {
                    timeAdjustedProb *= 1.5;
                }
                if (cond.code === 'clear' && hour >= 8 && hour <= 12) {
                    timeAdjustedProb *= 1.3;
                }
                if (cond.code === 'storm' && hour >= 16 && hour <= 20) {
                    timeAdjustedProb *= 2;
                }

                if (conditionRand < cumulativeProb) {
                    condition = cond;
                    break;
                }
            }

            const feelsLike = this.calculateFeelsLike(temp, condition.code, hour);

            let precipitation;
            switch(condition.code) {
                case 'rain':
                    precipitation = 75 + Math.round(Math.random() * 20);
                    break;
                case 'storm':
                    precipitation = 85 + Math.round(Math.random() * 15);
                    break;
                default:
                    precipitation = Math.round(15 + Math.random() * 20);
            }

            let windSpeed;
            if (condition.code === 'storm') {
                windSpeed = 20 + Math.round(Math.random() * 15);
            } else if (hour >= 12 && hour <= 18) {
                windSpeed = 8 + Math.round(Math.random() * 12);
            } else {
                windSpeed = 5 + Math.round(Math.random() * 8);
            }

            const humidity = this.calculateHumidity(hour, condition.code);

            const uvIndex = hour >= 8 && hour <= 17 ?
                Math.round(1 + (Math.abs(hour - 12.5) / 4.5) * 7) : 1;

            forecast.push({
                hour: hour,
                time: `${hour.toString().padStart(2, '0')}:00`,
                temp: temp,
                feelsLike: feelsLike,
                condition: condition.name,
                conditionCode: condition.code,
                icon: condition.icon,
                colorClass: condition.color,
                precipitation: precipitation,
                windSpeed: windSpeed,
                humidity: humidity,
                uvIndex: uvIndex,
                isCurrent: hourOffset === 0,
                hourOffset: hourOffset
            });
        }

        this.forecastData = forecast;
        return forecast;
    }

    calculateFeelsLike(temp, conditionCode, hour) {
        let feelsLike = temp;

        switch(conditionCode) {
            case 'rain':
                feelsLike -= 1.5;
                break;
            case 'storm':
                feelsLike -= 2;
                break;
            case 'clear':
                if (hour >= 10 && hour <= 16) {
                    feelsLike += 1.5;
                }
                break;
        }

        feelsLike += (Math.random() - 0.5) * 1;

        return Math.round(feelsLike);
    }

    calculateHumidity(hour, conditionCode) {
        let baseHumidity;

        if (hour >= 4 && hour <= 8) {
            baseHumidity = 80;
        } else if (hour >= 12 && hour <= 16) {
            baseHumidity = 55;
        } else {
            baseHumidity = 65;
        }

        switch(conditionCode) {
            case 'rain':
            case 'storm':
                baseHumidity += 15;
                break;
            case 'clear':
                baseHumidity -= 8;
                break;
            case 'cloudy':
                baseHumidity += 8;
                break;
        }

        baseHumidity += Math.round((Math.random() - 0.5) * 10);

        return Math.min(95, Math.max(35, baseHumidity));
    }

    updateUI() {
        if (!this.forecastData) return;

        this.renderHourlyCards();
        this.renderDetailedView();
        this.updateForecastSummary();

        if (this.chart) {
            this.updateChart();
        } else {
            this.initChart();
        }
    }

    renderHourlyCards() {
        const container = $('#hourlyForecast');
        if (!container.length) return;

        const html = this.forecastData.map(hour => `
            <div class="hour-card ${hour.isCurrent ? 'current' : ''}" data-hour="${hour.hour}">
                <div class="hour-time">${hour.time}</div>
                <div class="hour-icon ${hour.colorClass}">
                    <i class="bi ${hour.icon}"></i>
                </div>
                <div class="hour-temp">${hour.temp}°</div>
                <div class="hour-precip">
                    <i class="bi bi-droplet"></i>
                    <span>${hour.precipitation}%</span>
                </div>
            </div>
        `).join('');

        container.html(html);

        setTimeout(() => {
            const currentCard = container.find('.hour-card.current');
            if (currentCard.length) {
                const containerWidth = container.parent().width();
                const cardOffset = currentCard.position().left;
                container.scrollLeft(cardOffset - (containerWidth / 2) + 50);
            }
        }, 100);
    }

    renderDetailedView() {
        const container = $('#detailedForecast');
        if (!container.length) return;

        const html = this.forecastData.map(hour => `
            <div class="detail-row ${hour.isCurrent ? 'current' : ''}" data-hour="${hour.hour}">
                <div class="detail-time">
                    ${hour.time}
                    ${hour.isCurrent ? '<span style="color: var(--primary); margin-left: 5px;">• Now</span>' : ''}
                </div>
                <div class="detail-condition">
                    <i class="bi ${hour.icon} ${hour.colorClass}"></i>
                    <span>${hour.condition}</span>
                </div>
                <div class="detail-temp">${hour.temp}°C</div>
                <div class="detail-feels-like">${hour.feelsLike}°C</div>
                <div class="detail-rain">
                    <span>${hour.precipitation}%</span>
                    <div class="rain-bar">
                        <div class="rain-fill" style="width: ${hour.precipitation}%"></div>
                    </div>
                </div>
                <div class="detail-wind">
                    <i class="bi bi-wind"></i>
                    <span>${hour.windSpeed} km/h</span>
                </div>
            </div>
        `).join('');

        container.html(html);
    }

    updateForecastSummary() {
        if (!this.forecastData || this.forecastData.length === 0) return;

        const maxTemp = Math.max(...this.forecastData.map(h => h.temp));
        const minTemp = Math.min(...this.forecastData.map(h => h.temp));
        const rainHours = this.forecastData.filter(h => h.precipitation > 50).length;

        $('#maxTemp').text(`${maxTemp}°C`);
        $('#minTemp').text(`${minTemp}°C`);
        $('#rainHours').text(`${rainHours} hours`);

        $('#forecastSummary').fadeIn();
    }

    initChart() {
        const ctx = document.getElementById('temperatureChart');
        if (!ctx) return;

        const hours = this.forecastData.map(h => h.time);
        const temps = this.forecastData.map(h => h.temp);
        const feelsLike = this.forecastData.map(h => h.feelsLike);
        const precipitation = this.forecastData.map(h => h.precipitation);

        const currentHourIndex = this.forecastData.findIndex(h => h.isCurrent);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [
                    {
                        label: 'Temperature',
                        data: temps,
                        borderColor: 'rgba(79, 70, 229, 1)',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: (context) => {
                            return context.dataIndex === currentHourIndex ?
                                'rgba(79, 70, 229, 1)' : 'rgba(79, 70, 229, 0.6)';
                        },
                        pointBorderColor: 'white',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Feels Like',
                        data: feelsLike,
                        borderColor: 'rgba(16, 185, 129, 0.7)',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: 'rgba(16, 185, 129, 0.6)'
                    },
                    {
                        label: 'Rain Chance',
                        data: precipitation,
                        type: 'bar',
                        backgroundColor: 'rgba(96, 165, 250, 0.3)',
                        borderColor: 'rgba(96, 165, 250, 0.5)',
                        borderWidth: 1,
                        yAxisID: 'y1',
                        barPercentage: 0.8,
                        categoryPercentage: 0.9
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        titleColor: 'white',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                const datasetLabel = context.dataset.label || '';
                                const value = context.parsed.y;
                                const hourData = this.forecastData[context.dataIndex];

                                if (datasetLabel === 'Rain Chance') {
                                    return `Rain: ${value}%`;
                                } else if (datasetLabel === 'Temperature') {
                                    return `Temp: ${value}°C (${hourData.condition})`;
                                } else {
                                    return `${datasetLabel}: ${value}°C`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            maxRotation: 0,
                            callback: function(value, index) {
                                // Show every 3rd hour label
                                return index % 3 === 0 ? this.getLabelForValue(value) : '';
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            callback: function(value) {
                                return value + '°C';
                            }
                        },
                        min: Math.min(...temps) - 2,
                        max: Math.max(...temps) + 2
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            color: 'rgba(96, 165, 250, 0.7)',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    updateChart() {
        if (!this.chart) return;

        const temps = this.forecastData.map(h => h.temp);
        const feelsLike = this.forecastData.map(h => h.feelsLike);
        const precipitation = this.forecastData.map(h => h.precipitation);

        this.chart.data.datasets[0].data = temps;
        this.chart.data.datasets[1].data = feelsLike;
        this.chart.data.datasets[2].data = precipitation;

        this.chart.options.scales.y.min = Math.min(...temps) - 2;
        this.chart.options.scales.y.max = Math.max(...temps) + 2;

        this.chart.update();
    }

    setupEventListeners() {
        $('[data-view]').on('click', (e) => {
            const view = $(e.currentTarget).data('view');
            this.switchView(view);
        });

        $('#refreshForecast').on('click', () => {
            this.refreshForecast();
        });

        $('#toggleSummary').on('click', () => {
            this.toggleSummary();
        });

        $(document).on('click', '.hour-card', (e) => {
            const hour = $(e.currentTarget).data('hour');
            this.showHourTooltip(hour);
        });
    }

    switchView(view) {
        $('[data-view]').removeClass('active');
        $(`[data-view="${view}"]`).addClass('active');

        $('.forecast-view').hide();

        $(`#${view}View`).fadeIn(300);

        if (view === 'graph' && this.chart) {
            setTimeout(() => {
                this.chart.resize();
            }, 300);
        }
    }

    refreshForecast() {
        const $btn = $('#refreshForecast');
        const originalHtml = $btn.html();

        $btn.html('<i class="bi bi-hourglass-split"></i> Updating...');
        $btn.prop('disabled', true);

        this.generateForecast();
        this.updateUI();

        setTimeout(() => {
            $btn.html('<i class="bi bi-check-circle"></i> Updated!');
            setTimeout(() => {
                $btn.html(originalHtml);
                $btn.prop('disabled', false);
            }, 1000);
        }, 800);
    }

    toggleSummary() {
        const $summary = $('#forecastSummary');
        const $btn = $('#toggleSummary');

        if ($summary.is(':visible')) {
            $summary.slideUp();
            $btn.html('<i class="bi bi-chevron-down"></i> Show Summary');
        } else {
            $summary.slideDown();
            $btn.html('<i class="bi bi-chevron-up"></i> Hide');
        }
    }

    showHourTooltip(hour) {
        const hourData = this.forecastData.find(h => h.hour === hour);
        if (!hourData) return;

        // Create tooltip
        const tooltip = `
            <div class="glass" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    z-index: 9999; padding: 2rem; max-width: 400px; width: 90%; animation: fadeIn 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">${hourData.time}</h4>
                        <div style="color: rgba(255, 255, 255, 0.7);">${hourData.condition}</div>
                    </div>
                    <button type="button" class="btn-close-tooltip" 
                            style="background: none; border: none; color: rgba(255, 255, 255, 0.5); 
                                   font-size: 1.5rem; cursor: pointer;">
                        ×
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div class="glass" style="padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700;">${hourData.temp}°C</div>
                        <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.9rem;">Temperature</div>
                    </div>
                    <div class="glass" style="padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700;">${hourData.feelsLike}°C</div>
                        <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.9rem;">Feels Like</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div style="text-align: center;">
                        <i class="bi bi-droplet" style="color: #60A5FA; font-size: 1.2rem;"></i>
                        <div style="margin-top: 5px; font-weight: 600;">${hourData.precipitation}%</div>
                        <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.8rem;">Rain</div>
                    </div>
                    <div style="text-align: center;">
                        <i class="bi bi-wind" style="color: #10B981; font-size: 1.2rem;"></i>
                        <div style="margin-top: 5px; font-weight: 600;">${hourData.windSpeed} km/h</div>
                        <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.8rem;">Wind</div>
                    </div>
                    <div style="text-align: center;">
                        <i class="bi bi-moisture" style="color: #F59E0B; font-size: 1.2rem;"></i>
                        <div style="margin-top: 5px; font-weight: 600;">${hourData.humidity}%</div>
                        <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.8rem;">Humidity</div>
                    </div>
                </div>
            </div>
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                    background: rgba(0, 0, 0, 0.7); z-index: 9998;"></div>
        `;

        $('body').append(tooltip);

        $('.btn-close-tooltip, .glass + div').on('click', () => {
            $('.glass + div, .glass:has(.btn-close-tooltip)').remove();
        });
    }

    showCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        $('#currentTimeDisplay').text(timeString);
        $('#currentTimeIndicator').fadeIn();
    }
}

$(document).ready(function() {
    setTimeout(() => {
        let currentTemp = 20;

        const tempElement = $('.weather-temp span');
        if (tempElement.length) {
            const tempText = tempElement.text();
            const match = tempText.match(/(-?\d+)/);
            if (match) {
                currentTemp = parseInt(match[0]);
            }
        }

        window.forecastService = new ForecastService();
        window.forecastService.init(currentTemp);

        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                window.forecastService.init(currentTemp);
            };
            document.head.appendChild(script);
        }
    }, 500);
});