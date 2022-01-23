import { createContext, ReactNode } from 'react';

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
    console.log({email, pw})
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}