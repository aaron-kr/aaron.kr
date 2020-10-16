import React, { useEffect, useRef, useState } from "react";
import { getDownloadUrl, uploadImage } from "../firebase/site";
// import "./ProfileImg.css";

export const SiteImg = ({ id }) => {
  const fileInput = useRef(null);
  const [imgUrl, setImgUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(
    () => {
      getDownloadUrl(id).then((url) => url && setImgUrl(url));
    },
    [id]
  );

  const fileChange = async (files) => {
    const ref = await uploadImage(id, files[0], updateProgress);
    const downloadUrl = await ref.getDownloadURL();
    setImgUrl(downloadUrl);
  };

  const updateProgress = (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setUploadProgress(progress);
  };

  return (
    <div className="four wide column profile-image-container">
      <figure className="site-image">
        <img
          className="ui image"
          src={imgUrl || "/img/profile-placeholder.jpg"}
          alt="site"
        />
      </figure>
      <input
        className="file-input"
        type="file"
        accept=".png,.jpg"
        ref={fileInput}
        onChange={(e) => fileChange(e.target.files)}
      />
      <progress style={{ width: "100%" }} max="100" value={uploadProgress} />
      <button
        className="ui grey button upload-button"
        onClick={() => fileInput.current.click()}
      >
        Upload Photo
      </button>
    </div>
  );
};
