'use strict';

const REGEX = {
    nombre: /^[a-zA-Z\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

function mostrarError(campo, mensaje) {
    campo.classList.add('campo--error');
    campo.classList.remove('campo--valido');

    let div = campo.parentElement.querySelector('.error-mensaje');
    if (!div) {
        div = document.createElement('div');
        div.className = 'error-mensaje';
        campo.parentElement.appendChild(div);
    }
    div.textContent = mensaje;
}

function limpiarError(campo) {
    campo.classList.remove('campo--error');

    const div = campo.parentElement.querySelector('.error-mensaje');
    if (div) div.textContent = '';
}

function validarCampo(campo) {
    const valor = campo.type === 'checkbox' ? campo.checked : campo.value.trim();
    let error = '';

    if (campo.required && !valor) {
        error = 'Este campo es obligatorio';
    }

    if (!error && valor) {
        switch (campo.name) {

            case 'nombre':
                if (valor.length < 3)
                    error = 'El nombre debe tener al menos 3 caracteres';
                else if (!REGEX.nombre.test(valor))
                    error = 'Solo letras y espacios';
                break;

            case 'email':
                if (!REGEX.email.test(valor))
                    error = 'Formato de email inválido';
                break;

            case 'telefono':
                const d = valor.replace(/\D/g, '');
                if (d.length !== 10)
                    error = 'El teléfono debe tener exactamente 10 dígitos';
                break;

            case 'fechaNacimiento':
                const hoy = new Date();
                const fecha = new Date(valor);

                let edad = hoy.getFullYear() - fecha.getFullYear();
                const m = hoy.getMonth() - fecha.getMonth();

                if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;

                if (edad < 18)
                    error = 'Debes ser mayor de 18 años';
                break;

            case 'password':
                if (valor.length < 8) {
                    error = 'Mínimo 8 caracteres';
                } 
                else if (!/[A-Z]/.test(valor)) {
                    error = 'Debe tener al menos una letra mayúscula';
                } 
                else if (!/[0-9]/.test(valor)) {
                    error = 'Debe tener al menos un número';
                }
                break;

            case 'confirmar_password':
                const pass = document.querySelector('[name="password"]').value;
                if (valor !== pass)
                    error = 'Las contraseñas no coinciden';
                break;

            case 'terminos':
                if (!campo.checked)
                    error = 'Debes aceptar este campo';
                break;
        }
    }

    if (error) {
        mostrarError(campo, error);
        return false;
    } else {
        const div = campo.parentElement.querySelector('.error-mensaje');
        if (div) div.textContent = '';

        campo.classList.remove('campo--error');
        campo.classList.add('campo--valido');
        return true;
    }
}

function validarFormulario(form) {
    let valido = true;

    form.querySelectorAll('input, select').forEach(campo => {
        if (!validarCampo(campo)) {
            valido = false;
        }
    });

    return valido;
}