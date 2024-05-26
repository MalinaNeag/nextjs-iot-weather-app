export const getWeatherBackgroundColor = (weatherMain: string) => {
    switch (weatherMain) {
        case "Clear":
            return "linear-gradient(135deg, #87CEEB, #ffffff)"; // Clear sky
        case "Clouds":
            return "linear-gradient(135deg, #B0C4DE, #ffffff)"; // Cloudy
        case "Rain":
        case "Drizzle":
            return "linear-gradient(135deg, #5F9EA0, #ffffff)"; // Rainy
        case "Thunderstorm":
            return "linear-gradient(135deg, #2F4F4F, #ffffff)"; // Stormy
        case "Snow":
            return "linear-gradient(135deg, #ADD8E6, #ffffff)"; // Snowy
        case "Mist":
        case "Fog":
            return "linear-gradient(135deg, #778899, #ffffff)"; // Misty
        default:
            return "linear-gradient(135deg, #2c3e50, #bdc3c7)"; // Default
    }
};
