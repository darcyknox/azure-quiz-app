import React from "react";
import { useMsal } from "@azure/msal-react";

function AuthButton() {
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginPopup();
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  if (accounts.length > 0) {
    return (
      <div>
        <span>Welcome, {accounts[0].username}!</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return <button onClick={handleLogin}>Login with Microsoft</button>;
}

export default AuthButton;