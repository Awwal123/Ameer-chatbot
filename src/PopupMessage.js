import React from "react";
import "./styles.css"; 

export default function PopupMessage({ message }) {
  return (
    <div className="popup-message show">
      <p>{message}</p>
    </div>
  );
}
