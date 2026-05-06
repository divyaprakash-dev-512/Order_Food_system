import React, { useState } from "react";
import "../admincss/cp.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = () => {
    alert("Security update: Password change API logic goes here!");
  };

  return (
    <div className="cp-vault-container">
      <div className="cp-vault-header">
        <div className="cp-security-badge">
          <span className="cp-icon-shield">🛡️</span>
        </div>
        <h2 className="cp-vault-title">Security Settings</h2>
        <p className="cp-vault-desc">Enhance your account's protection by updating your credentials.</p>
      </div>

      <div className="cp-vault-card">
        <div className="cp-field-wrap">
          <label className="cp-field-label">Current Password</label>
          <input
            className="cp-field-input"
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="cp-field-wrap">
          <label className="cp-field-label">New Password</label>
          <input
            className="cp-field-input"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="cp-strength-meter">
            <div className="cp-strength-bar"></div>
          </div>
        </div>

        <button className="cp-vault-btn" onClick={handleChange}>
          Secure Update
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;