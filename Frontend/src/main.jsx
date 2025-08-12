import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { UserProvider } from "./context/UserContext"; 
import './index.css'; 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
       <AuthProvider>
        <UserProvider>
        <BrowserRouter>
         <App />
         </BrowserRouter>
         </UserProvider>
       </AuthProvider>
      
    
  </React.StrictMode>
);
