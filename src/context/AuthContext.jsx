import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:8080/api/auth";

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);

  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
}

function getSavedToken() {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }) {

  const [user, setUser] = useState(getSavedUser);
  const [token, setToken] = useState(getSavedToken);

  useEffect(() => {

    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("user");
    }

  }, [user]);

  useEffect(() => {

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

  }, [token]);


  // =========================
  // LOGIN
  // =========================

  const login = async (email, password) => {

    try {

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        return {
          success: false,
          message:
            data.message ||
            "Invalid email or password."
        };
      }

      const loggedInUser = {
        id: data.userId,
        name: data.name,
        email: data.email
      };

      setUser(loggedInUser);
      setToken(data.token);

      return {
        success: true,
        user: loggedInUser,
        token: data.token
      };

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the server. Make sure Spring Boot is running."
      };
    }
  };


  // =========================
  // REGISTER
  // =========================

  const register = async (
    name,
    email,
    password
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        return {
          success: false,
          message:
            data.message ||
            "Registration failed."
        };
      }

      const registeredUser = {
        id: data.userId,
        name: data.name,
        email: data.email
      };

      setUser(registeredUser);
      setToken(data.token);

      return {
        success: true,
        user: registeredUser,
        token: data.token
      };

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the server. Make sure Spring Boot is running."
      };
    }
  };


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated:
          Boolean(user && token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}