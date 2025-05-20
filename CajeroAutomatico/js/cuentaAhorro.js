import { Cuenta } from "./cuenta.js";

export class CuentaAhorro extends Cuenta {
    constructor(usuario, id, correo, contraseña) {
        super(usuario, id, correo, contraseña, 'ahorro');
        this.tasaInteres = 0.01;
        this.ultimaFechaInteres = null;
    }

    retirar(monto) {
        if (monto <= 0) return 'error al intentar retirar';

        if (this.saldo >= monto) {
            this.registrarMovimientos('retiro', monto);
            return 'retiro exitoso desde cuenta de ahorro';
        } else {
            return 'fondos insuficientes en cuenta de ahorro';
        }
    }
    aplicarInteres(){
        const hoy = new Date();
        const añoMesActual = hoy.toISOString().slice(0,7);
        if (this.ultimaFechaInteres === añoMesActual){
            return;
        }

        const interes = this.saldo * this.tasaInteres;
        if(interes > 0 ){
            this.saldo += interes;
            this.registrarMovimientos('interes ganado', interes);
            this.ultimaFechaInteres = añoMesActual;
            this.guardarCuenta();
        }
    }
}
