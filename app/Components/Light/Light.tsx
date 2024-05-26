"use client";
import React, { useEffect, useState } from "react";
import { MdLightMode } from 'react-icons/md'; // Import the light mode icon
import { Skeleton } from "@/components/ui/skeleton";
import { database, ref, onValue } from "@/app/utils/firebase"; // Firebase utility imports

interface LightDetectionProps {
    className?: string;
}

const LightDetection: React.FC<LightDetectionProps> = ({ className }) => {
    const [light, setLight] = useState<number | null>(null);
    const [isDaytime, setIsDaytime] = useState<boolean | null>(null);

    useEffect(() => {
        const lightRef = ref(database, 'light_detected');
        const timeRef = ref(database, 'current_time');

        onValue(lightRef, (snapshot) => {
            const data = snapshot.val();
            setLight(data);
        });

        // Fetch and determine daytime based on Firebase provided time
        onValue(timeRef, (snapshot) => {
            const timeString = snapshot.val();
            const currentTime = new Date(`2024-01-01T${timeString}:00Z`); // Constructing a valid date-time string
            const hours = currentTime.getHours();
            setIsDaytime(hours >= 6 && hours < 20);
        });
    }, []);

    const getLightText = (light: number, isDaytime: boolean) => {
        if (light > 0) {
            return isDaytime ? "Light detected" : "Artificial light detected";
        } else {
            return "No light detected";
        }
    };

    if (light === null || isDaytime === null) {
        return <Skeleton className={`h-[12rem] w-full ${className}`} />;
    }

    return (
        <div className={`pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 shadow-sm dark:shadow-none ${className} ${light > 0 ? (isDaytime ? "bg-yellow-500" : "bg-orange-500") : "dark:bg-dark-grey"} text-white`}>
            <div className="top">
                <h2 className="flex items-center gap-2 font-medium">
                    <MdLightMode /> Light Detection
                </h2>
            </div>
            <p className="text-sm">{getLightText(light, isDaytime)}.</p>
        </div>
    );
}

export default LightDetection;
