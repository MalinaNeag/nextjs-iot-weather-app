// src/app/components/Humidity/Humidity.tsx
"use client";
import React, { useEffect, useState } from "react";
import { droplets } from "@/app/utils/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { database, ref, onValue } from "@/app/utils/firebase"; // Adjusted import path

const Humidity: React.FC = () => {
  const [humidity, setHumidity] = useState<number | null>(null);

  useEffect(() => {
    // Reference to the humidity data in Firebase
    const humidityRef = ref(database, 'humidity');

    // Fetch the humidity from Firebase
    onValue(humidityRef, (snapshot) => {
      const data = snapshot.val();
      setHumidity(data);
    });
  }, []);

  const getHumidityText = (humidity: number) => {
    if (humidity < 30) return "Dry: May cause skin irritation";
    if (humidity >= 30 && humidity < 50)
      return "Comfortable: Ideal for health and comfort";
    if (humidity >= 50 && humidity < 70)
      return "Moderate: Sticky, may increase allergens";
    if (humidity >= 70) return "High: Uncomfortable, mold growth risk";
    return "Unavailable: Humidity data not available";
  };

  if (humidity === null) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  return (
      <div className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none">
        <div className="top">
          <h2 className="flex items-center gap-2 font-medium">
            {droplets} Humidity
          </h2>
          <p className="pt-4 text-2xl">{humidity}%</p>
        </div>

        <p className="text-sm">{getHumidityText(humidity)}.</p>
      </div>
  );
}

export default Humidity;
