import { Cuenta } from "./cuenta.js";
import { CuentaAhorro } from "./cuentaAhorro.js";
import { CuentaCorriente } from "./cuentaCorriente.js";
/* import { cargarCuenta } from "./gestionUsuarios.js"; */

//Cargar cuenta
export function cargarCuenta(usuario){
    const clave = `cuenta_${usuario}`;
        const datos = localStorage.getItem(clave);
        if (!datos) return null;

        const obj = JSON.parse(datos);
        
        let cuenta;
        if (obj.tipoCuenta === 'ahorro'){
            cuenta = new CuentaAhorro(obj.usuario, obj.id, obj.correo, obj.contraseña);
            cuenta.saldo = obj.saldo;
            cuenta.movimientos = obj.movimientos;
            cuenta.ultimaFechaInteres = obj.ultimaFechaInteres || null;
            cuenta.aplicarInteres();
        } else if (obj.tipoCuenta === 'corriente'){
            cuenta = new CuentaCorriente(obj.usuario, obj.id, obj.correo, obj.contraseña);
            cuenta.saldo = obj.saldo;
            cuenta.movimientos = obj.movimientos;
        }else{
            cuenta = new Cuenta(obj.usuario, obj.id, obj.correo, obj.contraseña, obj.tipoCuenta)
            cuenta.saldo = obj.saldo;
            cuenta.movimientos = obj.movimientos;
        }

        return cuenta;
}
// Registro
export function registrarUsuario(usuario, id, correo, contraseña,contraseñaConfirmar, tipoCuenta) {
    if (cargarCuenta(usuario)) {
        return 'Usuario ya existe';
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
        return "Correo electrónico inválido.";
    }
    if (!/^\d{4}$/.test(contraseña)) {
        return "La contraseña debe ser numérica y tener 4 dígitos.";
    }
    if (contraseña !== contraseñaConfirmar) {
        return "Las contraseñas no coinciden.";
    }
    
    let nuevaCuenta;
    if (tipoCuenta === 'ahorro'){
        nuevaCuenta = new CuentaAhorro(usuario, id, correo, contraseña);
    } else if (tipoCuenta === 'corriente'){
        nuevaCuenta = new CuentaCorriente(usuario, id, correo, contraseña);
    } else {
        return 'tipo de cuenta no valido';
    }

    nuevaCuenta.guardarCuenta();
    return 'Usuario registrado exitosamente';
}

// Inicio de sesión
export function iniciarSesion(usuario, contraseña) {
    const cuenta = cargarCuenta(usuario);
    if (!cuenta) return 'Usuario no encontrado';
    if (cuenta.contraseña !== contraseña) return 'Contraseña incorrecta';

    sessionStorage.setItem('usuarioActivo', usuario);
    return 'Login exitoso';
}

// Cerrar sesión
export function cerrarSesion() {
    sessionStorage.removeItem('usuarioActivo');
    // Opcional: redirigir o actualizar interfaz
}

// Cambiar contraseña
export function cambiarClave(usuario, contraseñaActual, contraseñaNueva, ConfirmarContraseña) {
    const cuenta = cargarCuenta(usuario);
    if (!cuenta) return 'Usuario no encontrado';
    if (cuenta.contraseña !== contraseñaActual) return 'Contraseña actual incorrecta';
    if (contraseñaNueva !== ConfirmarContraseña) return 'Contraseña nueva no coincide';

    cuenta.contraseña = contraseñaNueva;
    cuenta.guardarCuenta();
    return 'Contraseña actualizada';
}

// Función para obtener usuario logueado
export function obtenerUsuarioActivo() {
    return sessionStorage.getItem('usuarioActivo');
}
