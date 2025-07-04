
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      console.log('Attempting login for:', email);

      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, received data:', data);
        console.log('Token received:', data.access_token ? 'Yes' : 'No');
        
        // Store the token first
        setToken(data.access_token);
        localStorage.setItem('auth_token', data.access_token);
        
        // Now fetch user data using the token
        try {
          const userResponse = await fetch('http://127.0.0.1:8000/api/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('User data fetched:', userData);
            
            const userInfo = {
              id: userData.id,
              username: userData.username,
              email: userData.email
            };
            
            setUser(userInfo);
            localStorage.setItem('auth_user', JSON.stringify(userInfo));
            
            console.log('User logged in successfully with ID:', userData.id);
            return true;
          } else {
            console.error('Failed to fetch user data:', userResponse.status);
            // Clear the token if user data fetch fails
            setToken(null);
            localStorage.removeItem('auth_token');
            return false;
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          // Clear the token if user data fetch fails
          setToken(null);
          localStorage.removeItem('auth_token');
          return false;
        }
      } else {
        const errorText = await response.text();
        console.error('Login failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Attempting signup for:', email, username);

      const response = await fetch('http://127.0.0.1:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful, received data:', data);
        
        // DO NOT automatically log in - user must go through login process
        // This ensures proper token generation and storage
        return true;
      } else {
        const errorText = await response.text();
        console.error('Signup failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
