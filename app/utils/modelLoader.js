// utils/modelLoader.js
import * as tf from '@tensorflow/tfjs-node';
import joblib from 'joblibjs';

export async function loadModel(path) {
    return await tf.loadLayersModel(tf.io.fileSystem(path));
}

export async function loadScaler(path) {
    return joblib.load(path);
}
