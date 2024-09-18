import { useCallback, useRef, useState } from "react";
import CameraIcon from "@heroicons/react/24/outline/CameraIcon";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";

import Webcam from "react-webcam";
import Button from "../neomorphic/Button";
import Skeleton from "../Skeleton";

const CameraView = ({ onSnapTaken }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const retake = () => {
    setShowLoader(true);
    setImgSrc(null);
  };

  return (
    <div className="text-center">
      <div className="rounded-lg py-3">
        {!imgSrc ? (
          <>
            <Webcam
              audio={false}
              mirrored={true}
              className={`${
                showLoader ? "h-0" : ""
              } duration-300 transition-all rounded-lg mx-auto`}
              ref={webcamRef}
              screenshotQuality={1}
              videoConstraints={{
                width: 500,
                height: 320,
              }}
              onUserMedia={() => setShowLoader(false)}
              onUserMediaError={() => {
                toast.error("No Camera detected!");
                setShowLoader(true);
              }}
              screenshotFormat="image/jpeg"
            />
            {showLoader && (
              <Skeleton className="mx-auto" height="h-64" width="w-[45vw]" />
            )}
          </>
        ) : (
          <img className="mx-auto rounded-lg" src={imgSrc} />
        )}
      </div>
      {!imgSrc ? (
        <Button onClick={capture} className="gap-2 rounded-full">
          <CameraIcon className="w-6 h-6" />
          Capture
        </Button>
      ) : (
        <div className="gap-2 flex justify-center">
          <Button onClick={retake} className="gap-2 rounded-full">
            <CameraIcon className="w-6 h-6" />
            Retake
          </Button>
          <Button
            type="accent"
            onClick={() => onSnapTaken(imgSrc)}
            className="gap-2 rounded-full"
          >
            <CheckBadgeIcon className="w-6 h-6" />
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
