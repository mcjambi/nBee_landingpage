import { useAuth } from "../../AuthContext";

export default function Homepage() {
  const { isAuthenticated } = useAuth();

  return <>A HAHA, Hoom nef isAuthenticated: {Number(isAuthenticated)} </>;
}
