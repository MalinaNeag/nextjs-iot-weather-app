// src/app/components/Temperature/Temperature.tsx
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

  const [temp, setTemp] = useState<number | null>(null);
  const [localTime, setLocalTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");

  useEffect(() => {
    // Reference to the temperature data in Firebase
    const tempRef = ref(database, 'temperature_c');

    // Fetch the current temperature in Celsius from Firebase
    onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      setTemp(data);
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

  if (!forecast || !weather || temp === null) {
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
          <span className="font-medium">{localTime}</span>
        </p>
        <p className="pt-2 font-bold flex gap-1">
          <span>{name}</span>
          <span>{navigation}</span>
        </p>
        <p className="py-10 text-9xl font-bold self-center">{temp}°</p>

        <div>
          <div>
            <span>{getIcon()}</span>
            <p className="pt-2 capitalize text-lg font-medium">{description}</p>
          </div>
        </div>
      </div>
  );
}

export default Temperature;
