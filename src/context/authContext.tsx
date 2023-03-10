import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import auth from "../utils/firebase";
import { toast } from "react-toastify";
import { useAddUserMutation } from "../store/services/api";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginRedux, logoutRedux } from "../store/slice/auth.slice";
import { localStorageService } from "../utils/localStorageService";

interface AuthContextProps {
  currentUser?: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => void;
  logout: () => void;
  CustomSignIn: (token: string) => void;
}

const AuthContext = React.createContext({} as AuthContextProps);
const { Provider } = AuthContext;

interface AuthProviderInterface {
  children: React.ReactNode;
}
const AuthProvider = ({ children }: AuthProviderInterface) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>();

  const dispatch = useDispatch();
  const [addUser] = useAddUserMutation();
  const router = useRouter();

  function register(
    email: string,
    password: string,
    name: string,
    role: string
  ) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const user = res.user;
        updateProfile(user, { displayName: name }).then(() => {
          if (user.email && user.displayName) {
            addUser({
              id: user.uid,
              email: user.email,
              name: user.displayName,
              role,
            });
          }
        });
      })
      .then(() => {
        toast.success("Successfully Registered ");
      })
      .catch((err) => {
        toast.error(`Error in auth ${err}`);
      });
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth).then(() => {
      router.push("/login");
      toast.success("Logout successfully!");
      setCurrentUser(null);
      dispatch(logoutRedux());
    });
  }

  function CustomSignIn(token: string) {
    signInWithCustomToken(auth, token)
      .then((res) => {
        toast.success("You have been successfully logged in");
      })
      .catch((err) => {
        toast.error(`Error Occurred: ${err}`);
      });
  }

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        user.getIdToken().then((token) => {
          dispatch(loginRedux(token));
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    register,
    CustomSignIn,
  };

  return <Provider value={value}>{children}</Provider>;
};

export { AuthContext, AuthProvider };
