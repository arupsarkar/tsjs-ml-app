import { FC } from "react";
import "./cnn-fashion-mnist.css";

export const LoadingSpinner: FC = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
