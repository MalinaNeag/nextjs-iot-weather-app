"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineWaterDrop } from 'react-icons/md'; // Import the raindrop icon
import { Skeleton } from "@/components/ui/skeleton";
import { database, ref, onValue } from "@/app/utils/firebase"; // Adjusted import path

interface RainProps {
    className?: string;
}

const Rain: React.FC<RainProps> = ({ className }) => {
    const [rainDetected, setRainDetected] = useState<boolean | null>(null);

    useEffect(() => {
        // Reference to the rain data in Firebase
        const rainRef = ref(database, 'rain_detected');

        // Fetch the rain data from Firebase
        onValue(rainRef, (snapshot) => {
            const data = snapshot.val();
            setRainDetected(data);
        });
    }, []);

    const getRainText = (rainDetected: boolean) => {
        if (rainDetected) return "Rain detected: Please take necessary precautions.";
        return "No rain detected";
    };

    if (rainDetected === null) {
        return <Skeleton className={`h-[12rem] w-full ${className}`} />;
    }

    return (
        <div className={`pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 shadow-sm transition-all duration-500 ease-in-out ${rainDetected ? "bg-blue-500 text-white" : "dark:bg-dark-grey text-white"} ${className}`}>
            <div className="top">
                <h2 className="flex items-center gap-2 font-medium">
                    <MdOutlineWaterDrop /> Rain Detection
                </h2>
            </div>

            <p className="text-sm">{getRainText(rainDetected)}.</p>
        </div>
    );
}

export default Rain;

