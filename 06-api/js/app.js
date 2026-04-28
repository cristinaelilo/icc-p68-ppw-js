'use strict';

/* =========================
   ELEMENTOS
========================= */

const formPost = document.querySelector('#form-post');
const inputPostId = document.querySelector('#post-id');
const inputTitulo = document.querySelector('#titulo');
const inputContenido = document.querySelector('#contenido');
const btnSubmit = document.querySelector('#btn-submit');
const btnCancelar = document.querySelector('#btn-cancelar');

const inputBuscar = document.querySelector('#input-buscar');
const btnBuscar = document.querySelector('#btn-buscar');
const btnLimpiar = document.querySelector('#btn-limpiar');

const listaPosts = document.querySelector('#lista-posts');
const mensajeEstado = document.querySelector('#mensaje-estado');
const contador = document.querySelector('#contador strong');

/* =========================
   ESTADO
========================= */

let posts = [];
let postsFiltrados = [];
let modoEdicion = false;

// ID DINÁMICO
let nextId = 1;

/* =========================
   CARGA INICIAL
========================= */

async function cargarPosts() {
  try {
    mostrarCargando(listaPosts);

    posts = await ApiService.getPosts(20);
    postsFiltrados = [...posts];

    // CALCULAR EL SIGUIENTE ID CORRECTO
    const maxId = Math.max(...posts.map(p => p.id));
    nextId = maxId + 1;

    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();

  } catch (error) {
    listaPosts.innerHTML = '';
    listaPosts.appendChild(
      MensajeError(`Error: ${error.message}`)
    );
  }
}

function actualizarContador() {
  contador.textContent = postsFiltrados.length;
}

/* =========================
   FORMULARIO
========================= */

function limpiarFormulario() {
  formPost.reset();
  inputPostId.value = '';
  modoEdicion = false;
  btnSubmit.textContent = 'Crear Post';
  btnCancelar.style.display = 'none';
}

function activarModoEdicion(post) {
  modoEdicion = true;

  inputPostId.value = post.id;
  inputTitulo.value = post.title;
  inputContenido.value = post.body;

  btnSubmit.textContent = 'Actualizar Post';
  btnCancelar.style.display = 'inline-block';
}

/* =========================
   CRUD
========================= */

async function guardarPost(datosPost) {
  try {
    if (modoEdicion) {
      const id = parseInt(inputPostId.value);

      await ApiService.updatePost(id, datosPost);

      // ACTUALIZAR LOCAL
      const index = posts.findIndex(p => p.id === id);

      if (index !== -1) {
        posts[index] = {
          ...posts[index],
          ...datosPost
        };
      }

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${id} actualizado`)
      );

    } else {
      await ApiService.createPost(datosPost);

      // CREAR CON ID CORRECTO
      const nuevoPost = {
        id: nextId++,
        title: datosPost.title,
        body: datosPost.body,
        userId: 1
      };

      posts.unshift(nuevoPost);

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${nuevoPost.id} creado`)
      );
    }

    postsFiltrados = [...posts];
    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();
    limpiarFormulario();

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(error.message)
    );
  }
}

async function eliminarPost(id) {
  if (!confirm(`¿Eliminar post #${id}?`)) return;

  try {
    await ApiService.deletePost(id);

    posts = posts.filter(p => p.id !== id);
    postsFiltrados = postsFiltrados.filter(p => p.id !== id);

    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();

    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeExito(`Post #${id} eliminado`)
    );

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(error.message)
    );
  }
}

/* =========================
   BÚSQUEDA
========================= */

function buscarPosts(termino) {
  const t = termino.toLowerCase().trim();

  if (t === '') {
    postsFiltrados = [...posts];
  } else {
    postsFiltrados = posts.filter(p =>
      p.title.toLowerCase().includes(t) ||
      p.body.toLowerCase().includes(t)
    );
  }

  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

function limpiarBusqueda() {
  inputBuscar.value = '';
  postsFiltrados = [...posts];
  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/* =========================
   EVENTOS
========================= */

formPost.addEventListener('submit', (e) => {
  e.preventDefault();

  const datosPost = {
    title: inputTitulo.value.trim(),
    body: inputContenido.value.trim(),
    userId: 1
  };

  guardarPost(datosPost);
});

btnCancelar.addEventListener('click', limpiarFormulario);

btnBuscar.addEventListener('click', () => {
  buscarPosts(inputBuscar.value);
});

inputBuscar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    buscarPosts(inputBuscar.value);
  }
});

btnLimpiar.addEventListener('click', limpiarBusqueda);

listaPosts.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const id = parseInt(e.target.dataset.id);
  const post = posts.find(p => p.id === id);

  if (action === 'editar' && post) {
    activarModoEdicion(post);
  }

  if (action === 'eliminar') {
    eliminarPost(id);
  }
});

/* =========================
   INIT
========================= */

cargarPosts();