"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import {
  clearSky,
  cloudy,
  drizzleIcon,
  navigation,
  rain,
  snow,
} from "@/app/utils/Icons";
import moment from "moment";
import { database, ref, onValue } from "@/app/utils/firebase"; // Adjusted import path

const Temperature: React.FC = () => {
  const { forecast } = useGlobalContext();
  const timezone = forecast?.timezone;
  const name = forecast?.name;
  const weather = forecast?.weather;

  const [tempC, setTempC] = useState<number | null>(null);
  const [tempK, setTempK] = useState<number | null>(null);
  const [tempF, setTempF] = useState<number | null>(null);
  const [tempR, setTempR] = useState<number | null>(null);
  const [localTime, setLocalTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Reference to the temperature data in Firebase
    const tempCRef = ref(database, 'temperature_c');
    const tempKRef = ref(database, 'temperature_k');
    const tempFRef = ref(database, 'temperature_f');
    const tempRRef = ref(database, 'temperature_r');
    const dateRef = ref(database, 'date'); // Reference to the date data in Firebase

    // Fetch the temperatures from Firebase
    onValue(tempCRef, (snapshot) => {
      const data = snapshot.val();
      setTempC(data);
    });

    onValue(tempKRef, (snapshot) => {
      const data = snapshot.val();
      setTempK(data);
    });

    onValue(tempFRef, (snapshot) => {
      const data = snapshot.val();
      setTempF(data);
    });

    onValue(tempRRef, (snapshot) => {
      const data = snapshot.val();
      setTempR(data);
    });

    // Fetch the current date from Firebase
    onValue(dateRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentDate(data);
    });
  }, []);

  // Live time update
  useEffect(() => {
    if (timezone) {
      // Update time every second
      const interval = setInterval(() => {
        const localMoment = moment().utcOffset(timezone / 60);
        // Custom format: 24 hour format
        const formattedTime = localMoment.format("HH:mm:ss");
        // Day of the week
        const day = localMoment.format("dddd");

        setLocalTime(formattedTime);
        setCurrentDay(day);
      }, 1000);

      // Clear interval
      return () => clearInterval(interval);
    }
  }, [timezone]);

  if (!forecast || !weather || tempC === null || tempK === null || tempF === null || tempR === null) {
    return <div>Loading...</div>;
  }

  const { main: weatherMain, description } = weather[0];

  const getIcon = () => {
    switch (weatherMain) {
      case "Drizzle":
        return drizzleIcon;
      case "Rain":
        return rain;
      case "Snow":
        return snow;
      case "Clear":
        return clearSky;
      case "Clouds":
        return cloudy;
      default:
        return clearSky;
    }
  };

  return (
      <div
          className="pt-6 pb-5 px-4 border rounded-lg flex flex-col
      justify-between dark:bg-dark-grey shadow-sm dark:shadow-none"
      >
        <p className="flex justify-between items-center">
          <span className="font-medium">{currentDay}</span>
          <div className="text-right">
            <span className="font-medium block">{localTime}</span>
            <span className="text-sm block">{currentDate}</span>
          </div>
        </p>
        <p className="pt-2 font-bold flex gap-1">
          <span>{name}</span>
          <span>{navigation}</span>
        </p>
        <p className="py-6 text-7xl font-bold self-center">{tempC.toFixed(1)}°C</p>
        <p className="text-center">
          <small className="text-sm">{tempK.toFixed(2)}K</small> | <small className="text-sm">{tempF.toFixed(2)}°F</small> | <small className="text-sm">{tempR.toFixed(2)}°R</small>
        </p>

        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl">{getIcon()}</span>
            <p className="pt-2 capitalize text-lg font-medium">{description}</p>
          </div>
        </div>
      </div>
  );
}

export default Temperature;

/*
"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import {
  clearSky,
  cloudy,
  drizzleIcon,
  navigation,
  rain,
  snow,
} from "@/app/utils/Icons";
import moment from "moment";
import { database, ref, onValue } from "@/app/utils/firebase";
import { getWeatherBackgroundColor } from "@/app/utils/weatherColors";
import {fetchWeather} from "@/app/api/weather/fetchWeather";

const Temperature: React.FC = () => {
  const { forecast } = useGlobalContext();
  const timezone = forecast?.timezone;
  const name = forecast?.name;
  const weather = forecast?.weather;

  const [tempC, setTempC] = useState<number | null>(null);
  const [tempK, setTempK] = useState<number | null>(null);
  const [tempF, setTempF] = useState<number | null>(null);
  const [tempR, setTempR] = useState<number | null>(null);
  const [localTime, setLocalTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("linear-gradient(135deg, #2c3e50, #bdc3c7)");

  useEffect(() => {
    // Fetch the current weather and update background color
    const updateBackground = async () => {
      const weatherData = await fetchWeather();
      if (weatherData) {
        const weatherMain = weatherData.weather[0].main;
        const bgColor = getWeatherBackgroundColor(weatherMain);
        setBackgroundColor(bgColor);
      }
    };

    updateBackground();

    // Reference to the temperature data in Firebase
    const tempCRef = ref(database, 'temperature_c');
    const tempKRef = ref(database, 'temperature_k');
    const tempFRef = ref(database, 'temperature_f');
    const tempRRef = ref(database, 'temperature_r');
    const dateRef = ref(database, 'date'); // Reference to the date data in Firebase

    // Fetch the temperatures from Firebase
    onValue(tempCRef, (snapshot) => {
      const data = snapshot.val();
      setTempC(data);
    });

    onValue(tempKRef, (snapshot) => {
      const data = snapshot.val();
      setTempK(data);
    });

    onValue(tempFRef, (snapshot) => {
      const data = snapshot.val();
      setTempF(data);
    });

    onValue(tempRRef, (snapshot) => {
      const data = snapshot.val();
      setTempR(data);
    });

    // Fetch the current date from Firebase
    onValue(dateRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentDate(data);
    });
  }, []);

  // Live time update
  useEffect(() => {
    if (timezone) {
      // Update time every second
      const interval = setInterval(() => {
        const localMoment = moment().utcOffset(timezone / 60);
        // Custom format: 24 hour format
        const formattedTime = localMoment.format("HH:mm:ss");
        // Day of the week
        const day = localMoment.format("dddd");

        setLocalTime(formattedTime);
        setCurrentDay(day);
      }, 1000);

      // Clear interval
      return () => clearInterval(interval);
    }
  }, [timezone]);

  if (!forecast || !weather || tempC === null || tempK === null || tempF === null || tempR === null) {
    return <div>Loading...</div>;
  }

  const { main: weatherMain, description } = weather[0];

  const getIcon = () => {
    switch (weatherMain) {
      case "Drizzle":
        return drizzleIcon;
      case "Rain":
        return rain;
      case "Snow":
        return snow;
      case "Clear":
        return clearSky;
      case "Clouds":
        return cloudy;
      default:
        return clearSky;
    }
  };

  return (
      <div
          className="pt-6 pb-5 px-4 border rounded-lg flex flex-col justify-between shadow-lg"
          style={{
            background: backgroundColor,
            color: "#ffffff",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}
      >
        <p className="flex justify-between items-center">
          <span className="font-medium">{currentDay}</span>
          <div className="text-right">
            <span className="font-medium block">{localTime}</span>
            <span className="text-sm block">{currentDate}</span>
          </div>
        </p>
        <p className="pt-2 font-bold flex gap-1">
          <span>{name}</span>
          <span>{navigation}</span>
        </p>
        <p className="py-6 text-7xl font-bold self-center">{tempC.toFixed(1)}°C</p>
        <p className="text-center">
          <small className="text-sm">{tempK.toFixed(2)}K</small> | <small className="text-sm">{tempF.toFixed(2)}°F</small> | <small className="text-sm">{tempR.toFixed(2)}°R</small>
        </p>

        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl">{getIcon()}</span>
            <p className="pt-2 capitalize text-lg font-medium">{description}</p>
          </div>
        </div>
      </div>
  );
}

export default Temperature;
*/
