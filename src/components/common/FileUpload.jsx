import React, { useEffect, useState } from "react";
import apiEnv from "../../env";
import { useSelector } from "react-redux";
import PaperClipIcon from "@heroicons/react/20/solid/PaperClipIcon";
import HoverIcon from "./HoverIcon";
import { toast } from "react-toastify";

function FileUpload() {
  const { sessionToken } = useSelector((state) => state.authSlice);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    apiEnv.host;
    fetch(apiEnv.host + "/api/upload/partners", {
      method: "POST",
      body: formData,
      headers: {
        "X-Parse-Session-Token": sessionToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Upload Vendors Request sent ");
        // console.log("File uploaded successfully:", data);
        // Handle successful response from the server
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.error("There was a problem with your fetch operation:", error);
        // Handle errors
      });
  };
  useEffect(() => {
    handleUpload();
  }, [file]);
  return (
    <div className="pl-2 inline-block text-center">
      <label htmlFor="imagepicker1" className="btn btn-primary btn-sm">
        <div className=" transition-all duration-300 cursor-pointer rounded-lg">
          {/* <PhotoIcon className="w-8 h-8" /> */}
          <label className="">Upload Partners</label>
          <HoverIcon icon={<PaperClipIcon className="w-4 h-4" />} />
        </div>
       
      </label>
      <input
        id="imagepicker1"
        type="file"
        multiple
        maxSize="20MB"
        className="invisible h-0 w-0"
        // accept=".svg, .png, .jpg, .png"
        onChange={({ target }) => {
          const selectedFile = target.files[0];
          setFile(selectedFile);
        }}
      />
    </div>
  );
}

export default FileUpload;
