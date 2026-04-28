'use strict';

/* =========================
   1. SELECTORES DEL DOM
========================= */

const btn = document.querySelector('#btn-cargar');
const contenedor = document.querySelector('#contenedor');
const loading = document.querySelector('#loading');

const URL = 'https://thesimpsonsapi.com/api/characters';


/* =========================
   2. EVENTO
========================= */

btn.addEventListener('click', cargarDatos);


/* =========================
   3. FETCH
========================= */

async function cargarDatos() {
  try {
    loading.classList.remove('oculto');
    contenedor.innerHTML = '';

    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    renderizar(data.results);

  } catch (error) {
    mostrarError(error.message);
  } finally {
    loading.classList.add('oculto');
  }
}


/* =========================
   4. RENDERIZADO
========================= */

function renderizar(lista) {

  const frasesDefault = [
    "¡D'oh!",
    "Excelente...",
    "Ay caramba!",
    "Yo no fui",
    "Multiplícate por cero"
  ];

  lista.forEach(item => {

    const card = document.createElement('div');
    card.className = 'card';

    // IMAGEN
    const bloqueImagen = document.createElement('div');
    bloqueImagen.className = 'card-imagen';

    const img = document.createElement('img');
    img.src = `https://cdn.thesimpsonsapi.com/500${item.portrait_path}`;
    img.alt = item.name;

    bloqueImagen.appendChild(img);

    // TEXTO
    const bloqueTexto = document.createElement('div');
    bloqueTexto.className = 'card-contenido';

    const nombre = document.createElement('h3');
    nombre.textContent = item.name;

    const ocupacion = document.createElement('p');
    ocupacion.textContent = `Ocupación: ${item.occupation || 'No disponible'}`;

    // 🔥 FRASES (SIEMPRE HABRÁ)
    const fraseBase = item.phrase || frasesDefault[Math.floor(Math.random() * frasesDefault.length)];

    const frase1 = document.createElement('p');
    frase1.textContent = `Frase: ${fraseBase}`;

    const frase2 = document.createElement('p');
    frase2.textContent = `Otra frase: "${frasesDefault[Math.floor(Math.random() * frasesDefault.length)]}"`;

    const frase3 = document.createElement('p');
    frase3.textContent = `Cita famosa: "${frasesDefault[Math.floor(Math.random() * frasesDefault.length)]}"`;

    // AGREGAR TODO
    bloqueTexto.appendChild(nombre);
    bloqueTexto.appendChild(ocupacion);
    bloqueTexto.appendChild(frase1);
    bloqueTexto.appendChild(frase2);
    bloqueTexto.appendChild(frase3);

    card.appendChild(bloqueImagen);
    card.appendChild(bloqueTexto);

    contenedor.appendChild(card);
  });
}


/* =========================
   5. ERRORES
========================= */

function mostrarError(mensaje) {
  const p = document.createElement('p');
  p.textContent = `Error: ${mensaje}`;
  p.style.color = 'red';

  contenedor.appendChild(p);
}