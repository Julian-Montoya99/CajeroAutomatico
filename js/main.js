
import { cambiarClave, cerrarSesion, iniciarSesion, obtenerUsuarioActivo, registrarUsuario, cargarCuenta } from './sistema.js';

let cuentaActiva = null;

// Referencias DOM
const seccionLogin = document.getElementById('seccionLogin');
const seccionRegistro = document.getElementById('seccionRegistro');
const seccionMenuPrincipal = document.getElementById('seccionMenuPrincipal');
const seccionConsignar = document.getElementById('seccionConsignar');
const seccionRetirar = document.getElementById('seccionRetirar');
const seccionTransferencia = document.getElementById('seccionTransferencia');
const seccionMovimientos = document.getElementById('seccionMovimientos');
const seccionCambioPassword = document.getElementById('seccionCambioPassword');
const mensajeSistema = document.getElementById('mensajeSistema');

const nombreUsuarioSpan = document.getElementById('nombreUsuario');
const tipoCuentaSpan = document.getElementById('tipoCuenta');
const saldoCuentaSpan = document.getElementById('saldoCuenta');
const listaMovimientos = document.getElementById('listaMovimientos');

// Función para mostrar mensaje en pantalla
function mostrarMensaje(texto, esError = false) {
    mensajeSistema.textContent = texto;
    mensajeSistema.classList.remove('oculto');
    mensajeSistema.style.color = esError ? 'red' : 'green';
    setTimeout(() => {
        mensajeSistema.classList.add('oculto');
    }, 4000);
}

// Función para mostrar una sección y ocultar las demás
function mostrarSeccion(seccion) {
    const secciones = [
        seccionLogin,
        seccionRegistro,
        seccionMenuPrincipal,
        seccionConsignar,
        seccionRetirar,
        seccionTransferencia,
        seccionMovimientos,
        seccionCambioPassword
    ];
    secciones.forEach(sec => {
        if (sec === seccion) sec.classList.remove('oculto');
        else sec.classList.add('oculto');
    });
}

// Actualizar datos de usuario en menú principal
function actualizarDatosUsuario() {
    if (!cuentaActiva) return;
    nombreUsuarioSpan.textContent = cuentaActiva.usuario;
    tipoCuentaSpan.textContent = cuentaActiva.tipoCuenta;
    saldoCuentaSpan.textContent = cuentaActiva.consultarSaldo();
}

// Manejar formulario login
document.getElementById('formLogin').addEventListener('submit', e => {
    e.preventDefault();
    const usuario = document.getElementById('usuarioLogin').value.trim();
    const contraseña = document.getElementById('passwordLogin').value.trim();

    const resultado = iniciarSesion(usuario, contraseña);
    if (resultado === 'Login exitoso') {
        cuentaActiva = cargarCuenta(usuario);
        actualizarDatosUsuario();
        mostrarSeccion(seccionMenuPrincipal);
        mostrarMensaje('Bienvenido ' + usuario);
        e.target.reset();
    } else {
        mostrarMensaje(resultado, true);
    }
});

// Botón para mostrar registro
document.getElementById('btnMostrarRegistro').addEventListener('click', () => {
    mostrarSeccion(seccionRegistro);
});

// Botón para volver a login desde registro
document.getElementById('btnRegresarLogin').addEventListener('click', () => {
    mostrarSeccion(seccionLogin);
});

// Manejar formulario registro
document.getElementById('formRegistro').addEventListener('submit', e => {
    e.preventDefault();
    const usuario = document.getElementById('usuarioRegistro').value.trim();
    const id = document.getElementById('idRegistro').value.trim();
    const correo = document.getElementById('correoRegistro').value.trim();
    const contraseña = document.getElementById('passwordRegistro').value.trim();
    const contraseñaConfirmar = document.getElementById('passwordConfirmacion').value.trim();
    const tipoCuentaRadio = document.querySelector('input[name="tipoCuenta"]:checked');
    if (!tipoCuentaRadio) {
        mostrarMensaje('Seleccione un tipo de cuenta', true);
        return;
    }
    const tipoCuenta = tipoCuentaRadio.value;

    const resultado = registrarUsuario(usuario, id, correo, contraseña, contraseñaConfirmar, tipoCuenta);
    if (resultado === 'Usuario registrado exitosamente') {
        mostrarMensaje('Registro exitoso, ya puede iniciar sesión');
        mostrarSeccion(seccionLogin);
        e.target.reset();
    } else {
        mostrarMensaje(resultado, true);
    }
});

// Botón cerrar sesión
document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    cerrarSesion();
    cuentaActiva = null;
    mostrarSeccion(seccionLogin);
    mostrarMensaje('Sesión cerrada');
});

// Botones menú principal
document.getElementById('btnConsignar').addEventListener('click', () => {
    mostrarSeccion(seccionConsignar);
});
document.getElementById('btnRetirar').addEventListener('click', () => {
    mostrarSeccion(seccionRetirar);
});
document.getElementById('btnTransferir').addEventListener('click', () => {
    mostrarSeccion(seccionTransferencia);
});
document.getElementById('btnVerMovimientos').addEventListener('click', () => {
    mostrarSeccion(seccionMovimientos);
    listaMovimientos.innerHTML = cuentaActiva.verMovimientos();
});
document.getElementById('btnCambiarPassword').addEventListener('click', () => {
    mostrarSeccion(seccionCambioPassword);
});

// Formularios acciones

// Consignar dinero
document.getElementById('formConsignacionMonto').addEventListener('submit', e => {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('inputMontoConsignar').value);
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje('Monto inválido', true);
        return;
    }
    const mensaje = cuentaActiva.consignar(monto);
    actualizarDatosUsuario();
    mostrarMensaje(mensaje);
    e.target.reset();
    mostrarSeccion(seccionMenuPrincipal);
});
document.getElementById('btnCancelarConsignacion').addEventListener('click', () => {
    mostrarSeccion(seccionMenuPrincipal);
});

// Retirar dinero
document.getElementById('formMontoRetiro').addEventListener('submit', e => {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('inputMontoRetirar').value);
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje('Monto inválido', true);
        return;
    }
    const mensaje = cuentaActiva.retirar(monto);
    actualizarDatosUsuario();
    mostrarMensaje(mensaje.includes('exito') ? mensaje : mensaje, mensaje.includes('exito') ? false : true);
    e.target.reset();
    mostrarSeccion(seccionMenuPrincipal);
});
document.getElementById('btnCancelarRetiro').addEventListener('click', () => {
    mostrarSeccion(seccionMenuPrincipal);
});

// Transferencia
document.getElementById('formTransferencia').addEventListener('submit', e => {
    e.preventDefault();
    const destinoUsuario = document.getElementById('inputUsuarioDestino').value.trim();
    const monto = parseFloat(document.getElementById('inputMontoTransferencia').value);
    if (!destinoUsuario) {
        mostrarMensaje('Ingrese usuario destino', true);
        return;
    }
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje('Monto inválido', true);
        return;
    }
    if (destinoUsuario === cuentaActiva.usuario) {
        mostrarMensaje('No puede transferirse a sí mismo', true);
        return;
    }
    const mensaje = cuentaActiva.transferir(destinoUsuario, monto);
    actualizarDatosUsuario();
    mostrarMensaje(mensaje.includes('exito') ? mensaje : mensaje, mensaje.includes('exito') ? false : true);
    e.target.reset();
    mostrarSeccion(seccionMenuPrincipal);
});
document.getElementById('btnCancelarTransferencia').addEventListener('click', () => {
    mostrarSeccion(seccionMenuPrincipal);
});

// Cambio de contraseña
document.getElementById('formCambioPassword').addEventListener('submit', e => {
    e.preventDefault();
    const contraseñaActual = document.getElementById('contraseñaActual').value.trim();
    const contraseñaNueva = document.getElementById('contraseñaNueva').value.trim();
    const ConfirmarContraseña = document.getElementById('ConfirmarContraseña').value.trim();

    const resultado = cambiarClave(cuentaActiva.usuario, contraseñaActual, contraseñaNueva, ConfirmarContraseña);
    if (resultado === 'Contraseña actualizada') {
        mostrarMensaje(resultado);
        e.target.reset();
        mostrarSeccion(seccionMenuPrincipal);
    } else {
        mostrarMensaje(resultado, true);
    }
});
document.getElementById('btnCancelarCambioPassword').addEventListener('click', () => {
    mostrarSeccion(seccionMenuPrincipal);
});

// Al cargar la página, si hay usuario activo, cargar su cuenta y mostrar menú principal
window.addEventListener('load', () => {
    const usuarioActivo = obtenerUsuarioActivo();
    if (usuarioActivo) {
        cuentaActiva = cargarCuenta(usuarioActivo);
        actualizarDatosUsuario();
        mostrarSeccion(seccionMenuPrincipal);
    } else {
        mostrarSeccion(seccionLogin);
    }
});

//Volver desde movimientos
document.getElementById('btnVolverDesdeMovimientos').addEventListener('click', () =>{
  mostrarSeccion(seccionMenuPrincipal);
});

//Cambiar Tema
document.getElementById('btnCambiarTema').addEventListener('click', cambiarTema);
document.getElementById('btnCambiarTema1').addEventListener('click', cambiarTema);

function cambiarTema(){
  document.body.classList.toggle('modo-oscuro');

  const botonesCambioTema = document.querySelectorAll('button');
  botonesCambioTema.forEach(button => {
    button.classList.toggle('modo-oscuro');
  });
}
