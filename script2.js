// ====== CONFIGURACIÓN FIREBASE ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// ====== CAMBIO DE PESTAÑAS ======
window.cambiarPestaña = function(pestaña) {
  document.querySelectorAll(".container").forEach(c => c.classList.add("hidden"));
  document.getElementById(pestaña).classList.remove("hidden");
};

// ====== LOGIN ======
window.login = async function() {
  const usuario = document.getElementById("usuarioLogin").value.trim();
  const clave = document.getElementById("claveLogin").value.trim();

  if (!usuario || !clave) return alert("Completa todos los campos");

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "cuentas/" + usuario));

  if (!snapshot.exists()) return alert("Usuario no encontrado");

  const datos = snapshot.val();
  if (datos.clave !== clave) return alert("Clave incorrecta");

  localStorage.setItem("usuarioActual", usuario);
  cambiarPestaña("partida");
  cargarPartida();
};

// ====== REGISTER ======
window.register = async function() {
  const usuario = document.getElementById("usuarioRegister").value.trim();
  const clave = document.getElementById("claveRegister").value.trim();

  if (!usuario || !clave) return alert("Completa todos los campos");

  await set(ref(db, "cuentas/" + usuario), { usuario, clave });
  alert("Cuenta creada correctamente");
  location.reload();
};

// ====== COPIAR URL ======
window.copiarURL = function() {
  navigator.clipboard.writeText(window.location.href);
  alert("URL copiada");
};

// ====== CARGAR PARTIDA ======
async function cargarPartida() {
  const codigo = obtenerCodigoURL();
  if (!codigo) return alert("Código de partida inválido");

  const partidaRef = ref(db, "partidas/" + codigo);

  onValue(partidaRef, (snapshot) => {
    if (!snapshot.exists()) {
      document.getElementById("users-dentro").innerText = "Partida no encontrada.";
      return;
    }

    const data = snapshot.val();
    mostrarUsuarios(data);
  });
}

// ====== MOSTRAR USUARIOS ======
function mostrarUsuarios(data) {
  const usersDiv = document.getElementById("users-dentro");
  if (!data.jugadores) {
    usersDiv.innerHTML = "<p>No hay jugadores aún.</p>";
    return;
  }
  usersDiv.innerHTML = Object.values(data.jugadores).map(u => `<p>${u}</p>`).join("");
}

// ====== COMENZAR PARTIDA ======
window.comenzarPartida = async function() {
  const codigo = obtenerCodigoURL();
  const partidaRef = ref(db, "partidas/" + codigo);
  const snapshot = await get(partidaRef);

  if (!snapshot.exists()) return alert("Partida no encontrada");

  const data = snapshot.val();

  if (data.modo === "tateti") {
    alert("Comienza TA-TE-TI (aquí se cargará el tablero)");
  } else if (data.modo === "Tutti Frutti") {
    alert("Comienza TUTTI FRUTTI (aquí se mostrará la tabla de categorías)");
  } else {
    alert("Modo de juego desconocido");
  }
};

// ====== OBTENER QUERY STRING ======
function obtenerCodigoURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("codigo");
}

// ====== AUTO-INICIO SI YA ESTÁ LOGUEADO ======
window.addEventListener("load", () => {
  const usuario = localStorage.getItem("usuarioActual");
  if (usuario) {
    cambiarPestaña("partida");
    cargarPartida();
  }
});
