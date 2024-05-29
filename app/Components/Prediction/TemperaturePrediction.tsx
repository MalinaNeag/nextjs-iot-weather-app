"use client";

import React, { useEffect, useState } from "react";
import * as tf from '@tensorflow/tfjs';
import { database, ref, onValue } from "@/app/utils/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const TemperaturePrediction: React.FC = () => {
  const [predictedTemperature, setPredictedTemperature] = useState<number | null>(null);

  // Load the model and scaler
  const loadModelAndScaler = async () => {
    const model = await tf.loadLayersModel('/models/weather_prediction_model_no_reg/model.json');
    const scalerData = await fetch('/models/scaler.json').then(res => res.json());
    console.log('Model and scaler loaded:', { model, scalerData });
    return { model, scalerData };
  };

  // Fetch current weather data from Firebase
  const getCurrentWeatherData = async () => {
    return new Promise((resolve, reject) => {
      const currentDataRef = ref(database, '/');
      onValue(currentDataRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Current weather data from Firebase:', data);
        resolve(data);
      }, reject);
    });
  };

  // Fetch historical weather data (previous 9 days)
  const getHistoricalWeatherData = async () => {
    // Extracted and assumed historical data from the image and hypothetical values for pressure and humidity
    const historicalData = [
      { temp: 23, pressure: 1012, humidity: 50 },
      { temp: 22, pressure: 1012, humidity: 50 },
      { temp: 23, pressure: 1012, humidity: 50 },
      { temp: 22, pressure: 1012, humidity: 50 },
      { temp: 24, pressure: 1012, humidity: 50 },
      { temp: 24, pressure: 1012, humidity: 50 },
      { temp: 27, pressure: 1012, humidity: 50 },
      { temp: 26, pressure: 1012, humidity: 50 },
      { temp: 26, pressure: 1012, humidity: 50 },
    ];
    return historicalData;
  };

  // Make a prediction using the model
  const makePrediction = async () => {
    try {
      const { model, scalerData } = await loadModelAndScaler();
      const currentData: any = await getCurrentWeatherData();
      const historicalData = await getHistoricalWeatherData();

      // Prepare the input sequence
      const inputSequence = historicalData.map((data) => [
        (data.temp - scalerData.data_min[0]) / (scalerData.data_max[0] - scalerData.data_min[0]),
        (data.pressure - scalerData.data_min[1]) / (scalerData.data_max[1] - scalerData.data_min[1]),
        (data.humidity - scalerData.data_min[2]) / (scalerData.data_max[2] - scalerData.data_min[2]),
      ]);

      // Log the historical data (scaled)
      console.log('Historical data (scaled):', inputSequence);

      // Add the current data to the input sequence
      const currentScaled = [
        (currentData.temperature_c - scalerData.data_min[0]) / (scalerData.data_max[0] - scalerData.data_min[0]),
        (currentData.pressure - scalerData.data_min[1]) / (scalerData.data_max[1] - scalerData.data_min[1]),
        (currentData.humidity - scalerData.data_min[2]) / (scalerData.data_max[2] - scalerData.data_min[2]),
      ];
      inputSequence.push(currentScaled);

      // Log the current data (scaled)
      console.log('Current data (scaled):', currentScaled);

      // Convert input sequence to tensor
      const inputTensor = tf.tensor2d(inputSequence, [inputSequence.length, 3]).reshape([1, 10, 3]);

      // Log the input tensor
      console.log('Input tensor:', inputTensor.toString());

      const prediction = model.predict(inputTensor) as tf.Tensor;

      // Log the raw prediction from the model
      console.log('Raw prediction:', prediction.dataSync());

      const predictedTemperature = prediction.dataSync()[0] * (scalerData.data_max[0] - scalerData.data_min[0]) + scalerData.data_min[0];

      // Log the predicted temperature
      console.log('Predicted temperature:', predictedTemperature);

      setPredictedTemperature(predictedTemperature);
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
    }
  };

  useEffect(() => {
    makePrediction();
  }, []);

  if (predictedTemperature === null) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  return (
      <div className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none">
        <div className="top">
          <h2 className="flex items-center gap-2 font-medium">
            Predicted Temperature
          </h2>
          <p className="pt-4 text-2xl">{predictedTemperature.toFixed(2)}°C</p>
        </div>
      </div>
  );
}

export default TemperaturePrediction;
