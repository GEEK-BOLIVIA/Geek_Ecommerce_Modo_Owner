import { mosaicoModel } from '../models/mosaicoModel.js';
import { empresaModel } from '../models/empresaModel.js'; // Integración modular requerida
import { mosaicoView } from '../views/mosaicoView.js';
import { mosaicoFormView } from '../views/mosaicoFormView.js';
import { configuracionColumnasController } from './configuracionColumnasController.js';
import { usuarioModel } from '../models/usuarioModel.js';
import { selectorUtil } from '../utils/selectorUtil.js';

export const mosaicoController = {
    _datosCache: [],
    _columnasVisibles: [],

    async inicializar(silencioso = false) {
        try {
            if (!silencioso) selectorUtil.limpiar();
            if (!silencioso) mosaicoView.mostrarCargando('Cargando mosaicos publicitarios...');

            const usuario = await usuarioModel.obtenerUsuarioActual();

            const [columnasVisibles, data] = await Promise.all([
                configuracionColumnasController.obtenerColumnasVisibles(
                    'carruseles', // Clave identificadora para configuración de columnas visibles
                    ['nro', 'nombre', 'ubicacion', 'acciones'],
                    usuario?.id, usuario?.rol
                ),
                mosaicoModel.getAllAdmin()
            ]);

            this._columnasVisibles = columnasVisibles;
            this._datosCache = data;

            mosaicoView.render(this._datosCache, this._columnasVisibles);
            if (!silencioso) Swal.close();
        } catch (error) {
            console.error('Error al inicializar mosaicos:', error);
            mosaicoView.notificarError('Error al recuperar las grillas de mosaicos promocionales.');
        }
    },

    // ─────────────────────────────────────────────
    // CREAR
    // ─────────────────────────────────────────────
    async mostrarFormularioCrear() {
        mosaicoView.mostrarCargando('Cargando configuraciones...');
        
        try {
            // Obtenemos de forma limpia las empresas activas desde el otro modelo independiente
            const empresasDisponibles = await empresaModel.getAll();
            Swal.close();

            await mosaicoFormView.abrir({
                esEdicion: false,
                empresas: empresasDisponibles,
                onGuardar: async (config, banners, archivosBanners) => {
                    try {
                        mosaicoView.mostrarCargando('Guardando grilla publicitaria...');
                        await mosaicoModel.guardar(null, config, banners, archivosBanners);
                        await this.inicializar(true);
                        mosaicoView.notificarExito('El mosaico promocional se ha registrado correctamente.');
                    } catch (error) {
                        mosaicoView.notificarError(error.message || 'No se pudo guardar la configuración del mosaico.');
                    }
                },
                onCancelar: () => this.inicializar(true)
            });
        } catch (error) {
            console.error(error);
            mosaicoView.notificarError('No se pudo abrir el formulario de creación.');
        }
    },

    // ─────────────────────────────────────────────
    // EDITAR
    // ─────────────────────────────────────────────
    async editar(id) {
        mosaicoView.mostrarCargando('Cargando datos para edición...');
        
        try {
            // Para editar requerimos la información detallada que contiene los banners hijos
            const [mosaicoCompleto, empresasDisponibles] = await Promise.all([
                mosaicoModel.getById(id),
                empresaModel.getAll()
            ]);
            Swal.close();

            if (!mosaicoCompleto) {
                throw new Error('No se pudo encontrar el mosaico solicitado.');
            }

            await mosaicoFormView.abrir({
                datos: mosaicoCompleto,
                esEdicion: true,
                empresas: empresasDisponibles,
                onGuardar: async (config, banners, archivosBanners) => {
                    try {
                        mosaicoView.mostrarCargando('Actualizando grilla publicitaria...');
                        await mosaicoModel.guardar(id, config, banners, archivosBanners);
                        await this.inicializar(true);
                        mosaicoView.notificarExito('Mosaico publicitario actualizado con éxito.');
                    } catch (error) {
                        mosaicoView.notificarError(error.message || 'No se pudieron aplicar los cambios.');
                    }
                },
                onCancelar: () => this.inicializar(true)
            });
        } catch (error) {
            console.error(error);
            mosaicoView.notificarError('Error al intentar abrir el editor de mosaicos.');
        }
    },

    // ─────────────────────────────────────────────
    // VER DETALLE — retorna false | true (editar) | 'eliminar'
    // ─────────────────────────────────────────────
    async verDetalle(id) {
        try {
            mosaicoView.mostrarCargando('Obteniendo detalles del mosaico...');
            const mosaico = await mosaicoModel.getById(id);
            Swal.close();

            if (!mosaico) {
                mosaicoView.notificarError('No se pudo cargar la información del mosaico publicitario.');
                return;
            }

            const resultado = await mosaicoView.mostrarDetalle(mosaico);

            if (resultado === true) {
                const confirmacion = await mosaicoView.confirmarAccion({
                    titulo: '¿Modificar Mosaico?',
                    nombreEntidad: mosaico.nombre_identificador,
                    mensajePersonalizado: 'Estás por entrar al modo de edición para:',
                    botonConfirmar: 'Ir a Editar'
                });
                if (confirmacion.isConfirmed) {
                    this.editar(id);
                } else {
                    this.inicializar(true);
                }

            } else if (resultado === 'eliminar') {
                this.confirmarEliminacion(id);
            } else {
                mosaicoView.mostrarCargando('Volviendo...');
                await new Promise(r => setTimeout(r, 400));
                await this.inicializar(true);
                Swal.close(); // Resuelve el estado de carga al regresar
            }
        } catch (error) {
            console.error(error);
            mosaicoView.notificarError('Ocurrió un error inesperado al procesar los detalles.');
        }
    },

    // ─────────────────────────────────────────────
    // ELIMINAR
    // ─────────────────────────────────────────────
    async confirmarEliminacion(id) {
        const mosaico = this._datosCache.find(m => m.id == id);
        if (!mosaico) return;

        const confirmo = await mosaicoView.mostrarConfirmacionEliminar(mosaico);

        if (confirmo) {
            try {
                mosaicoView.mostrarCargando('Eliminando datos del mosaico...');
                await mosaicoModel.delete(id);
                await this.inicializar(true);
                mosaicoView.notificarExito('El mosaico promocional se ha removido exitosamente.');
            } catch (error) {
                console.error(error);
                mosaicoView.notificarError('Error al intentar eliminar el mosaico publicitario.');
            }
        } else {
            this.inicializar(true);
        }
    },

    // ─────────────────────────────────────────────
    // CAMBIO DE VISIBILIDAD (ACTIVO/INACTIVO)
    // ─────────────────────────────────────────────
    async toggleActivo(id, activoNuevo) {
        try {
            mosaicoView.mostrarCargando('Actualizando estado...');
            const respuesta = await mosaicoModel.toggleActivo(id, activoNuevo);
            if (respuesta.success) {
                await this.inicializar(true);
                mosaicoView.notificarExito('La visibilidad del mosaico promocional ha sido modificada.');
            } else {
                throw new Error(respuesta.error);
            }
        } catch (error) {
            console.error(error);
            mosaicoView.notificarError('No se pudo actualizar el estado de visibilidad del mosaico.');
        }
    },

    refrescarVista() {
        mosaicoView.render(this._datosCache, this._columnasVisibles);
    },

    async eliminarMasivo(ids) {
        mosaicoView.mostrarCargando('Eliminando mosaicos publicitarios...');
        try {
            for (const id of ids) {
                await mosaicoModel.delete(id);
            }
            mosaicoView.limpiarSeleccion();
            await this.inicializar(true);
            mosaicoView.notificarExito(`${ids.length} mosaicos eliminados correctamente.`);
        } catch (error) {
            console.error(error);
            mosaicoView.notificarError('Ocurrió un error al intentar eliminar algunas grillas de mosaicos.');
        }
    }
};

window.mosaicoController = mosaicoController;