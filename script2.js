// ====== CONFIGURACIÓN FIREBASE ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYXAhphpsLpjhAY-am0TxXmh7JwnTztHE",
  authDomain: "argentum-gaames.firebaseapp.com",
  projectId: "argentum-gaames",
  storageBucket: "argentum-gaames.firebasestorage.app",
  messagingSenderId: "365917889897",
  appId: "1:365917889897:web:82e8fca98dcdc88cfc09f8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ====== ELEMENTOS DOM ======
const msg = document.getElementById("msg");
const userSpan = document.getElementById("nombreUsuario");
const crearBtn = document.getElementById("crearBtn");
const unirBtn = document.getElementById("unirBtn");

// ====== UTILIDADES ======
function mostrarMensaje(texto, color = "black") {
  msg.style.color = color;
  msg.innerText = texto;
}

function generarCodigo() {
  const letras = "abcdefghijklmnopqrstuvwxyz";
  let c1 = "", c2 = "";
  for (let i = 0; i < 3; i++) c1 += letras[Math.floor(Math.random() * letras.length)];
  for (let i = 0; i < 3; i++) c2 += letras[Math.floor(Math.random() * letras.length)];
  return `${c1}-${c2}`;
}

// ====== OBTENER USUARIO de la URL ======
const params = new URLSearchParams(window.location.search);
const usuario = params.get("user");
if (!usuario) {
  alert("Usuario no detectado. Volviendo al inicio.");
  window.location.href = "index.html";
} else {
  userSpan.innerText = usuario;
}

// ====== CREAR SALA ======
crearBtn.onclick = async () => {
  const modo = document.getElementById("modo").value;
  const jugadores = document.getElementById("jugadoresMax").value;

  if (!modo || !jugadores) {
    mostrarMensaje("Completa todos los campos", "red");
    return;
  }

  mostrarMensaje("Creando sala...", "blue");

  const codigo = generarCodigo();
  const partidaRef = doc(db, "partidas", codigo);
  const partidaData = {
    creador: usuario,
    modo: modo,
    usersMAX: Number(jugadores),
    jugadoresDentro: [usuario],  // inicializa con el creador dentro
    fechaCreacion: new Date().toISOString()
  };

  try {
    await setDoc(partidaRef, partidaData);
    mostrarMensaje(`Sala creada (${codigo})`, "green");
    setTimeout(() => {
      window.location.href = `partidas.html?codigo=${codigo}&user=${encodeURIComponent(usuario)}`;
    }, 1200);
  } catch (e) {
    console.error(e);
    mostrarMensaje("Error al crear sala", "red");
  }
};

// ====== UNIRSE A SALA ======
unirBtn.onclick = async () => {
  const codigo = document.getElementById("codigoJoin").value.trim();

  if (!codigo) {
    mostrarMensaje("Ingresá un código", "red");
    return;
  }

  mostrarMensaje("Buscando sala...", "blue");

  const partidaRef = doc(db, "partidas", codigo);
  const snapshot = await getDoc(partidaRef);
  if (!snapshot.exists()) {
    mostrarMensaje("Sala no encontrada", "red");
    return;
  }

  const data = snapshot.data();

  // Verificar límite de jugadores
  if (data.jugadoresDentro && data.jugadoresDentro.length >= data.usersMAX) {
    mostrarMensaje("Sala llena", "red");
    return;
  }

  // Añadir usuario a la lista de jugadores dentro
  const nuevos = data.jugadoresDentro ? [...data.jugadoresDentro] : [];
  if (!nuevos.includes(usuario)) {
    nuevos.push(usuario);
  }

  const nuevoData = {
    ...data,
    jugadoresDentro: nuevos
  };

  try {
    await setDoc(partidaRef, nuevoData);
    mostrarMensaje(`Entrando a sala ${codigo}...`, "green");
    setTimeout(() => {
      window.location.href = `partidas.html?codigo=${codigo}&user=${encodeURIComponent(usuario)}`;
    }, 1200);
  } catch (e) {
    console.error(e);
    mostrarMensaje("Error al unirse a sala", "red");
  }
};
