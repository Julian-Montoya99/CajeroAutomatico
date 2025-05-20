import { Cuenta } from "./cuenta.js";
import { CuentaAhorro } from "./cuentaAhorro.js";
import { CuentaCorriente } from "./cuentaCorriente.js";

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