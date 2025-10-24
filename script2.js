// ====== CONFIGURACIÓN FIREBASE ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYXAhphpsLpjhAY-am0TxXmh7JwnTztHE",
  authDomain: "argentum-gaames.firebaseapp.com",
  projectId: "argentum-gaames",
  storageBucket: "argentum-gaames.firebasestorage.app",
  messagingSenderId: "365917889897",
  appId: "1:365917889897:web:82e8fca98dcdc88cfc09f8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ====== ELEMENTOS ======
const msg = document.getElementById("msg");
const userSpan = document.getElementById("nombreUsuario");
const crearBtn = document.getElementById("crearBtn");
const unirBtn = document.getElementById("unirBtn");

// ====== UTIL ======
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

// ====== MOSTRAR USUARIO ======
const params = new URLSearchParams(window.location.search);
const usuario = params.get("user");
if (!usuario) {
  alert("Usuario no detectado. Volviendo al inicio.");
  window.location.href = "index.html";
} else {
  userSpan.innerText = usuario;
}

// ====== CREAR PARTIDA ======
crearBtn.onclick = async () => {
  const modo = document.getElementById("modo").value;
  const jugadores = document.getElementById("jugadoresMax").value;

  if (!modo || !jugadores) {
    mostrarMensaje("Completa todos los campos", "red");
    return;
  }

  mostrarMensaje("Creando sala...", "blue");

  const codigo = generarCodigo();
  const partida = {
    creador: usuario,
    modo: modo,
    usersMAX: jugadores,
    fecha: Date.now()
  };

  await set(ref(db, "partidas/" + codigo), partida);

  mostrarMensaje(`Sala creada (${codigo})`, "green");
  setTimeout(() => {
    window.open(`https://abelcraftok.github.io/ARGENTUM/partidas.html?codigo=${codigo}`, "_blank");
  }, 1500);
};

// ====== UNIRSE A PARTIDA ======
unirBtn.onclick = async () => {
  const codigo = document.getElementById("codigoJoin").value.trim();

  if (!codigo) {
    mostrarMensaje("Ingresá un código", "red");
    return;
  }

  mostrarMensaje("Buscando sala...", "blue");

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "partidas/" + codigo));

  if (!snapshot.exists()) {
    mostrarMensaje("Sala no encontrada", "red");
    return;
  }

  mostrarMensaje(`Entrando a sala ${codigo}...`, "green");
  setTimeout(() => {
    window.open(`https://abelcraftok.github.io/ARGENTUM/partidas.html?codigo=${codigo}`, "_blank");
  }, 1500);
};
