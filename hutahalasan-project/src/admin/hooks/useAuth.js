// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { AuthService, TokenService } from "../services/index.js";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (TokenService.isValid()) {
      setUser(TokenService.getUser());
    } else {
      TokenService.remove();
    }
    setLoading(false);

    const handleExpired = () => {
      setUser(null);
      window.location.href = "/login";
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await AuthService.login(credentials);
    setUser(TokenService.getUser());
    return data;
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isPengembang: user?.subrole === "Pengembang",
    isManajer: user?.subrole === "Manajer",
    isValidator: user?.subrole === "Validator",
    isJurnalis: user?.subrole === "Jurnalis",
    canUpload: ["Jurnalis", "Pengembang"].includes(user?.subrole),
    canValidate: user?.subrole === "Validator",
    canManageUsers: user?.subrole === "Pengembang",
    canViewInsight: ["Pengembang", "Manajer"].includes(user?.subrole),
    canDeleteKomentar: ["Pengembang", "Manajer"].includes(user?.subrole),
  };
};
