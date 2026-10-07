import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

export const cadastrar = (email, senha) =>
  createUserWithEmailAndPassword(auth, email, senha);

export const entrar = (email, senha) =>
  signInWithEmailAndPassword(auth, email, senha);

export const sair = () => signOut(auth);
