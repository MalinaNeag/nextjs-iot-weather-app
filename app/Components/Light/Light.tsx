"use client";
import React, { useEffect, useState } from "react";
import { MdLightMode } from 'react-icons/md'; // Import the light icon
import { Skeleton } from "@/components/ui/skeleton";
import { database, ref, onValue } from "@/app/utils/firebase"; // Adjusted import path

interface LightDetectionProps {
    className?: string;
}

const LightDetection: React.FC<LightDetectionProps> = ({ className }) => {
    const [light, setLight] = useState<number | null>(null);
    const [isDaytime, setIsDaytime] = useState<boolean | null>(null);

    useEffect(() => {
        // Reference to the light data in Firebase
        const lightRef = ref(database, 'light_detected');
        const timeRef = ref(database, 'current_time');

        // Fetch the light data from Firebase
        onValue(lightRef, (snapshot) => {
            const data = snapshot.val();
            setLight(data);
        });

        // Fetch the current time from Firebase
        onValue(timeRef, (snapshot) => {
            const currentTime = snapshot.val();
            const hours = new Date(currentTime).getHours();
            setIsDaytime(hours >= 6 && hours < 18); // Assuming daytime is between 6 AM and 6 PM
        });
    }, []);

    const getLightText = (light: number, isDaytime: boolean) => {
        if (light === 0) {
            return isDaytime ? "Light detected" : "Artificial light detected";
        } else {
            return "No light detected";
        }
    };

    if (light === null || isDaytime === null) {
        return <Skeleton className="h-[12rem] w-full" />;
    }

    return (
        <div className={`pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none ${className}`}>
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
