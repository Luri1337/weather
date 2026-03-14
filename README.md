# 🌤 Weather App

A web application for tracking weather in your favourite cities. Search for any location, save it to your personal list, and check the current temperature at any time.

---

## Features

- 🔐 User registration and login with session-based authentication
- 🔍 Search cities by name with autocomplete dropdown
- 💾 Save and manage your personal list of locations
- 🌡 View current weather (temperature, country, coordinates) for any location
- 🚪 Secure logout with session invalidation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring MVC |
| Database | PostgreSQL, Hibernate (JPA) |
| Migrations | Flyway |
| Frontend | Thymeleaf, Bootstrap 5, JavaScript |
| HTTP Client | Spring WebFlux (WebClient) |
| Weather API | OpenWeatherMap |
| Build | Gradle |
| Testing | JUnit 5, MockWebServer, H2 (in-memory) |

---

## Prerequisites

- Java 21+
- PostgreSQL
- Tomcat 10+
- OpenWeatherMap API key — get one free at [openweathermap.org](https://openweathermap.org/api)

---

## Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/Luri1337/weather.git
cd weather
```

**2. Create the database**
```sql
CREATE DATABASE weather;
```

**3. Configure `src/main/resources/application.properties`**
```properties
db.url=jdbc:postgresql://localhost:5432/weather
db.username=your_username
db.password=your_password

weather.api.key=your_openweathermap_api_key
```

**4. Build the project**
```bash
./gradlew build
```

**5. Deploy the generated `.war` file to Tomcat**

The file will be at `build/libs/weather-1.0-SNAPSHOT.war` — copy it to your Tomcat `webapps/` directory and start the server.

---

## Running Tests

Tests use an in-memory H2 database and MockWebServer — no external dependencies needed.

```bash
./gradlew test
```

---

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   ├── config/        # Spring configuration
│   │   ├── controller/    # MVC controllers
│   │   ├── service/       # Business logic
│   │   ├── dao/           # Database access
│   │   ├── model/         # JPA entities
│   │   ├── dto/           # Data transfer objects
│   │   ├── external/      # OpenWeatherMap API client
│   │   └── util/          # Interceptors, validators, exception handlers
│   └── resources/
│       ├── templates/     # Thymeleaf HTML templates
│       ├── static/        # JavaScript
│       └── db/migration/  # Flyway SQL migrations
└── test/
    ├── java/              # Integration tests
    └── resources/         # Test configuration and H2 migrations
```
