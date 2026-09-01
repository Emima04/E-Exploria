import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface User {
  email: string;
  explorer_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);