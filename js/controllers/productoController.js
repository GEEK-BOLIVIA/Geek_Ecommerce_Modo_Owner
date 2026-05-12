import { productoModel } from '../models/productoModel.js';
import { productoView } from '../views/productoView.js';
import { categoriasModel } from '../models/categoriasModel.js';
import { productoCategoriaModel } from '../models/productoCategoriaModel.js';
import { galeriaProductoModel } from '../models/galeriaProductoModel.js';
import { sucursalModel } from '../models/sucursalModel.js';
import { sucursalProductoModel } from '../models/sucursalProductoModel.js';
import { productManager } from '../modals/createProduct.js';
import { supabase } from '../config/supabaseClient.js';
import { configuracionColumnasController } from '../controllers/configuracionColumnasController.js';
import { detallesProductoView } from '../views/detallesProductoView.js';
import { deleteProductoView } from '../views/deleteProductoView.js';
import { usuarioModel } from '../models/usuarioModel.js';

export const productoController = {

    _columnasVisibles: [],
    _usuarioCache: null,
    _columnasCache: null,

    async _uploadToSupabase(file, folder, nombreProducto = 'producto') {
        try {
            const slug = nombreProducto
                .toLowerCase()
                .trim()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

            const fileExt = file.name.split('.').pop();
            const fileName = `${slug}_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { data, error } = await supabase.storage
                .from('Almacenamiento')
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicUrl } = supabase.storage
                .from('Almacenamiento')
                .getPublicUrl(filePath);

            return publicUrl.publicUrl;
        } catch (error) {
            console.error("Error en Storage:", error);
            throw new Error("Error al subir archivo al servidor.");
        }
    },

    async _procesarGaleria(galeriaRaw, nombreProducto) {
        if (!galeriaRaw || !Array.isArray(galeriaRaw)) return [];

        const promesas = galeriaRaw.map(async (item, index) => {
            const ordenFinal = (item.orden !== undefined && item.orden !== '')
                ? parseInt(item.orden) : index;

            // Archivo nuevo
            if (item.file instanceof File) {
                const url = await this._uploadToSupabase(item.file, 'galeria', nombreProducto);
                const tipo = item.file.type.startsWith('video') ? 'video' : 'imagen';
                return { url, tipo, orden: ordenFinal, nombre: item.file.name }; // ← nombre real
            }

            // URL existente
            if (typeof item.url === 'string' && item.url.startsWith('http')) {
                return {
                    url: item.url,
                    tipo: item.tipo || 'imagen',
                    orden: ordenFinal,
                    nombre: item.nombre || 'Archivo guardado'
                };
            }

            return null;
        });

        const resultados = await Promise.all(promesas);
        return resultados.filter(res => res !== null).sort((a, b) => a.orden - b.orden);
    },

    async inicializar() {
        productoView.mostrarCargando?.('Sincronizando inventario...');
        try {
            await this.refrescarVista();
            Swal.close();
        } catch (error) {
            console.error(error);
            productoView.notificarError?.('No se pudo cargar el catálogo de productos.');
        }
    },

    prefetch() {
        if (this._usuarioCache && this._columnasCache) return;
        const columnasPorDefecto = ['nro', 'imagen', 'nombre_producto', 'categoria', 'codigo', 'precio', 'stock', 'whatsapp', 'precio_pub', 'acciones'];
        usuarioModel.obtenerUsuarioActual()
            .then(u => {
                if (u) {
                    this._usuarioCache = u;
                    if (!this._columnasCache) {
                        configuracionColumnasController.obtenerColumnasVisibles('productos', columnasPorDefecto, u.id, u.rol)
                            .then(cols => { if (cols) this._columnasCache = cols; })
                            .catch(() => {});
                    }
                }
            })
            .catch(() => {});
    },

    async verDetalle(id) {
        try {
            productoView.mostrarCargando?.('Obteniendo información...');

            const [producto, idsCategorias, galeria, todasLasCategorias, sucursales] = await Promise.all([
                productoModel.obtenerPorId(id),
                productoCategoriaModel.obtenerCategoriasPorProducto(id),
                galeriaProductoModel.getByProducto(id),
                categoriasModel.obtenerTodas(),
                sucursalProductoModel.getByProducto(id) // ← agregar esto
            ]);

            if (!producto) throw new Error('No se encontró el producto.');

            const categoriasEnriquecidas = idsCategorias.map(idVinculado => {
                const catInfo = todasLasCategorias.find(c => c.id === idVinculado);
                return catInfo ? catInfo : { id: idVinculado, nombre: 'Categoría ' + idVinculado };
            });

            const productoNormalizado = {
                ...producto,
                nombre: producto.nombre || producto.producto_nombre || 'Sin nombre definido',
                mostrar_precio: producto.mostrar_precio ?? producto.price_visible ?? false,
                habilitar_whatsapp: producto.habilitar_whatsapp ?? producto.ws_active ?? false
            };

            // Enriquecer sucursales con nombre
            const todasLasSucursales = await sucursalModel.getAll();
            const sucursalesEnriquecidas = sucursales.map(sp => {
                const info = todasLasSucursales.find(s => s.id === sp.id_sucursal);
                return {
                    ...sp,
                    nombre: info ? info.nombre : `Sucursal ${sp.id_sucursal}`
                };
            });

            Swal.close();

            const contenedorPrincipal = document.getElementById('content-area');
            contenedorPrincipal.innerHTML = detallesProductoView.render(
                {
                    producto: productoNormalizado,
                    categorias: categoriasEnriquecidas,
                    galeria: galeria || [],
                    sucursales: sucursalesEnriquecidas  // ← pasar aquí
                },
                (p) => this.mostrarFormularioEditar(p.id),
                () => this.refrescarVista()
            );

            detallesProductoView.initEventListeners(
                productoNormalizado,
                (p) => this.mostrarFormularioEditar(p.id),
                () => this.refrescarVista()
            );

        } catch (error) {
            console.error('Error al mostrar detalle:', error);
            productoView.notificarError?.('No se pudo cargar la ficha del producto.');
        }
    },

    async refrescarVista() {
        try {
            const sucursalId = productoView._estado.sucursalSeleccionada;
            const columnasPorDefecto = ['nro', 'imagen', 'nombre_producto', 'categoria', 'codigo', 'precio', 'stock', 'whatsapp', 'precio_pub', 'acciones'];

            if (!this._usuarioCache) {
                const u = await usuarioModel.obtenerUsuarioActual();
                if (u) this._usuarioCache = u;
            }
            const usuario = this._usuarioCache;

            const [sucursales, categorias, productosRaw, columnasVisibles] = await Promise.all([
                sucursalModel.getAll(),
                categoriasModel.obtenerTodas(),
                sucursalId === 'todas'
                    ? productoModel.listarTodoDetallado()
                    : productoModel.listarActivos(sucursalId),
                this._columnasCache
                    ? Promise.resolve(this._columnasCache)
                    : configuracionColumnasController.obtenerColumnasVisibles('productos', columnasPorDefecto, usuario?.id, usuario?.rol)
                        .then(cols => { if (cols?.length) this._columnasCache = cols; return cols?.length ? cols : columnasPorDefecto; })
            ]);

            const productosNormalizados = productosRaw.map(p => ({
                ...p,
                id: p.id || p.producto_id,
                nombre: p.nombre || p.producto_nombre || 'Sin nombre',
                nombre_categoria: p.nombre_categoria || p.categoria_nombre || 'General',
                codigo: p.codigo || p.sku || ''
            }));

            window.productosRaw = productosNormalizados;

            productoView.render(productosNormalizados, categorias, sucursales, columnasVisibles);

            if (typeof Swal !== 'undefined') Swal.close();

        } catch (error) {
            console.error('Error en refrescarVista:', error);
            if (typeof Swal !== 'undefined') Swal.close();
            productoView.notificarError?.('Error al cargar los productos.');
        }
    },

    async toggleEstado(id, campo, nuevoEstado) {
        productoView.mostrarCargando?.('Actualizando producto...');
        try {
            const resultado = await productoModel.actualizar(id, { [campo]: nuevoEstado });
            if (resultado.exito) {
                await this.refrescarVista();
                productoView.notificarExito?.('Estado actualizado correctamente.');
            } else { throw new Error(resultado.mensaje); }
        } catch (error) {
            productoView.notificarError?.(error.message || 'Error al cambiar el estado.');
            this.refrescarVista();
        }
    },

    async toggleMasivoFiltrado(campo, nuevoEstado, ids) {
        try {
            productoView.mostrarCargando?.('Actualizando productos seleccionados...');

            // CAMBIO: De productoService a productoModel.actualizarVarios (que ya tienes en tu model)
            const resultado = await productoModel.actualizarVarios(ids, { [campo]: nuevoEstado });

            if (resultado.exito) {
                await this.refrescarVista();
                productoView.notificarExito?.(`${ids.length} productos actualizados correctamente.`);
            }
        } catch (error) {
            console.error(error);
            productoView.notificarError?.('Error en la actualización masiva.');
        }
    },
    /**
     * CREACIÓN DE PRODUCTO
     */
    async mostrarFormularioCrear() {
        try {
            // Carga paralela de lo necesario
            const [hijas, padres, sucursales] = await Promise.all([
                categoriasModel.obtenerHijas(),
                categoriasModel.obtenerPadres(),
                sucursalModel.getAll()
            ]);

            const datosForm = await productManager.start('content-area', hijas, {}, sucursales, padres);

            if (datosForm) {
                productoView.mostrarCargando?.('Guardando producto...');

                const [portadaUrl, itemsMultimedia] = await Promise.all([
                    datosForm.portada instanceof File
                        ? this._uploadToSupabase(datosForm.portada, 'portadas', datosForm.nombre)
                        : Promise.resolve(typeof datosForm.portada === 'string' ? datosForm.portada : ''),
                    this._procesarGaleria(datosForm.galeria, datosForm.nombre)
                ]);

                const resultado = await productoModel.crear({
                    nombre: datosForm.nombre,
                    codigo: datosForm.codigo,
                    descripcion: datosForm.descripcion,
                    ws_active: datosForm.ws_active,
                    price_visible: datosForm.price_visible,
                    portada: portadaUrl
                });

                if (resultado.exito) {
                    const nuevoId = resultado.data.id;
                    const promesas = [];
                    if ((datosForm.categoriasIds || []).length > 0) {
                        promesas.push(productoCategoriaModel.vincularMultiple(nuevoId, datosForm.categoriasIds));
                    }
                    if (itemsMultimedia.length > 0) {
                        promesas.push(galeriaProductoModel.createLote(nuevoId, itemsMultimedia));
                    }
                    promesas.push(sucursalProductoModel.sincronizar(nuevoId, datosForm.sucursales));

                    await Promise.all(promesas);
                    await this.refrescarVista();
                    productoView.notificarExito?.('Producto registrado correctamente.');
                } else {
                    productoView.notificarError?.(resultado.mensaje);
                }
            }
        } catch (error) {
            console.error(error);
            productoView.notificarError?.('Error al procesar la creación.');
        }
    },

    async mostrarFormularioEditar(id) {
        try {
            // Carga paralela incluyendo sucursales disponibles y las del producto
            const [producto, hijas, padres, categoriasVinculadas, galeriaActual, sucursales, sucursalesPrevias] = await Promise.all([
                productoModel.obtenerPorId(id),
                categoriasModel.obtenerHijas(),
                categoriasModel.obtenerPadres(),
                productoCategoriaModel.obtenerCategoriasPorProducto(id),
                galeriaProductoModel.getByProducto(id),
                sucursalModel.getAll(),
                sucursalProductoModel.getByProducto(id)
            ]);

            if (!producto) throw new Error('Producto no encontrado');

            let padreSeleccionadoId = null;
            if (categoriasVinculadas.length > 0) {
                const firstId = Number(categoriasVinculadas[0]);
                const asHija = hijas.find(h => Number(h.id) === firstId);
                if (asHija) padreSeleccionadoId = Number(asHija.id_padre);
                else if (padres.some(p => Number(p.id) === firstId)) padreSeleccionadoId = firstId;
            }

            const productoParaEdicion = {
                id: producto.id,
                nombre: producto.producto_nombre || producto.nombre || '',
                codigo: producto.codigo || '',
                descripcion: producto.descripcion || '',
                ws_active: producto.habilitar_whatsapp === true,
                price_visible: producto.mostrar_precio === true,
                portada: producto.imagen_url || '',
                categoriasIds: categoriasVinculadas || [],
                galeria: galeriaActual || [],
                sucursales: sucursalesPrevias || [],
                _padreSeleccionadoId: padreSeleccionadoId  // ← pista para start()
            };

            const datosEditados = await productManager.start(
                'content-area',
                hijas,
                productoParaEdicion,
                sucursales,
                padres   // ← 5to parámetro
            );

            if (datosEditados) {
                productoView.mostrarCargando?.('Actualizando producto...');

                let portadaFinal = producto.imagen_url;
                const archivoPortada = datosEditados.portada?.data || datosEditados.portada;

                const [portadaResuelta, nuevaGaleria] = await Promise.all([
                    archivoPortada instanceof File
                        ? this._uploadToSupabase(archivoPortada, 'portadas', datosEditados.nombre)
                        : Promise.resolve(typeof datosEditados.portada === 'string' ? datosEditados.portada : portadaFinal),
                    this._procesarGaleria(datosEditados.galeria, datosEditados.nombre)
                ]);
                portadaFinal = portadaResuelta;

                const updatePayload = {
                    nombre: datosEditados.nombre.trim(),
                    codigo: datosEditados.codigo,
                    descripcion: datosEditados.descripcion.trim(),
                    ws_active: datosEditados.ws_active,
                    price_visible: datosEditados.price_visible,
                    portada: portadaFinal
                };

                const res = await productoModel.actualizar(id, updatePayload);

                if (res.exito) {

                    await Promise.all([
                        productoCategoriaModel.actualizarRelaciones(id, datosEditados.categoriasIds),
                        galeriaProductoModel.limpiarGaleria(id),
                        sucursalProductoModel.sincronizar(id, datosEditados.sucursales)
                    ]);

                    if (nuevaGaleria.length > 0) {
                        await galeriaProductoModel.createLote(id, nuevaGaleria);
                    }

                    await this.refrescarVista();
                    productoView.notificarExito?.('¡Producto actualizado con éxito!');
                } else {
                    throw new Error(res.mensaje || 'Error al actualizar tabla principal');
                }
            }
        } catch (error) {
            console.error('LOG FINAL ERROR EN EDICIÓN:', error);
            productoView.notificarError?.('No se pudieron guardar los cambios: ' + error.message);
        }
    },
    async eliminar(id) {
        const confirmacion = await Swal.fire({
            title: '¿ELIMINAR PRODUCTO?',
            text: 'Esta acción borrará el producto y su stock en todas las sucursales. No se puede revertir.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'SÍ, ELIMINAR TODO',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#ef4444',
            reverseButtons: true,
            customClass: { popup: 'rounded-[32px]' }
        });

        if (confirmacion.isConfirmed) {
            try {
                // Las sucursales se eliminan en cascada por FK con ON DELETE CASCADE
                // Solo necesitamos hacer soft delete del producto base
                const resultado = await productoModel.eliminar(id);

                if (resultado.exito) {
                    await this.refrescarVista();
                    productoView.notificarExito('Producto eliminado del catálogo global.');
                } else {
                    throw new Error(resultado.mensaje);
                }
            } catch (error) {
                productoView.notificarError('Error al intentar eliminar el producto.');
            }
        }
    }
};
window.productoController = productoController;
window.configuracionColumnasController = configuracionColumnasController;