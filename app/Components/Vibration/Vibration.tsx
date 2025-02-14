"use client";
import React, { useEffect, useState } from "react";
import { MdVibration } from 'react-icons/md'; // Import the vibration icon
import { Skeleton } from "@/components/ui/skeleton";
import { database, ref, onValue } from "@/app/utils/firebase"; // Adjusted import path

interface EarthquakeAlertProps {
    className?: string;
}

const EarthquakeAlert: React.FC<EarthquakeAlertProps> = ({ className }) => {
    const [vibration, setVibration] = useState<number | null>(null);

    useEffect(() => {
        // Reference to the vibration data in Firebase
        const vibrationRef = ref(database, 'vibration_detected');

        // Fetch the vibration data from Firebase
        onValue(vibrationRef, (snapshot) => {
            const data = snapshot.val();
            setVibration(data);
        });
    }, []);

    const getVibrationText = (vibration: number) => {
        if (vibration === 0) return "No vibration detected";
        if (vibration === 1) return "Danger: Possible earthquake detected! Take immediate action!";
        return "Unavailable: Vibration data not available";
    };

    if (vibration === null) {
        return <Skeleton className="h-[12rem] w-full" />;
    }

    return (
        <div className={`pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 shadow-sm transition-all duration-500 ease-in-out ${vibration === 1 ? "bg-red-500 text-white" : "bg-green-500 text-white"} ${className}`}>
            <div className="top">
                <h2 className="flex items-center gap-2 font-medium">
                    <MdVibration /> Earthquake Alert
                </h2>
            </div>

            <p className="text-sm">{getVibrationText(vibration)}.</p>
        </div>
    );
}

export default EarthquakeAlert;
