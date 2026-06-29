import { empresaModel } from '../models/empresaModel.js';
import { empresaView } from '../views/empresaView.js';
import { empresaFormView } from '../views/empresaFormView.js';
import { configuracionColumnasController } from './configuracionColumnasController.js';
import { usuarioModel } from '../models/usuarioModel.js';
import { selectorUtil } from '../utils/selectorUtil.js';

export const empresaController = {
    _datosCache: [],
    _columnasVisibles: [],

    async inicializar(silencioso = false) {
        try {
            if (!silencioso) selectorUtil.limpiar();
            if (!silencioso) empresaView.mostrarCargando('Cargando empresas...');

            const usuario = await usuarioModel.obtenerUsuarioActual();

            const [columnasVisibles, data] = await Promise.all([
                configuracionColumnasController.obtenerColumnasVisibles(
                    'empresas',
                    ['nro', 'logo', 'nombre', 'acciones'],
                    usuario?.id, usuario?.rol
                ),
                empresaModel.getAll()
            ]);

            this._columnasVisibles = columnasVisibles;
            this._datosCache = data;

            empresaView.render(this._datosCache, this._columnasVisibles);
            if (!silencioso) Swal.close();
        } catch (error) {
            console.error('Error en inicializar:', error);
            empresaView.notificarError('Error al conectar con la base de datos de empresas.');
        }
    },

    // ─────────────────────────────────────────────
    // CREAR
    // ─────────────────────────────────────────────
    async mostrarFormularioCrear() {
        empresaView.mostrarCargando('Cargando formulario...');
        await new Promise(r => setTimeout(r, 600));
        Swal.close();

        await empresaFormView.abrir({
            esEdicion: false,
            onGuardar: async (datos, archivoLogo) => {
                try {
                    empresaView.mostrarCargando('Guardando...');
                    await empresaModel.create(datos, archivoLogo);
                    await this.inicializar(true);
                    empresaView.notificarExito('La empresa ha sido registrada correctamente.');
                } catch (error) {
                    empresaView.notificarError('No se pudo registrar la empresa.');
                }
            },
            onCancelar: () => this.inicializar(true)
        });
    },

    // ─────────────────────────────────────────────
    // EDITAR
    // ─────────────────────────────────────────────
    async editar(id) {
        const empresa = this._datosCache.find(e => e.id == id);
        if (!empresa) return;

        empresaView.mostrarCargando('Cargando editor...');
        await new Promise(r => setTimeout(r, 600));
        Swal.close();

        await empresaFormView.abrir({
            datos: empresa,
            esEdicion: true,
            onGuardar: async (datos, archivoLogo) => {
                try {
                    empresaView.mostrarCargando('Actualizando...');
                    await empresaModel.update(id, datos, archivoLogo);
                    await this.inicializar(true);
                    empresaView.notificarExito('Cambios aplicados con éxito.');
                } catch (error) {
                    empresaView.notificarError('Error al intentar actualizar la empresa.');
                }
            },
            onCancelar: () => this.inicializar(true)
        });
    },

    // ─────────────────────────────────────────────
    // VER DETALLE — retorna false | true (editar) | 'eliminar'
    // ─────────────────────────────────────────────
    async verDetalle(id) {
        const empresa = this._datosCache.find(e => e.id == id);
        if (!empresa) return;

        const resultado = await empresaView.mostrarDetalle(empresa);

        if (resultado === true) {
            const confirmacion = await empresaView.confirmarAccion({
                titulo: '¿Modificar Empresa?',
                nombreEntidad: empresa.nombre,
                mensajePersonalizado: 'Estás por entrar al modo de edición para:',
                botonConfirmar: 'Ir a Editar'
            });
            if (confirmacion.isConfirmed) {
                empresaView.mostrarCargando('Cargando editor...');
                await new Promise(r => setTimeout(r, 600));
                Swal.close();
                this.editar(id);
            } else {
                this.inicializar(true);
            }

        } else if (resultado === 'eliminar') {
            empresaView.mostrarCargando('Cargando confirmación...');
            await new Promise(r => setTimeout(r, 600));
            Swal.close();
            this.confirmarEliminacion(id);

        } else {
            empresaView.mostrarCargando('Volviendo...');
            await new Promise(r => setTimeout(r, 400));
            await this.inicializar(true);
            Swal.close(); // <-- CORRECCIÓN: Cierra explícitamente el splash de carga al retornar
        }
    },

    // ─────────────────────────────────────────────
    // ELIMINAR
    // ─────────────────────────────────────────────
    async confirmarEliminacion(id) {
        const empresa = this._datosCache.find(e => e.id == id);
        if (!empresa) return;

        const confirmo = await empresaView.mostrarConfirmacionEliminar(empresa);

        if (confirmo) {
            try {
                empresaView.mostrarCargando('Eliminando datos...');
                await empresaModel.delete(id);
                await this.inicializar(true);
                empresaView.notificarExito('La empresa ha sido removida exitosamente.');
            } catch (error) {
                console.error(error);
                empresaView.notificarError('Error al intentar eliminar la empresa.');
            }
        } else {
            this.inicializar(true);
        }
    },

    refrescarVista() {
        empresaView.render(this._datosCache, this._columnasVisibles);
    },

    async eliminarMasivo(ids) {
        empresaView.mostrarCargando('Eliminando empresas seleccionadas...');
        try {
            for (const id of ids) {
                await empresaModel.delete(id);
            }
            empresaView.limpiarSeleccion();
            await this.inicializar(true);
            empresaView.notificarExito(`${ids.length} empresas eliminadas correctamente.`);
        } catch (error) {
            console.error(error);
            empresaView.notificarError('Error al eliminar algunas empresas.');
        }
    }
};

window.empresaController = empresaController;