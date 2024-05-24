"use client";
import AirPollution from "./Components/AirPollution/AirPollution";
import DailyForecast from "./Components/DailyForecast/DailyForecast";
import FeelsLike from "./Components/FeelsLike/FeelsLike";
import Humidity from "./Components/Humidity/Humidity";
import Mapbox from "./Components/Mapbox/Mapbox";
import Navbar from "./Components/Navbar";
import Population from "./Components/Population/Population";
import Pressure from "./Components/Pressure/Pressure";
import Sunset from "./Components/Sunset/Sunset";
import Temperature from "./Components/Temperature/Temperature";
import UvIndex from "./Components/UvIndex/UvIndex";
import Visibility from "./Components/Visibility/Visibility";
import Wind from "./Components/Wind/Wind";
import FiveDayForecast from "./Components/FiveDayForecast/FiveDayForecast";
import Vibration from "./Components/Vibration/Vibration";
import CarbonMonoxide from "./Components/CarbonMonoxide/CarbonMonoxide";
import { useGlobalContextUpdate } from "./context/globalContext";

export default function Home() {
  const { setActiveCityCoords } = useGlobalContextUpdate();

  const getClickedCityCords = (lat: number, lon: number) => {
    setActiveCityCoords([lat, lon]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
      <main className="mx-[1rem] lg:mx-[2rem] xl:mx-[6rem] 2xl:mx-[16rem] m-auto">
        <Navbar />
        <div className="pb-4 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-4 w-full min-w-[18rem] md:w-[35rem]">
            <Temperature />
            <FiveDayForecast />
          </div>
          <div className="flex flex-col w-full">
            <div className="instruments grid h-full gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AirPollution />
              <Sunset />
              <Wind />
              <UvIndex />
              <Population />
              <FeelsLike />
              <Humidity />
              <Visibility />
              <Pressure />
              <Vibration />
              <CarbonMonoxide />
              <DailyForecast className="col-span-2" />
            </div>
            <div className="mapbox-con mt-4 flex gap-4">
              <Mapbox />
            </div>
          </div>
        </div>
      </main>
  );
}
