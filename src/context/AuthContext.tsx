import React, { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential, 
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { Preferences } from '@capacitor/preferences';


interface AuthContextType {
  signup: (email: string, password: string, name?: string) => Promise<UserCredential | void>;
  signin: (email: string, password: string ) => Promise<UserCredential | void>;
  signout: () => Promise<void>;
  error: string | null;
  loading: boolean;
  authStateLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authStateLoading, setAuthStateLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchStoredUser = async () => {
      const { value } = await Preferences.get({ key: 'authUser' });
      if (value) {
        setUser(JSON.parse(value));
        setIsLoggedIn(true);
      }
    };

    fetchStoredUser();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      if (currentUser)
        await Preferences.set({ key: 'authUser', value: JSON.stringify(currentUser) });
      else 
        await Preferences.remove({ key: 'authUser' });

        setAuthStateLoading(false);
    });
    return () => { unsubscribe() }
  }, []);

  const signup = async (email: string, password: string, name?: string): Promise<UserCredential | void> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      return userCredential;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signin = async (email: string, password: string): Promise<UserCredential | void> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ signup, signin, signout, error, loading, authStateLoading, isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
