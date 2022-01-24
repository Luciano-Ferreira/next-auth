import { createContext, ReactNode, useState } from 'react';
import { setCookie } from 'nookies';
import { api } from '../services/api';
import Router from 'next/router'

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type AuthProviderProps = {
  children: ReactNode;
}

type SignInCredentials = {
  email: string;
  pw: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user?: User;
  isAuthenticated: boolean;
};

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [ user, setUser ] = useState<User>()

  const isAuthenticated = !!user;


  async function signIn({email, pw}: SignInCredentials) {
      const response = await api.post('sessions', {
        email,
        password: pw
      });

      const {token, refreshToken, permissions, roles} = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      setCookie(undefined, 'nextauth.token', refreshToken)


  
      setUser({
        email,
        permissions,
        roles
      })
    
      Router.push('/dashboard')
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}