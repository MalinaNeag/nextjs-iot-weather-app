"use client";
import React, { useEffect, useState } from "react";
import { MdLocalFireDepartment } from 'react-icons/md';
import { Skeleton } from "@/components/ui/skeleton";
import { database, ref, onValue } from "@/app/utils/firebase";

interface CarbonMonoxideProps {
  className?: string;
}

const CarbonMonoxide: React.FC<CarbonMonoxideProps> = ({ className }) => {
  const [coDetected, setCODetected] = useState<boolean | null>(null);

  useEffect(() => {
    // Reference to the CO detection data in Firebase
    const coRef = ref(database, 'co_detected');

    // Fetch the CO detection data from Firebase
    onValue(coRef, (snapshot) => {
      const data = snapshot.val();
      setCODetected(data);
    });
  }, []);

  const getCODetectionText = (coDetected: boolean) => {
    if (coDetected === true) return "Danger: High levels of carbon monoxide detected! Evacuate immediately!";
    if (coDetected === false) return "No carbon monoxide detected";
    return "Unavailable: Carbon monoxide detection data not available";
  };

  if (coDetected === null) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  return (
      <div className={`pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none ${className}`}>
        <div className="top">
          <h2 className="flex items-center gap-2 font-medium">
            <MdLocalFireDepartment /> Fire Alert
          </h2>
        </div>

        <p className={`text-sm ${coDetected === true ? "text-red-500" : ""}`}>{getCODetectionText(coDetected)}.</p>
      </div>
  );
}

export default CarbonMonoxide;
