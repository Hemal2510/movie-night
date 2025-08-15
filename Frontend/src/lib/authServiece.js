import apiClient from "./api";
import { AUTH_BASE_URL } from "./api";
import axios from "axios";

// Change password when logged in (old password method)
export const changePassword = (oldPassword, newPassword) =>
    apiClient.put(`${AUTH_BASE_URL}/change-password`, {
        oldPassword,
        newPassword,
    });

// Send OTP for password reset
export const sendResetOtp = (email) =>
    axios.post(`${AUTH_BASE_URL}/send-reset-otp`, { email });

// Verify OTP
export const verifyOtp = (email, otp) =>
    axios.post(`${AUTH_BASE_URL}/verify-otp`, { email, otp });

// Reset password using OTP
export const resetPassword = (email, otp, newPassword) =>
    axios.post(`${AUTH_BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword,
    });
