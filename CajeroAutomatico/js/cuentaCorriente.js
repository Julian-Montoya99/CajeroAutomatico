import { Cuenta } from './cuenta.js';

export class CuentaCorriente extends Cuenta {
    constructor(usuario, id, correo, contraseña) {
        super(usuario, id, correo, contraseña, 'corriente');
    }

    retirar(monto) {
        if (monto <= 0) return 'error al intentar retirar';

        if ((this.saldo - monto) >= -500000) {
            this.registrarMovimientos('retiro', monto);
            return 'retiro exitoso desde cuenta corriente';
        } else {
            return 'sobregiro excedido en cuenta corriente';
        }
    }
}
