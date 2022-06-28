import React, { useEffect, useState, useRef } from "react";
import { FC } from "react";
import "../styles.css";
import "./cnn-fashion-mnist.css";

import { tfMin } from "../utils/scripts/tf-min";

import * as tf from "@tensorflow/tfjs";
import LoadingSpinner from "./loading-spinner";

const CNN_Fashion_MNIST: FC = () => {
  const [model, setModel] = useState(false);
  const [clickedButton, setClickedButton] = useState("");
  const [inputsArray, setInputsArray] = useState<Array<number>>([]);
  const [outputsArray, setOutputsArray] = useState<Array<number>>([]);
  const [result, setResult] = useState<string>("");
  const [match, setMatch] = useState<boolean>(false);
  const [loading, setLoading] = useState(false)

  let inputs: number[][] = [];
  let outputs: number[] = [];

  const LOOKUP = [
    "T-shirt",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot",
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasElem, setCanvasElem] = useState<HTMLCanvasElement>();

  const drawImage = async (model: any, digit: any) => {
    console.log('---> before digit ', digit)
    digit = await tf.tensor(digit, [28, 28]).div(255);
    console.log('---> after digit ', digit)
    await tf.browser.toPixels(digit, canvasElem);
    setTimeout(() => {
      evaluate(model);
    }, 5000);
  };

  // Function to take a Tensor and normalize values
  // with respect to each column of values contained in that Tensor.
  function normalize(tensor: any, min: any, max: any) {
    const result = tf.tidy(function () {
      const MIN_VALUES = tf.scalar(min);
      const MAX_VALUES = tf.scalar(max);
      // Now calculate subtract the MIN_VALUE from every value in the Tensor
      // And store the results in a new Tensor.
      const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES);
      // Calculate the range size of possible values.
      const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);
      // Calculate the adjusted values divided by the range size as a new Tensor.
      const NORMALIZED_VALUES = tf.div(TENSOR_SUBTRACT_MIN_VALUE, RANGE_SIZE);
      // Return the important tensors.
      return NORMALIZED_VALUES;
    });
    console.log("---> result", result);
    return result;
  }

  //const evaluate = async (model: any, INPUTS: any) => {
  const evaluate = async (model: any) => {
    console.log("inputs array length", inputs.length);

    const OFFSET = Math.floor(Math.random() * inputs.length);
    let answer = tf.tidy(() => {
      try {
        let newInput = normalize(tf.tensor1d(inputs[OFFSET]), 0, 255);
        let output = model.predict(newInput.expandDims());
        output.print();
        return output.squeeze().argMax();
      } catch (err) {
        console.log("---> err evaluate ", err);
      }
    });

    answer.array().then((index: any) => {
      console.log(index);
      setResult(LOOKUP[index]);
      if (index == outputs[OFFSET]) {
        setMatch(true);
      } else {
        setMatch(false);
      }

      answer.dispose();
      console.log("---> drawing image", "start");
      drawImage(model, inputs[OFFSET]);
      console.log("---> drawing image", "end");
    });
  };

  const train = async (model: any, INPUTS_TENSOR: any, OUTPUTS_TENSOR: any) => {
    // Compile the model with the defined optimizer and specify a loss function to use.
    model.compile({
      optimizer: "adam", // Adam changes the learning rate over time which is useful.
      loss: "categoricalCrossentropy", // As this is a classification problem, dont use MSE.
      metrics: ["accuracy"], // As this is a classifcation problem you can ask to record accuracy in the logs too!
    });

    // Finally do the training itself
    let results = await model.fit(INPUTS_TENSOR, OUTPUTS_TENSOR, {
      shuffle: true, // Ensure data is shuffled again before using each time.
      validationSplit: 0.1,
      batchSize: 512, // Update weights after every 512 examples.
      epochs: 50, // Go over the data 50 times!
      callbacks: { onEpochEnd: logProgress },
    });

    OUTPUTS_TENSOR.dispose();
    INPUTS_TENSOR.dispose();
    setLoading(false)
    //await evaluate(model, inputs);
    await evaluate(model);
  };

  function logProgress(epoch: any, logs: any) {
    console.log("Data for epoch " + epoch, logs);
  }

  const buttonHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const button: HTMLButtonElement = event.currentTarget;
    setClickedButton(button.name);
    setLoading(true)
    try {
      console.log("Starting model", "tf min");
      const response = await fetch("https://cnn-fashion-mnist.herokuapp.com/fashion-mnist-api");
      // const response = await fetch("http://localhost:3000/fashion-mnist-api");
      const data: any = await response.json();
      setInputsArray(data.inputs);
      setOutputsArray(data.outputs);
      inputs = data.inputs;
      outputs = data.outputs;
      // Shuffle the two arrays to remove any order, but do so in the same way so
      // inputs still match outputs indexes.
      tf.util.shuffleCombo(inputs, outputs);
      // Input feature Array is 2 dimensional.
      const INPUTS_TENSOR = normalize(tf.tensor2d(inputs), 0, 255);

      // Output feature Array is 1 dimensional.
      const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(outputs, "int32"), 10);
      // Now actually create and define model architecture.
      const model = tf.sequential();

      model.add(
        tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" })
      );
      model.add(tf.layers.dense({ units: 16, activation: "relu" }));
      model.add(tf.layers.dense({ units: 10, activation: "softmax" }));
      model.summary();

      await train(model, INPUTS_TENSOR, OUTPUTS_TENSOR);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("useEffect", "CNN_Fashion_MNIST");
    tfMin(() => {
      console.log("useEffect tfMin", "loaded tfMin");
      setModel(true);
    });
    console.log("---> drawing canvas", "start");
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("---> canvas null", "returning");
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      console.log("---> cotext null", "returning");
      return;
    }
    setCanvasElem(context.canvas);
    console.log("---> drawing canvas", "end");
  }, []);

  return (
    <div>
      <h1>TensorFlow.js Fashion MNIST classifier</h1>
      <p className="header1">
        This experiment shows how you can use the power of Machine Learning
        directly in your browser to train and use a simple Neural Network with 3
        layers (1 hidden) of the form (32 : 16 : 10) to classify fashion items
        from the Fashion MNIST dataset.
      </p>
      <p>Click Predict button to evaluate the model. See console for even more outputs. The image recyles every 5 seconds.</p>
      <div>
        <div>
          <div>
            <button className="button" onClick={buttonHandler} name="predict">
              Predict
            </button>
          </div>

          <section className="box">
            <h2>Input Image</h2>
            <p>
              Input image is a 28x28 pixel greyscale image from the Fashion
              MNIST dataset - a piece of clothing!
            </p>
            <canvas className="canvas-box" width={28} height={28} ref={canvasRef} />
          </section>

          <section className="box">
            <h2>Prediction</h2>
            <p>
              Below you see what item the trained TensorFlow.js model has
              predicted from the input image.
            </p>
            <p>
              It should get it right most of the time, but of course it's not
              perfect, so there will be times when it doesn't. Red is a wrong
              prediction, Green is a correct one.
            </p>
            <div>
              {result.length < 1 ? (
                <div>
                  <p id="prediction">Training model. Please wait...</p>
                  {loading ? <LoadingSpinner/> : <p></p>}
                  
                </div>
              ) : (
                <p></p>
              )}
            </div>
            <div>
              {match ? (
                <p id="prediction" className="correct">
                  {result}
                </p>
              ) : (
                <p id="prediction" className="wrong">
                  {result}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CNN_Fashion_MNIST;
