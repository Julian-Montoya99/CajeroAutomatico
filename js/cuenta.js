
import { cargarCuenta } from "./sistema.js";


export class Cuenta {
    constructor (usuario, id, correo, contraseña, tipoCuenta){
        this.usuario = usuario;
        this.id = id;
        this.correo = correo;
        this.contraseña = contraseña;
        this.tipoCuenta = tipoCuenta;
        this.saldo = 0;
        this.movimientos = [];
    }
    
    //Registrar los movimientos
    registrarMovimientos(tipo, monto){
        const fecha = new Date().toLocaleString();
        this.movimientos.push({tipo, monto, fecha});
        const tipoMovimiento = tipo.toLowerCase();
        if (tipoMovimiento === 'consignacion' || tipoMovimiento === 'transferencia recibida'){
            this.saldo += monto;
        }else if (tipoMovimiento === 'retiro' || tipoMovimiento === 'transferencia enviada'){
            this.saldo -= monto;
        }
        this.guardarCuenta();
    }

    //Guardar en la cuenta
    guardarCuenta(){
        const clave = `cuenta_${this.usuario}`;
        localStorage.setItem(clave, JSON.stringify(this));
    }

    //Cargar la cuenta
/*     static cargarCuenta(usuario){
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
        }else{
            cuenta = new Cuenta(obj.usuario, obj.id, obj.correo, obj.contraseña, obj.tipoCuenta)
        }

        cuenta.saldo = obj.saldo;
        cuenta.movimientos = obj.movimientos;
        return cuenta;
    } */

    //funcion para consultar saldo
    consultarSaldo(){
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(this.saldo);
    };

    //Consignar
    consignar(monto){
        if (monto > 0){
            this.registrarMovimientos('consignacion', monto);
            return `Consignación realizada con exito.`;
        } else {
            return 'error al realizar la consignación';
        }
    }

    //Retirar
    retirar(monto) {
        if (monto <= 0) return 'error al intentar retirar';

        if (this.tipoCuenta === 'corriente') {
            if ((this.saldo - monto) >= -500000) {
                this.registrarMovimientos('retiro', monto);
                return 'retiro realizado con exito';
            } else {
                return 'sobregiro_excedido';
            }
        }

        if (this.tipoCuenta === 'ahorro') {
            if (this.saldo >= monto) {
                this.registrarMovimientos('retiro', monto);
                return 'exito';
            } else {
                return 'fondos insuficientes';
            }
        }

        return 'tipo_no_valido';
    }


    //Transferir
    transferir(destinoUsuario, monto){
        if (typeof monto !== 'number' || monto <= 0){
            return 'Monto invalido';
        }

        let saldoDisponible = this.saldo;
        if (this.tipoCuenta === 'corriente'){
            saldoDisponible += 500000;
        }
        if (monto > saldoDisponible){
            return 'Fondos insuficientes';
        }

        const cuentaDestino = cargarCuenta(destinoUsuario);
        if (!cuentaDestino){
            return 'Cuenta destino no encontrada';
        }

        this.registrarMovimientos('transferencia enviada', monto);
        cuentaDestino.registrarMovimientos('transferencia recibida', monto);

        return 'transferencia exitosa.'
    }

    //Ver movimientos
    verMovimientos() {
        return this.movimientos.slice().reverse().map((mov) => {
            return `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <strong>Tipo:</strong> ${mov.tipo} <br>
                <strong>Monto:</strong> ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(mov.monto)} <br>
                <strong>Fecha:</strong> ${mov.fecha}
            </div>
            `;
        }).join('');
    }
}