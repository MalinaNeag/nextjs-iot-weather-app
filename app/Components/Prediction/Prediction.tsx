"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/app/utils/firebase";
import * as tf from "@tensorflow/tfjs";
import { Skeleton } from "@/components/ui/skeleton";

const Prediction: React.FC = () => {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [predictions, setPredictions] = useState<number[][]>([]);
    const [currentTempC, setCurrentTempC] = useState<number | null>(null);
    const [historicalData, setHistoricalData] = useState<number[]>([]);

    useEffect(() => {
        // Load the TensorFlow.js model
        const loadModel = async () => {
            try {
                const loadedModel = await tf.loadLayersModel('/model.json');
                setModel(loadedModel);
                console.log("Model loaded successfully");
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };

        loadModel();

        // Fetch current temperature data from Firebase
        const tempCRef = ref(database, 'temperature_c');
        onValue(tempCRef, (snapshot) => {
            const data = snapshot.val();
            setCurrentTempC(data);
            console.log("Current temperature from Firebase:", data);
        });

        // Fetch historical data
        const fetchHistoricalData = async () => {
            try {
                const response = await fetch('/path-to-historical-data.json'); // replace with actual path
                const data = await response.json();
                setHistoricalData(data);
                console.log("Historical data fetched successfully");
            } catch (error) {
                console.error("Error fetching historical data:", error);
            }
        };

        fetchHistoricalData();
    }, []);

    useEffect(() => {
        if (model && currentTempC !== null && historicalData.length > 0) {
            // Prepare the input data
            const inputData = prepareInputData(currentTempC, historicalData);
            // Predict the future weather
            const prediction = model.predict(inputData) as tf.Tensor;
            prediction.array().then(predictionArray => {
                console.log("Prediction array:", predictionArray);
                setPredictions(predictionArray as number[][]);
            }).catch(error => {
                console.error("Error in prediction:", error);
            });
        }
    }, [model, currentTempC, historicalData]);

    const prepareInputData = (currentTempC: number, historicalData: number[]) => {
        const inputData = [currentTempC, ...historicalData.slice(-9)]; // assuming we use the last 9 historical data points
        console.log("Input data for model:", inputData);
        return tf.tensor2d([inputData]);
    };

    if (currentTempC === null || historicalData.length === 0 || predictions.length === 0) {
        return <Skeleton className="h-[12rem] w-full" />;
    }

    return (
        <div className="pt-6 pb-5 px-4 flex-1 border rounded-lg flex flex-col
        justify-between dark:bg-dark-grey shadow-sm dark:shadow-none">
            <div>
                <h2 className="flex items-center gap-2 font-medium">
                    🌤️ 5-Day Forecast Predictions
                </h2>

                <div className="forecast-list pt-3">
                    {predictions.map((pred, i) => (
                        <div
                            key={i}
                            className="daily-forecast py-4 flex flex-col justify-evenly border-b-2"
                        >
                            <p className="text-xl min-w-[3.5rem]">Day {i + 1}</p>
                            <p className="text-sm flex justify-between">
                                <span>Predicted Temp</span>
                            </p>

                            <div className="flex-1 flex items-center justify-between gap-4">
                                <p className="font-bold">{pred[0].toFixed(2)}°C</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Prediction;
