import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getProfile } from "../services/auth";

interface User {
  email: string;
  explorer_name?: string;
  role?: string;
  xp?: number;
  level?: number;
  streak?: number;
  gems?: number;
  last_active?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const getStoredUser = (): User | null => {
  const savedUser = localStorage.getItem("user");
  try {
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const isAuthenticated = Boolean(user) || Boolean(localStorage.getItem("token"));

  const login = (user: User, token?: string) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.setItem("token", "authenticated");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentMissionDomain");
    localStorage.removeItem("learningMissionsState");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token && token !== "authenticated" && token !== "sample-session-token-active") {
      try {
        const res = await getProfile(token);
        if (res.data.user) {
          const updatedUser = res.data.user;
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error("Failed to fetch profile stats:", err);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);