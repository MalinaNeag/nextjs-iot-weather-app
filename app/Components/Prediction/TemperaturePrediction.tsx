"use client";

import React, { useEffect, useState } from "react";
import * as tf from '@tensorflow/tfjs';
import { database, ref, onValue } from "@/app/utils/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { thermometer } from "@/app/utils/Icons";

const TemperaturePrediction: React.FC = () => {
  const [predictedTemperatures, setPredictedTemperatures] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState<string[]>([]);

  // Load the model and scaler
  const loadModelAndScaler = async () => {
    const model = await tf.loadLayersModel('/models/weather_prediction_model_no_reg/model.json');
    const scalerData = await fetch('/models/scaler.json').then(res => res.json());
    return { model, scalerData };
  };

  // Fetch current weather data from Firebase
  const getCurrentWeatherData = async () => {
    return new Promise((resolve, reject) => {
      const currentDataRef = ref(database, '/');
      onValue(currentDataRef, (snapshot) => {
        const data = snapshot.val();
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
  const makePredictions = async (days: number) => {
    try {
      const { model, scalerData } = await loadModelAndScaler();
      const currentData: any = await getCurrentWeatherData();
      const historicalData = await getHistoricalWeatherData();

      // Prepare the input sequence
      let inputSequence = historicalData.map((data) => [
        (data.temp - scalerData.data_min[0]) / (scalerData.data_max[0] - scalerData.data_min[0]),
        (data.pressure - scalerData.data_min[1]) / (scalerData.data_max[1] - scalerData.data_min[1]),
        (data.humidity - scalerData.data_min[2]) / (scalerData.data_max[2] - scalerData.data_min[2]),
      ]);

      // Add the current data to the input sequence
      const currentScaled = [
        (currentData.temperature_c - scalerData.data_min[0]) / (scalerData.data_max[0] - scalerData.data_min[0]),
        (currentData.pressure - scalerData.data_min[1]) / (scalerData.data_max[1] - scalerData.data_min[1]),
        (currentData.humidity - scalerData.data_min[2]) / (scalerData.data_max[2] - scalerData.data_min[2]),
      ];
      inputSequence.push(currentScaled);

      let predictions = [];
      for (let i = 0; i < days; i++) {
        const inputTensor = tf.tensor2d(inputSequence, [inputSequence.length, 3]).reshape([1, 10, 3]);
        const prediction = model.predict(inputTensor) as tf.Tensor;
        const predictedTemperature = prediction.dataSync()[0] * (scalerData.data_max[0] - scalerData.data_min[0]) + scalerData.data_min[0];

        predictions.push(predictedTemperature);

        inputSequence = inputSequence.slice(1);
        inputSequence.push([
          (predictedTemperature - scalerData.data_min[0]) / (scalerData.data_max[0] - scalerData.data_min[0]),
          (currentData.pressure - scalerData.data_min[1]) / (scalerData.data_max[1] - scalerData.data_min[1]),
          (currentData.humidity - scalerData.data_min[2]) / (scalerData.data_max[2] - scalerData.data_min[2]),
        ]);
      }

      setPredictedTemperatures(predictions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    makePredictions(5);
    const newDates = [];
    for (let i = 0; i < 5; i++) {
      newDates.push(moment().add(i, 'days').format('dddd, DD MMM'));
    }
    setDates(newDates);
  }, []);

  if (loading) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  return (
      <div
          className="pt-6 pb-5 px-4 flex-1 border rounded-lg flex flex-col
        justify-between dark:bg-dark-grey shadow-sm dark:shadow-none"
      >
        <div>
          <h2 className="flex items-center gap-2 font-medium">
            {thermometer} Our AI Prediction
          </h2>
          <div className="forecast-list pt-3">
            {predictedTemperatures.map((temp, index) => (
                <div
                    key={index}
                    className="py-4 flex justify-between items-center border-b-2"
                >
                  <p className="text-xl font-bold">{temp.toFixed(2)}°C</p>
                  <p className="text-gray-500 text-sm">{dates[index]}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default TemperaturePrediction;
