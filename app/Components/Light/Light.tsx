"use client";
import React, { useEffect, useState } from "react";
import { MdLightMode } from 'react-icons/md';
import { Skeleton } from "@/components/ui/skeleton";
import { database, ref, onValue } from "@/app/utils/firebase";

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

        onValue(timeRef, (snapshot) => {
            const utcTime = snapshot.val(); // Assuming this is in UTC
            const localTime = new Date(utcTime);
            // Adjust to local timezone, for example, if your timezone is UTC+1
            localTime.setHours(localTime.getUTCHours() + 1); // Adjust the +1 to match your local timezone offset

            const hours = localTime.getHours();
            console.log("Corrected Local Hour:", hours); // Ensure this logs 17 for 5:14 PM local time
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

