import axios from "axios";

const API_KEY = "YOUR_OPENWEATHER_API_KEY";
const CITY = "Timisoara";
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;

export const fetchWeather = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};
