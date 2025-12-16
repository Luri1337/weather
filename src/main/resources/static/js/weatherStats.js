
class WeatherStatsGenerator {
    constructor() {
        this.lastUpdateTime = new Date();
        this.weatherHistory = [];
    }

    init(currentTemp, location) {
        if (!currentTemp || !location) return;

        this.currentTemp = Math.round(currentTemp);
        this.location = location;

        this.generateWeatherStats();
        this.updateUserStats();
        this.generateInsights();
        this.startAutoUpdate();
    }

    generateWeatherStats() {
        const temp = this.currentTemp;
        const statsContainer = $('#weatherStats');

        if (!statsContainer.length) return;

        const feelsLike = this.calculateFeelsLike(temp);
        const humidity = this.calculateHumidity(temp);
        const windSpeed = this.calculateWindSpeed(temp, this.location?.country);
        const pressure = this.calculatePressure(temp, humidity);
        const uvIndex = this.calculateUVIndex();
        const visibility = this.calculateVisibility(humidity);

        const stats = [
            {
                title: 'FEELS LIKE',
                value: `${feelsLike}°C`,
                icon: 'bi-thermometer-half',
                color: '#F59E0B',
                description: this.getFeelsLikeDescription(temp, feelsLike)
            },
            {
                title: 'HUMIDITY',
                value: `${humidity}%`,
                icon: 'bi-droplet',
                color: '#60A5FA',
                description: this.getHumidityDescription(humidity)
            },
            {
                title: 'WIND',
                value: `${windSpeed} km/h`,
                icon: 'bi-wind',
                color: '#10B981',
                description: this.getWindDescription(windSpeed)
            },
            {
                title: 'PRESSURE',
                value: `${pressure} hPa`,
                icon: 'bi-speedometer2',
                color: '#8B5CF6',
                description: this.getPressureDescription(pressure)
            },
            {
                title: 'UV INDEX',
                value: uvIndex.toString(),
                icon: 'bi-brightness-high',
                color: '#EF4444',
                description: this.getUVDescription(uvIndex)
            },
            {
                title: 'VISIBILITY',
                value: `${visibility} km`,
                icon: 'bi-eye',
                color: '#A5B4FC',
                description: this.getVisibilityDescription(visibility)
            }
        ];

        const html = stats.map(stat => `
            <div class="stat-item" style="position: relative;">
                <div style="display: flex; align-items: center; justify-content: center; 
                     width: 50px; height: 50px; background: ${stat.color}20; 
                     border-radius: 12px; margin: 0 auto 1rem;">
                    <i class="bi ${stat.icon}" style="color: ${stat.color}; font-size: 1.5rem;"></i>
                </div>
                <div class="stat-value" style="color: ${stat.color};">${stat.value}</div>
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 5px;">
                    ${stat.title}
                </div>
                <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.5);">
                    ${stat.description}
                </div>
            </div>
        `).join('');

        statsContainer.html(html);

        this.updateTimeDisplay();

        this.weatherHistory.push({
            time: new Date(),
            temp: temp,
            feelsLike: feelsLike,
            humidity: humidity,
            windSpeed: windSpeed
        });

        if (this.weatherHistory.length > 10) {
            this.weatherHistory.shift();
        }
    }

    calculateFeelsLike(temp) {
        let feelsLike = temp;

        if (temp < 10) {
            const windSpeed = this.calculateWindSpeed(temp);
            if (windSpeed > 15) {
                feelsLike = temp - Math.min(5, windSpeed / 5);
            }
        }
        else if (temp > 25) {
            const humidity = this.calculateHumidity(temp);
            if (humidity > 60) {
                feelsLike = temp + Math.min(5, (humidity - 60) / 10);
            }
        }

        feelsLike += (Math.random() - 0.5) * 2;

        return Math.round(feelsLike);
    }

    calculateHumidity(temp) {
        let humidity;

        if (temp < 0) {
            humidity = 70 + Math.round(Math.random() * 20);
        } else if (temp < 10) {
            humidity = 60 + Math.round(Math.random() * 25);
        } else if (temp < 20) {
            humidity = 50 + Math.round(Math.random() * 20);
        } else if (temp < 30) {
            humidity = 40 + Math.round(Math.random() * 20);
        } else {
            humidity = 30 + Math.round(Math.random() * 20);
        }

        if (this.location?.country) {
            const country = this.location.country.toLowerCase();
            if (country.includes('ru') || country.includes('kz') || country.includes('by')) {
                humidity -= 10;
            }
            if (country.includes('uk') || country.includes('gb') || country.includes('ie')) {
                humidity += 15;
            }
        }

        return Math.min(100, Math.max(20, humidity));
    }

    calculateWindSpeed(temp, country) {
        let windSpeed;

        if (temp < 0) {
            windSpeed = 15 + Math.round(Math.random() * 20);
        } else if (temp < 15) {
            windSpeed = 10 + Math.round(Math.random() * 15);
        } else {
            windSpeed = 5 + Math.round(Math.random() * 10);
        }

        if (country) {
            const countryLower = country.toLowerCase();
            if (countryLower.includes('kz') || countryLower.includes('ru')) {
                windSpeed += 5;
            }
            if (countryLower.includes('is') || countryLower.includes('dk')) {
                windSpeed += 10;
            }
        }

        const hour = new Date().getHours();
        if (hour >= 12 && hour <= 18) {
            windSpeed += 3;
        }

        return Math.min(50, Math.max(0, windSpeed));
    }

    calculatePressure(temp, humidity) {
        let pressure = 1013;

        if (temp > 20 && humidity > 70) {
            pressure -= 20;
        }
        else if (temp < 5 && humidity < 50) {
            pressure += 15;
        }

        pressure += (Math.random() - 0.5) * 20;

        return Math.round(pressure);
    }

    calculateUVIndex() {
        const now = new Date();
        const hour = now.getHours();
        const month = now.getMonth();

        let uvIndex = 1;

        if (hour >= 10 && hour <= 16) {
            uvIndex += 4;
            if (hour === 12) uvIndex += 2;
        }

        if (month >= 5 && month <= 8) {
            uvIndex += 2;
        }

        uvIndex += Math.round(Math.random() * 2);

        return Math.min(11, Math.max(1, uvIndex));
    }

    calculateVisibility(humidity) {
        let visibility = 20;

        if (humidity > 85) {
            visibility = 5 + Math.random() * 10;
        } else if (humidity > 70) {
            visibility = 10 + Math.random() * 10;
        } else {
            visibility = 15 + Math.random() * 15;
        }

        const hasPrecipitation = Math.random() > 0.7;
        if (hasPrecipitation) {
            visibility *= 0.7;
        }

        return Math.round(visibility);
    }

    updateUserStats() {
        $.get('/getUserLocations', (locations) => {
            const count = locations.length;
            $('#savedLocationsCount').text(count);

            const trend = $('#locationTrend');
            if (count > 0) {
                trend.html('<i class="bi bi-arrow-up text-success"></i> <span>Recently added</span>');
            } else {
                trend.html('<i class="bi bi-plus-circle text-primary"></i> <span>Add your first</span>');
            }
        });

        $('#currentLocationTemp').text(`${this.currentTemp}°C`);

        const condition = this.getWeatherCondition(this.currentTemp);
        $('#weatherCondition').text(condition.name);
        $('#conditionIcon').html(`<i class="bi ${condition.icon}" style="color: ${condition.color};"></i>`);

        const precipChance = this.calculatePrecipitationChance(this.currentTemp);
        $('#precipitationChance').text(`${precipChance}%`);

        const rainTrend = $('#rainTrend');
        if (precipChance > 50) {
            rainTrend.html('<i class="bi bi-cloud-rain text-primary"></i> <span>High chance</span>');
        } else if (precipChance > 20) {
            rainTrend.html('<i class="bi bi-cloud-drizzle text-info"></i> <span>Possible</span>');
        } else {
            rainTrend.html('<i class="bi bi-sun text-warning"></i> <span>Unlikely</span>');
        }

        this.updateTemperatureTrend();
    }

    calculatePrecipitationChance(temp) {
        let chance;

        if (temp > 0 && temp < 15) {
            chance = 30 + Math.random() * 40;
        } else if (temp >= 15 && temp < 25) {
            chance = 20 + Math.random() * 30;
        } else {
            chance = 10 + Math.random() * 20;
        }

        const hour = new Date().getHours();
        if (hour >= 14 && hour <= 18) {
            chance += 15;
        }

        return Math.min(95, Math.max(5, Math.round(chance)));
    }

    getWeatherCondition(temp) {
        const conditions = [
            { min: -50, max: -10, name: 'Freezing', icon: 'bi-snow', color: '#BFDBFE' },
            { min: -10, max: 0, name: 'Very Cold', icon: 'bi-cloud-snow', color: '#93C5FD' },
            { min: 0, max: 10, name: 'Cold', icon: 'bi-cloud', color: '#60A5FA' },
            { min: 10, max: 20, name: 'Cool', icon: 'bi-cloud-sun', color: '#A5B4FC' },
            { min: 20, max: 30, name: 'Warm', icon: 'bi-sun', color: '#FBBF24' },
            { min: 30, max: 40, name: 'Hot', icon: 'bi-thermometer-sun', color: '#F59E0B' },
            { min: 40, max: 50, name: 'Very Hot', icon: 'bi-fire', color: '#EF4444' }
        ];

        const condition = conditions.find(c => temp >= c.min && temp < c.max) ||
            { name: 'Mild', icon: 'bi-cloud-sun', color: '#9CA3AF' };

        return condition;
    }

    updateTemperatureTrend() {
        if (this.weatherHistory.length < 2) {
            $('#tempTrend').html('<i class="bi bi-dash"></i> <span>No trend data</span>');
            return;
        }

        const latest = this.weatherHistory[this.weatherHistory.length - 1];
        const previous = this.weatherHistory[this.weatherHistory.length - 2];

        const change = latest.temp - previous.temp;
        const trend = $('#tempTrend');

        if (change > 1) {
            trend.html(`<i class="bi bi-arrow-up text-success"></i> <span>+${change.toFixed(1)}°C</span>`);
        } else if (change < -1) {
            trend.html(`<i class="bi bi-arrow-down text-danger"></i> <span>${change.toFixed(1)}°C</span>`);
        } else {
            trend.html('<i class="bi bi-dash"></i> <span>Stable</span>');
        }
    }

    generateInsights() {
        const temp = this.currentTemp;

        let tempInsight;
        if (temp < 0) {
            tempInsight = 'Freezing temperatures. Bundle up!';
        } else if (temp < 10) {
            tempInsight = 'Chilly weather. A warm jacket recommended.';
        } else if (temp < 20) {
            tempInsight = 'Cool and comfortable. Light jacket advised.';
        } else if (temp < 30) {
            tempInsight = 'Pleasant temperatures. Perfect for outdoor activities.';
        } else {
            tempInsight = 'Hot conditions. Stay hydrated and avoid peak sun.';
        }
        $('#tempInsight').text(tempInsight);

        setTimeout(() => {
            const windSpeed = parseInt($('.stat-item').eq(2).find('.stat-value').text());
            let windInsight;
            if (windSpeed > 30) {
                windInsight = 'Strong winds. Secure loose objects outdoors.';
            } else if (windSpeed > 20) {
                windInsight = 'Breezy conditions. Lightweight items may blow around.';
            } else if (windSpeed > 10) {
                windInsight = 'Moderate breeze. Pleasant for flying kites.';
            } else {
                windInsight = 'Calm winds. Ideal for outdoor dining.';
            }
            $('#windInsight').text(windInsight);
        }, 100);

        const precipChance = this.calculatePrecipitationChance(temp);
        let rainInsight;
        if (precipChance > 70) {
            rainInsight = 'High chance of rain. Umbrella recommended.';
        } else if (precipChance > 40) {
            rainInsight = 'Possible showers. Keep an umbrella handy.';
        } else {
            rainInsight = 'Low precipitation chance. No umbrella needed.';
        }
        $('#rainInsight').text(rainInsight);
    }

    getFeelsLikeDescription(temp, feelsLike) {
        const diff = feelsLike - temp;
        if (diff > 2) return 'Warmer than actual';
        if (diff < -2) return 'Colder than actual';
        return 'Similar to actual';
    }

    getHumidityDescription(humidity) {
        if (humidity > 80) return 'Very humid';
        if (humidity > 60) return 'Moderate';
        if (humidity > 40) return 'Comfortable';
        return 'Dry';
    }

    getWindDescription(windSpeed) {
        if (windSpeed > 30) return 'Strong wind';
        if (windSpeed > 20) return 'Fresh breeze';
        if (windSpeed > 10) return 'Light breeze';
        return 'Calm';
    }

    getPressureDescription(pressure) {
        if (pressure > 1020) return 'High pressure';
        if (pressure < 1000) return 'Low pressure';
        return 'Normal';
    }

    getUVDescription(uvIndex) {
        if (uvIndex > 8) return 'Very high';
        if (uvIndex > 6) return 'High';
        if (uvIndex > 3) return 'Moderate';
        return 'Low';
    }

    getVisibilityDescription(visibility) {
        if (visibility > 20) return 'Excellent';
        if (visibility > 10) return 'Good';
        if (visibility > 5) return 'Moderate';
        return 'Poor';
    }

    updateTimeDisplay() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        $('#weatherUpdateTime').text(timeString);
        this.lastUpdateTime = now;
    }

    startAutoUpdate() {
        setInterval(() => {
            this.generateWeatherStats();
            this.generateInsights();
        }, 15 * 60 * 1000);

        setInterval(() => {
            const nextUpdate = new Date(this.lastUpdateTime.getTime() + 15 * 60 * 1000);
            const now = new Date();
            const diff = nextUpdate - now;
            const minutes = Math.floor(diff / 60000);

            if (minutes > 0) {
                $('#weatherAutoUpdate').text(`${minutes} min`);
            } else {
                $('#weatherAutoUpdate').text('Updating...');
            }
        }, 60 * 1000);
    }

    refreshStats() {
        this.generateWeatherStats();
        this.generateInsights();
        this.updateTimeDisplay();

        const $refreshBtn = $('#refreshWeatherStats');
        if ($refreshBtn.length) {
            const originalHtml = $refreshBtn.html();
            $refreshBtn.html('<i class="bi bi-hourglass-split"></i> Updating...');

            setTimeout(() => {
                $refreshBtn.html('<i class="bi bi-check-circle"></i> Updated!');
                setTimeout(() => {
                    $refreshBtn.html(originalHtml);
                }, 1000);
            }, 800);
        }
    }
}

$(document).ready(function() {
    setTimeout(() => {
        const tempElement = $('.weather-temp span');
        let currentTemp = 20;

        if (tempElement.length) {
            const tempText = tempElement.text().trim();
            const match = tempText.match(/(-?\d+(?:\.\d+)?)/);
            if (match) {
                currentTemp = parseFloat(match[0]);
            }
        }

        const location = {
            name: $('.weather-info h2 span:first').text().trim(),
            country: $('.weather-info h2 span:last').text().trim()
        };

        window.weatherStats = new WeatherStatsGenerator();
        window.weatherStats.init(currentTemp, location);

        if (!$('#refreshWeatherStats').length) {
            $('.weather-info').append(`
                <div class="text-center mt-3">
                    <button id="refreshWeatherStats" class="btn btn-sm btn-outline">
                        <i class="bi bi-arrow-clockwise"></i> Refresh Weather Details
                    </button>
                </div>
            `);

            $('#refreshWeatherStats').click(() => {
                window.weatherStats.refreshStats();
            });
        }
    }, 1000);
});