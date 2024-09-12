import React, { useRef } from "react";
import PasswordToggle from "./PasswordToggle";

export default function Password({ value, onChange }) {
  const passwordRef = useRef(null);

  return (
    <div className="input--container">
      <p className="labels">Password</p>
      <div className="password--wrapper">
        <input
          className="input-box"
          type="password"
          placeholder="Enter your password"
          value={value}
          onChange={onChange}
          ref={passwordRef}
        />
        <PasswordToggle inputRef={passwordRef} />
      </div>
    </div>
  );
}
