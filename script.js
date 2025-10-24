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

  alert("Verificando datos...");

  const docRef = doc(db, "cuentas", usuario);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return alert("Usuario no encontrado");
  const data = snapshot.data();
  if (data.clave !== clave) return alert("Clave incorrecta");

  document.getElementById("nombreUsuario").innerText = usuario;
  cambiarPestaña("inicio");
};

// ====== REGISTER ======
window.register = async function() {
  const usuario = document.getElementById("usuarioRegister").value.trim();
  const clave = document.getElementById("claveRegister").value.trim();
  if (!usuario || !clave) return alert("Completa todos los campos");

  alert("Registrando cuenta...");

  await setDoc(doc(db, "cuentas", usuario), { usuario, clave });
  alert("Cuenta creada correctamente");
  cambiarPestaña("login");
};

// ====== CREAR SALA TA-TE-TI ======
window.crearSala1 = async function() {
  const cantidad = document.getElementById("cantTateti").value;
  if (!cantidad) return alert("Selecciona una cantidad");

  alert("Creando sala Ta-Te-Ti...");

  const codigo = generarCodigo();
  await setDoc(doc(db, "partidas", codigo), {
    usersMAX: cantidad,
    modo: "tateti"
  });

  window.open(`https://abelcraftok.github.io/ARGENTUM/partidas.html?codigo=${codigo}`, "_blank");
};

// ====== CREAR SALA TUTTI FRUTTI ======
window.crearSala2 = async function() {
  const cantidad = document.getElementById("cantTutti").value;
  if (!cantidad) return alert("Selecciona una cantidad");

  const seleccionadas = Array.from(document.querySelectorAll("#categorias input[type=checkbox]:checked"))
    .map(c => c.value || "Cat. Obligatoria");

  alert("Creando sala Tutti Frutti...");

  const codigo = generarCodigo();
  await setDoc(doc(db, "partidas", codigo), {
    usersMAX: cantidad,
    categorias: seleccionadas.join(", "),
    modo: "Tutti Frutti"
  });

  window.open(`https://abelcraftok.github.io/ARGENTUM/partidas.html?codigo=${codigo}`, "_blank");
};

// ====== ENTRAR A SALA ======
window.entrar = function() {
  const codigo = document.getElementById("codigo-partida").value.trim();
  if (!codigo) return alert("Ingresá un código");
  alert("Entrando a sala...");
  window.open(`https://abelcraftok.github.io/ARGENTUM/partidas.html?codigo=${codigo}`, "_blank");
};

// ====== UTIL ======
function generarCodigo() {
  const letras = "abcdefghijklmnopqrstuvwxyz";
  let c1 = "", c2 = "";
  for (let i = 0; i < 3; i++) c1 += letras[Math.floor(Math.random() * letras.length)];
  for (let i = 0; i < 3; i++) c2 += letras[Math.floor(Math.random() * letras.length)];
  return `${c1}-${c2}`;
}
