import { createContext, ReactNode } from 'react';
import { api } from '../services/api';

type AuthProviderProps = {
  children: ReactNode;
}

type SignInCredentials = {
  email: string;
  pw: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;


  async function signIn({email, pw}: SignInCredentials) {
      const response = await api.post('sessions', {
        email,
        password: pw
      });
      console.log(response.data)
    
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}