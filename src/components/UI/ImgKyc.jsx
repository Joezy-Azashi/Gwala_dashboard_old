import React, { useState, useEffect } from "react";
import axios from "../../api/request";

const ImgKyc = (props) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = await axios(props.src);
      setImageUrl(data.url);
    };
    fetchImage();
  }, [props.src]);

  return (
    <img
      src={imageUrl}
      alt={props.alt}
      style={{ width: "100%" }}
      onLoad={props.onLoad}
    />
  );
};

export default ImgKyc;
