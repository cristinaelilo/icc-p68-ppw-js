'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#form-registro');
    const tel = document.querySelector('#telefono');
    const pass = document.querySelector('#password');
    const btn = document.querySelector('#btn-enviar');
    const limpiar = document.querySelector('#btn-limpiar');

    btn.disabled = true;

    // =========================
    // AUTOGUARDADO
    // =========================
    form.addEventListener('input', () => {
        const datos = Object.fromEntries(new FormData(form));
        localStorage.setItem('formRegistro', JSON.stringify(datos));
    });

    const datosGuardados = JSON.parse(localStorage.getItem('formRegistro'));

    if (datosGuardados) {
        Object.keys(datosGuardados).forEach(key => {
            const campo = form.elements[key];
            if (!campo) return;

            if (campo.type === 'checkbox') {
                campo.checked = datosGuardados[key];
            } else {
                campo.value = datosGuardados[key];
            }
        });
    }

    // =========================
    // TELÉFONO
    // =========================
    tel.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 10);

        if (v.length >= 6)
            v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
        else if (v.length >= 3)
            v = `(${v.slice(0,3)}) ${v.slice(3)}`;

        e.target.value = v;
    });

    // =========================
    // CONTRASEÑA
    // =========================
    pass.addEventListener('input', e => {
        const val = e.target.value;
        const indicador = document.querySelector('#password-strength');

        let fuerza = 'Muy débil';
        let mensaje = '';

        pass.classList.remove('campo--valido', 'campo--error');

        if (val.length === 0) {
            indicador.textContent = 'Fuerza: -';
            return;
        }

        if (val.length < 8) {
            fuerza = 'Muy débil';
            pass.classList.add('campo--error');
        } 
        else if (!/[A-Z]/.test(val)) {
            fuerza = 'Débil';
            mensaje = 'Debe tener al menos una letra mayúscula';
            pass.classList.add('campo--error');
        } 
        else if (!/[0-9]/.test(val)) {
            fuerza = 'Media';
            mensaje = 'Debe tener al menos un número';
            pass.classList.add('campo--error');
        } 
        else if (!/[^A-Za-z0-9]/.test(val)) {
            fuerza = 'Fuerte';
            pass.classList.add('campo--valido');
        } 
        else {
            fuerza = 'Muy fuerte';
            pass.classList.add('campo--valido');
        }

        indicador.textContent = mensaje 
            ? `Fuerza: ${fuerza} - ${mensaje}`
            : `Fuerza: ${fuerza}`;

        // limpiar error visual
        if (pass.classList.contains('campo--valido')) {
            const errorDiv = pass.parentElement.querySelector('.error-mensaje');
            if (errorDiv) errorDiv.textContent = '';
        }
    });

    // =========================
    // VALIDACIÓN EN TIEMPO REAL
    // =========================
    form.addEventListener('input', e => {
        if (e.target.matches('input, select')) {

            if (e.target.name !== 'password') {
                limpiarError(e.target);
            }

            btn.disabled = !validarFormulario(form);
        }
    });

    form.addEventListener('focusout', e => {
        if (e.target.matches('input, select')) {
            validarCampo(e.target);
        }
    });

    // =========================
    // SUBMIT
    // =========================
    form.addEventListener('submit', e => {
        e.preventDefault();

        if (validarFormulario(form)) {

            console.log('Datos a enviar:');
            console.table(Object.fromEntries(new FormData(form)));

            alert('Registro completado exitosamente');

            form.reset();
            btn.disabled = true;

            localStorage.removeItem('formRegistro');

            document.querySelector('#password-strength').textContent = 'Fuerza: -';

        } else {
            const error = form.querySelector('.campo--error');
            if (error) {
                error.scrollIntoView({ behavior: 'smooth' });
                error.focus();
            }
        }
    });

    // =========================
    // LIMPIAR
    // =========================
    limpiar.addEventListener('click', () => {

        if (!confirm('¿Seguro que deseas limpiar el formulario?')) return;

        form.reset();
        btn.disabled = true;

        localStorage.removeItem('formRegistro');

        document.querySelectorAll('.campo--error, .campo--valido')
            .forEach(el => el.classList.remove('campo--error','campo--valido'));

        document.querySelectorAll('.error-mensaje')
            .forEach(el => el.textContent = '');

        document.querySelector('#password-strength').textContent = 'Fuerza: -';
    });

});