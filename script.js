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
const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const contLogin = document.getElementById("login");
const contRegister = document.getElementById("register");
const msg = document.getElementById("msg");

// ====== CAMBIO DE PESTAÑAS ======
tabLogin.onclick = () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  contLogin.classList.add("active");
  contRegister.classList.remove("active");
  msg.innerText = "";
};

tabRegister.onclick = () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  contRegister.classList.add("active");
  contLogin.classList.remove("active");
  msg.innerText = "";
};

// ====== FUNCIONES ======
function mostrarMensaje(texto, color = "black") {
  msg.style.color = color;
  msg.innerText = texto;
}

// ====== REGISTRO ======
document.getElementById("btnRegister").onclick = async () => {
  const usuario = document.getElementById("usuarioRegister").value.trim();
  const clave = document.getElementById("claveRegister").value.trim();

  if (!usuario || !clave) {
    mostrarMensaje("Completa todos los campos", "red");
    return;
  }

  mostrarMensaje("Registrando cuenta...", "blue");

  const dbRef = ref(db);
  const existe = await get(child(dbRef, "cuentas/" + usuario));
  if (existe.exists()) {
    mostrarMensaje("El usuario ya existe", "red");
    return;
  }

  await set(ref(db, "cuentas/" + usuario), { usuario, clave });

  mostrarMensaje("Cuenta creada correctamente. Redirigiendo al login...", "green");
  setTimeout(() => tabLogin.click(), 2000);
};

// ====== LOGIN ======
document.getElementById("btnLogin").onclick = async () => {
  const usuario = document.getElementById("usuarioLogin").value.trim();
  const clave = document.getElementById("claveLogin").value.trim();

  if (!usuario || !clave) {
    mostrarMensaje("Completa todos los campos", "red");
    return;
  }

  mostrarMensaje("Iniciando sesión...", "blue");

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "cuentas/" + usuario));
  if (!snapshot.exists()) {
    mostrarMensaje("Usuario no encontrado", "red");
    return;
  }

  const datos = snapshot.val();
  if (datos.clave !== clave) {
    mostrarMensaje("Clave incorrecta", "red");
    return;
  }

  mostrarMensaje("Inicio de sesión exitoso", "green");
  setTimeout(() => {
    window.location.href = "partida.html?user=" + encodeURIComponent(usuario);
  }, 1500);
};
