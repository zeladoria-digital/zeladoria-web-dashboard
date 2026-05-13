// Neste componente é feita a verificação, com o auxílio do firebase auth, se o usuário está logado.
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Mudar o caminho do firebase, já que não é meu papel inicializá-lo.
import app from "./firebase";
import { useEffect, useState } from "react";

const auth = getAuth(app);

export function usuarioAutenticado(): boolean | null {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  useEffect(() => {
    // Listener que fica verificando se o user tá logado. Enquanto estiver montado, é executado.
    const cancelarEtapa = onAuthStateChanged(auth, (user) => {
      setAutenticado(!!user); // "!!" serve para converter o valor do objeto user para boolean.
    });
    return () => cancelarEtapa(); // Se desmontar, a operação é interrompida.
  }, []);
  return autenticado;
}

// IMPORTANTE: Se o componente indicar que o usuário não está logado, joga ele para o caminho /login.
