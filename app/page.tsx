"use client";

import dynamic from "next/dynamic";
import React from "react";
import AirPollution from "./Components/AirPollution/AirPollution";
import DailyForecast from "./Components/DailyForecast/DailyForecast";
import FeelsLike from "./Components/FeelsLike/FeelsLike";
import Humidity from "./Components/Humidity/Humidity";
import Navbar from "./Components/Navbar";
import Pressure from "./Components/Pressure/Pressure";
import Sunset from "./Components/Sunset/Sunset";
import Temperature from "./Components/Temperature/Temperature";
import UvIndex from "./Components/UvIndex/UvIndex";
import Wind from "./Components/Wind/Wind";
import FiveDayForecast from "./Components/FiveDayForecast/FiveDayForecast";
import EarthquakeAlert from "./Components/Vibration/Vibration";
import CarbonMonoxide from "./Components/CarbonMonoxide/CarbonMonoxide";
import Light from "./Components/Light/Light";
import { useGlobalContextUpdate } from "./context/globalContext";
import Rain from "@/app/Components/Rain/Rain";
import TemperaturePrediction from "@/app/Components/Prediction/TemperaturePrediction";

// Dynamically import Mapbox to disable SSR
const Mapbox = dynamic(() => import("./Components/Mapbox/Mapbox"), { ssr: false });

export default function Home() {
  const { setActiveCityCoords } = useGlobalContextUpdate();

  const getClickedCityCords = (lat: number, lon: number) => {
    setActiveCityCoords([lat, lon]);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
      <main className="mx-[1rem] lg:mx-[2rem] xl:mx-[6rem] 2xl:mx-[16rem] m-auto">
        <Navbar />
        <div className="pb-4 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-4 w-full min-w-[18rem] md:w-[35rem]">
            <Temperature />
            <FiveDayForecast />
            <TemperaturePrediction />
          </div>
          <div className="flex flex-col w-full gap-4">
            <div className="instruments grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AirPollution />
              <Sunset />
              <Wind />
              <UvIndex />
              <FeelsLike />
              <Pressure />
              <Humidity />
              <EarthquakeAlert />
              <CarbonMonoxide />
              <Light />
              <Rain />
            </div>
            <DailyForecast />
            <div className="map-container h-[30rem] md:h-[38rem] lg:h-[46rem] flex-1">
              <Mapbox />
            </div>
          </div>
        </div>
      </main>
  );
}
