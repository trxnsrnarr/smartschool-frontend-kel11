import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { toast } from "react-hot-toast";

const LoadingProgress = ({
  progress = 0,
  loadingText = "Sedang mengupload file",
  successText = "Berhasil mengupload file"
}) => {
  progress = parseInt(progress);

  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      setShowComponent(true);
    } else if (progress === 100 || progress === 0) {
      setTimeout(() => {
        setShowComponent(false);
      }, 1000);
    }
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      toast.success(successText, {
        position: "top-right",
        duration: 3000
      });
    }
  }, [progress]);

  return (
    <div className={`my-progress-bar ${showComponent ? "active" : "hide"}`}>
      <div className="d-flex align-items-center justify-content-between">
        <CircularProgressbar value={progress} text={`${progress}%`} />
        <div>{loadingText}</div>
      </div>
    </div>
  );
};

export default LoadingProgress;
