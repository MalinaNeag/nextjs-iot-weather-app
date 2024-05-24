import * as tf from '@tensorflow/tfjs';

let model;

export const loadModel = async () => {
if (!model) {
model = await tf.loadLayersModel('/model.json'); // Adjust the path as needed
}
return model;
};
