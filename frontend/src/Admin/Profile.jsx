import React, { useState } from "react";
import "../admincss/profile.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  const handleUpdate = () => {
    alert("Profile settings updated successfully!");
  };

  return (
    <div className="elite-profile-wrapper">
      <div className="elite-header-section">
        <div className="elite-title-box">
          <h2 className="elite-main-heading">Account Settings</h2>
          <p className="elite-sub-text">Update your personal information and public profile.</p>
        </div>
        <button onClick={handleUpdate} className="elite-save-btn">Update Profile</button>
      </div>

      <div className="elite-grid-layout">
        {/* Left Side: Information */}
        <div className="elite-info-card">
          <div className="elite-input-row">
            <div className="elite-input-box">
              <label className="elite-label">Full Name</label>
              <input
                className="elite-field"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="elite-input-box">
              <label className="elite-label">Email Address</label>
              <input 
                className="elite-field elite-field--readonly" 
                type="email" 
                value={email} 
                disabled 
              />
            </div>
          </div>
          
          <div className="elite-security-note">
            <p><strong>Note:</strong> Your email is managed by your organization and cannot be changed.</p>
          </div>
        </div>

        {/* Right Side: Quick Stats/Preview */}
        <div className="elite-preview-card">
          <div className="elite-avatar-large">{name.charAt(0) || "U"}</div>
          <h3 className="elite-preview-name">{name || "Your Name"}</h3>
          <span className="elite-badge">Verified User</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;