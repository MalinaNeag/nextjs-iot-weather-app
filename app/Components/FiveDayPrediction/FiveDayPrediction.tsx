"use client";

import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/app/utils/firebase";
import * as tf from "@tensorflow/tfjs";
import Papa from "papaparse";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

const FiveDayPrediction: React.FC = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [predictions, setPredictions] = useState<number[][]>([]);
  const [currentTempC, setCurrentTempC] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<number[]>([]);

  useEffect(() => {
    // Load the TensorFlow.js model
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/path_to_tfjs_model/model.json");
        setModel(loadedModel);
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();

    // Fetch current temperature data from Firebase
    const tempCRef = ref(database, "temperature_c");
    onValue(tempCRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentTempC(data);
      console.log("Current temperature from Firebase:", data);
    });

    // Fetch historical data from CSV
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
            "/api/historicaldata/weather_Timisoara_2014_2024.csv"
        );
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder("utf-8");
        const csvData = decoder.decode(result?.value);
        Papa.parse(csvData, {
          header: true,
          complete: (results: Papa.ParseResult<{ temp: string }>) => {
            const data = results.data;
            const temps = data
                .map((d) => parseFloat(d.temp))
                .filter((temp) => !isNaN(temp));
            setHistoricalData(temps);
            console.log("Historical data fetched successfully");
          },
        });
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
      prediction
          .array()
          .then((predictionArray) => {
            console.log("Prediction array:", predictionArray);
            setPredictions(predictionArray as number[][]);
          })
          .catch((error) => {
            console.error("Error in prediction:", error);
          });
    }
  }, [model, currentTempC, historicalData]);

  const prepareInputData = (
      currentTempC: number,
      historicalData: number[]
  ) => {
    const inputData = [currentTempC, ...historicalData.slice(-9)]; // assuming we use the last 9 historical data points
    console.log("Input data for model:", inputData);
    return tf.tensor2d([inputData]);
  };

  if (
      currentTempC === null ||
      historicalData.length === 0 ||
      predictions.length === 0
  ) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  const getIcon = (temp: number) => {
    if (temp < 0) return "❄️"; // Snow
    if (temp < 15) return "🌧️"; // Rain
    if (temp < 25) return "🌤️"; // Cloudy
    return "☀️"; // Clear sky
  };

  return (
      <div className="pt-6 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none col-span-full sm-2:col-span-2 md:col-span-2 xl:col-span-2">
        <div className="h-full flex gap-10 overflow-hidden">
          {predictions.length < 1 ? (
              <div className="flex justify-center items-center">
                <h1 className="text-[3rem] line-through text-rose-500">
                  No Data Available!
                </h1>
              </div>
          ) : (
              <div className="w-full">
                <div className="forecast-list pt-3">
                  {predictions.map((pred, i) => (
                      <div
                          key={i}
                          className="daily-forecast py-4 flex flex-col justify-evenly border-b-2"
                      >
                        <p className="text-xl min-w-[3.5rem]">
                          {moment().add(i, "days").format("dddd")}
                        </p>
                        <div className="text-sm flex justify-between">
                          <span>(low)</span>
                          <span>(high)</span>
                          <span>(predicted)</span>
                        </div>

                        <div className="flex-1 flex items-center justify-between gap-4">
                          <p className="font-bold">
                            {pred[0].toFixed(2)}°C {getIcon(pred[0])}
                          </p>
                          <div className="temperature flex-1 w-full h-2 rounded-lg"></div>
                          <p className="font-bold">
                            {pred[1].toFixed(2)}°C {getIcon(pred[1])}
                          </p>
                          <div className="temperature flex-1 w-full h-2 rounded-lg"></div>
                          <p className="font-bold">
                            {pred[2].toFixed(2)}°C {getIcon(pred[2])}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default FiveDayPrediction;
