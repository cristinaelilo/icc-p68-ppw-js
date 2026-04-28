'use strict';

/* =========================
   SERVICIO DE STORAGE
========================= */

const TareaStorage = {
  CLAVE: 'tareas_lista',

  getAll() {
    try {
      const datos = localStorage.getItem(this.CLAVE);
      if (!datos) return [];
      return JSON.parse(datos);
    } catch (error) {
      console.error('Error al leer tareas:', error);
      return [];
    }
  },

  guardar(tareas) {
    try {
      localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  },

  // CREAR
  crear(texto) {
    const tareas = this.getAll();

    const nueva = {
      id: Date.now(),
      texto: texto.trim(),
      completada: false
    };

    tareas.push(nueva);
    this.guardar(tareas);

    return nueva;
  },

  // TOGGLE
  toggleCompletada(id) {
    const tareas = this.getAll();

    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
      tarea.completada = !tarea.completada;
      this.guardar(tareas);
    }
  },

  // ELIMINAR UNA
  eliminar(id) {
    const tareas = this.getAll();
    const filtradas = tareas.filter(t => t.id !== id);
    this.guardar(filtradas);
  },

  // LIMPIAR TODO
  limpiarTodo() {
    localStorage.removeItem(this.CLAVE);
  }
};

/* =========================
   SERVICIO DE TEMA
========================= */

const TemaStorage = {
  CLAVE: 'tema_app',

  getTema() {
    return localStorage.getItem(this.CLAVE) || 'claro';
  },

  setTema(tema) {
    localStorage.setItem(this.CLAVE, tema);
  }
};