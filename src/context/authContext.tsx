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
import { useAddUserMutation, useGetUserByIdQuery } from "../store/services/api";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginRedux, logoutRedux } from "../store/slice/auth.slice";
import { UserRole, UserType } from "../types";

interface AuthContextProps {
  currentUser?: User | null;
  user?: UserType;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (props: {
    email: string;
    password: string;
    name: string;
    role: string;
    phoneNumber: string;
  }) => void;
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
  const { data: user } = useGetUserByIdQuery({
    id: currentUser?.uid as string,
  });
  const [addUser] = useAddUserMutation();
  const router = useRouter();

  function register({
    email,
    name,
    role,
    password,
    phoneNumber,
  }: {
    email: string;
    password: string;
    name: string;
    role: string;
    phoneNumber: string;
  }) {
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
              phoneNumber,
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
    user,
    login,
    logout,
    register,
    CustomSignIn,
  };

  return <Provider value={value}>{children}</Provider>;
};

export { AuthContext, AuthProvider };
