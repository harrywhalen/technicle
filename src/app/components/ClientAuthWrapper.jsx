// components/ClientAuthWrapper.jsx
"use client";

import { AuthProvider } from '../context/AuthContext';

export default function ClientAuthWrapper({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}