// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  auth, 
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc
} from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!isMounted) return;
        
        setCurrentUser(user);
        
        if (user) {
          // ✅ Get token and save to localStorage
          try {
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
          } catch (tokenError) {
            // console.error('Error getting token:', tokenError);
          }
          
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const profile = userDoc.data();
              setUserProfile(profile);
              setIsAdmin(profile.role === 'admin' || profile.role === 'pastor');
            } else {
              // console.log('User found in auth but not in Firestore');
              setUserProfile(null);
              setIsAdmin(false);
            }
          } catch (firestoreError) {
            // console.error('Error fetching user profile:', firestoreError);
            setUserProfile(null);
            setIsAdmin(false);
          }
        } else {
          // ✅ Remove token on logout
          localStorage.removeItem('authToken');
          setUserProfile(null);
          setIsAdmin(false);
        }
      } catch (error) {
        // console.error('Auth state change error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName,
        role: 'member',
        titheNumber: `GOG-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // ✅ Save token
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      toast.success('Registration successful! Welcome to Generals of Grace.');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // ✅ Save token
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    currentUser,
    userProfile,
    isAdmin,
    loading,
    register,
    login,
    logout,
    resetPassword,
    setUserProfile,
  }), [currentUser, userProfile, isAdmin, loading, register, login, logout, resetPassword]);

  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-church-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;


