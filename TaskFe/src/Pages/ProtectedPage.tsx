import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../Utils/useAuth";

type ProtectedPageProp = { children: ReactNode };

export function ProtectedPage({ children }: ProtectedPageProp) {
  const {token} = useAuth();
  if(!token) {return <Navigate to="/auth"/>}
  return children;
}
