import React, { createContext, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [user, setUser] = useState(null);
  const [data,setData] = useState(null);
  const login = (token, role, data) => {
    setCookie('token', token, { path: '/' });
    setUser({ role });
    setData({data});
  };

  const logout = () => {
    removeCookie('token', { path: '/' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
