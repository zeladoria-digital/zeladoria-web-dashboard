
import { getAuth, onAuthStateChanged } from "firebase/auth";

import app from "./firebase";
import { useEffect, useState } from "react";

const auth = getAuth(app);

export function usuarioAutenticado(): boolean | null {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  useEffect(() => {
    
    const cancelarEtapa = onAuthStateChanged(auth, (user) => {
      setAutenticado(!!user); 
    });
    return () => cancelarEtapa(); 
  }, []);
  return autenticado;
}


