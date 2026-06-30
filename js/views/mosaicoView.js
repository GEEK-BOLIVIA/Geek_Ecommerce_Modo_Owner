import { PaginationHelper } from '../utils/paginationHelper.js';
import { ActionButtons } from '../utils/componentUtils.js';
import { selectorUtil } from '../utils/selectorUtil.js';

export const mosaicoView = {

    _estado: {
        busqueda: '',
        orden: 'asc',
        paginaActual: 1,
        filasPorPagina: 10
    },

    // ─────────────────────────────────────────────
    // SELECCIÓN POR LOTE
    // ─────────────────────────────────────────────

    toggleLote(id) {
        selectorUtil.toggle(id, (cant) => this._actualizarBarraFlotante(cant));
        const fila = document.querySelector(`input.fila-checkbox-mos[data-id="${id}"]`)?.closest('tr');
        if (fila) fila.classList.toggle('bg-blue-50/70', selectorUtil.estado.seleccionados.includes(String(id)));
    },

    toggleLoteTodos(datos) {
        selectorUtil.toggleTodos(datos, (cant) => this._actualizarBarraFlotante(cant));
        const isAllChecked = selectorUtil.estado.seleccionados.length >= datos.length;
        document.querySelectorAll('input.fila-checkbox-mos').forEach(chk => {
            chk.checked = isAllChecked;
            chk.closest('tr')?.classList.toggle('bg-blue-50/70', isAllChecked);
        });
        const master = document.getElementById('check-all-mos');
        if (master) master.checked = isAllChecked;
    },

    limpiarSeleccion() {
        selectorUtil.limpiar((cant) => this._actualizarBarraFlotante(cant));
        mosaicoController.refrescarVista();
    },

    _renderBarraFlotante() {
        return `
        <div id="bulk-actions-bar-mos"
             class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]
                    translate-y-28 opacity-0 pointer-events-none
                    transition-all duration-500">
            <div class="bg-white/95 backdrop-blur-xl border border-slate-200 p-2.5 rounded-[26px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-2">
                <div class="flex items-center gap-3 px-4 py-2 border-r border-slate-100 mr-1">
                    <div class="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-red-200 shadow-lg">
                        <span class="material-symbols-outlined text-white text-xl">view_carousel</span>
                    </div>
                    <div class="flex flex-col">
                        <span id="lote-mos-contador" class="text-[13px] font-bold text-slate-800 leading-none">0 seleccionados</span>
                        <span class="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Acciones masivas</span>
                    </div>
                </div>
                <button onclick="mosaicoView.confirmarEliminacionMasiva()"
                        class="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 group">
                    <span class="material-symbols-outlined text-lg">delete_sweep</span>
                    <span class="text-[11px] font-black uppercase tracking-tight">Eliminar</span>
                </button>
                <button onclick="mosaicoView.limpiarSeleccion()"
                        class="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all ml-1">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>`;
    },

    _actualizarBarraFlotante(cantidad) {
        const barra = document.getElementById('bulk-actions-bar-mos');
        const contador = document.getElementById('lote-mos-contador');
        if (!barra) return;
        if (cantidad > 0) {
            barra.classList.remove('translate-y-28', 'opacity-0', 'pointer-events-none');
            barra.classList.add('translate-y-0', 'opacity-100');
            if (contador) contador.textContent = `${cantidad} seleccionados`;
        } else {
            barra.classList.add('translate-y-28', 'opacity-0', 'pointer-events-none');
            barra.classList.remove('translate-y-0', 'opacity-100');
        }
    },

    confirmarEliminacionMasiva() {
        const ids = selectorUtil.estado.seleccionados;
        if (ids.length === 0) return;
        Swal.fire({
            title: `<span class="text-red-600 font-black uppercase text-xs">¿ELIMINAR ${ids.length} MOSAICOS?</span>`,
            html: `<p class="text-sm text-slate-600">Se eliminarán las configuraciones de mosaicos seleccionados junto con todos sus banners asociados de Supabase Storage. Esta acción es definitiva.</p>`,
            icon: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'SÍ, ELIMINAR TODO',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#ef4444',
            customClass: {
                popup: 'rounded-[32px] shadow-2xl',
                confirmButton: 'rounded-xl px-5 py-2.5 text-xs font-bold uppercase',
                cancelButton: 'rounded-xl px-5 py-2.5 text-xs font-bold uppercase'
            }
        }).then(r => {
            if (r.isConfirmed) mosaicoController.eliminarMasivo(ids);
        });
    },

    limpiarBusqueda() {
        this._estado.busqueda = '';
        this._estado.paginaActual = 1;
        mosaicoController.refrescarVista();
    },

    // ─────────────────────────────────────────────
    // NOTIFICACIONES
    // ─────────────────────────────────────────────
    notificarExito(mensaje) {
        Swal.fire({
            icon: 'success',
            title: '<span class="text-slate-800 font-black uppercase text-sm">¡Operación Exitosa!</span>',
            text: mensaje,
            timer: 2500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-[32px] border-none shadow-xl' }
        });
    },

    notificarError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: '<span class="text-red-600 font-black uppercase text-sm">Error en la Operación</span>',
            text: mensaje,
            confirmButtonColor: '#2563eb',
            customClass: {
                popup: 'rounded-[32px] border-none shadow-xl',
                confirmButton: 'rounded-xl px-6 py-2 font-bold text-xs uppercase'
            }
        });
    },

    mostrarCargando(mensaje = 'Cargando datos...') {
        Swal.fire({
            title: '<span class="text-slate-800 font-black uppercase text-sm">Cargando</span>',
            text: mensaje,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: { popup: 'rounded-[32px] border-none shadow-xl' }
        });
    },

    // ─────────────────────────────────────────────
    // VISTA DETALLE — página completa
    // ─────────────────────────────────────────────
    async mostrarDetalle(mosaico) {
        const contenedor = document.getElementById('content-area');
        if (!contenedor) return false;

        const banners = mosaico.banners || [];
        const fechaRegistro = mosaico.created_at ? new Date(mosaico.created_at).toLocaleString() : 'No registrada';

        // Genera la cuadrícula de banners individuales mostrando la marca dueña de cada celda [4]
        const bannersHtml = banners.map((b, i) => {
            const logoMarca = b.empresa?.logo_url ? b.empresa.logo_url : 'https://placehold.co/100x100?text=Marca';
            const nombreMarca = b.empresa?.nombre ? b.empresa.nombre : 'Sin anunciante';
            const imgBanner = b.imagen_url ? b.imagen_url : 'https://placehold.co/400x300?text=Sin+Imagen';

            return `
            <div class="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <img src="${logoMarca}" alt="${nombreMarca}" class="w-8 h-8 rounded-lg object-cover border border-slate-100 bg-white shrink-0">
                    <div class="min-w-0">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Celda ${b.orden || (i + 1)}</p>
                        <h4 class="text-xs font-bold text-slate-800 truncate mt-1 leading-none">${nombreMarca}</h4>
                    </div>
                </div>
                <div class="aspect-video bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden relative">
                    <img src="${imgBanner}" class="w-full h-full object-cover" style="transform: rotate(${b.rotacion || 0}deg);">
                </div>
                <div class="leading-tight">
                    <h5 class="text-xs font-bold text-slate-800 truncate">${b.titulo || 'Sin título'}</h5>
                    <p class="text-[10px] font-mono text-slate-400 mt-1 truncate">${b.enlace_url || 'Sin redirección'}</p>
                </div>
            </div>`;
        }).join('');

        return new Promise((resolve) => {
            contenedor.innerHTML = `
            <div class="flex flex-col h-full max-h-[calc(100vh-64px)] overflow-hidden bg-slate-50">

                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
                    <div class="flex items-center gap-3">
                        <button id="dm-btn-volver" class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer">
                            <span class="material-symbols-outlined text-lg">arrow_back</span>
                        </button>
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Detalle del Mosaico Publicitario</p>
                            <h1 class="text-base font-black text-slate-800 tracking-tight mt-1">${mosaico.nombre_identificador}</h1>
                        </div>
                    </div>
                    <button id="dm-btn-editar" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer">
                        <span class="material-symbols-outlined text-base">edit_square</span>
                        Editar Configuración
                    </button>
                </div>

                <!-- Layout -->
                <div class="flex flex-1 overflow-hidden">

                    <!-- Panel de Grilla de Banners (izquierda 65%) -->
                    <div class="flex-1 overflow-y-auto p-8 relative">
                        <div class="max-w-4xl mx-auto">
                            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Composición del Grid multimarca</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${bannersHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Panel info (derecha) -->
                    <div class="w-[340px] flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto flex flex-col">

                        <div class="p-6 border-b border-slate-100">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                    <span class="material-symbols-outlined text-[24px]">view_carousel</span>
                                </div>
                                <div>
                                    <h2 class="text-base font-black text-slate-800 uppercase leading-none">${mosaico.nombre_identificador}</h2>
                                    <span class="font-mono text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-bold mt-1.5 inline-block">
                                        Mosaico
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Datos técnicos -->
                        <div class="p-6 flex flex-col gap-4">

                            <!-- Especificaciones de plantilla -->
                            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Diseño y Estructura</p>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <p class="text-[9px] text-slate-400 font-black uppercase mb-1">Plantilla</p>
                                        <p class="text-xs font-bold text-slate-700">${mosaico.plantilla_id}</p>
                                    </div>
                                    <div>
                                        <p class="text-[9px] text-slate-400 font-black uppercase mb-1">Separación</p>
                                        <p class="text-xs font-mono font-bold text-slate-700">${mosaico.separacion}</p>
                                    </div>
                                    <div>
                                        <p class="text-[9px] text-slate-400 font-black uppercase mb-1">Redondeado</p>
                                        <p class="text-xs font-mono font-bold text-slate-700">${mosaico.redondeado}</p>
                                    </div>
                                    <div>
                                        <p class="text-[9px] text-slate-400 font-black uppercase mb-1">Ubicación</p>
                                        <p class="text-xs font-bold text-slate-700 capitalize">${mosaico.ubicacion?.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fecha de Creación</p>
                                <p class="text-xs font-bold text-slate-700">${fechaRegistro}</p>
                            </div>

                            <!-- Info de uso -->
                            <div class="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                <div class="flex items-start gap-2">
                                    <span class="material-symbols-outlined text-emerald-500 text-[16px] mt-0.5">info</span>
                                    <p class="text-[11px] text-emerald-700 leading-relaxed">
                                        Este mosaico se mostrará activamente en la sección <span class="font-black">${mosaico.ubicacion}</span> del cliente de cara al público.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Botón eliminar al fondo -->
                        <div class="mt-auto p-6 border-t border-slate-100">
                            <button id="dm-btn-eliminar" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer">
                                <span class="material-symbols-outlined text-base">delete_forever</span>
                                Eliminar Mosaico
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

            // Eventos
            document.getElementById('dm-btn-volver')?.addEventListener('click', () => resolve(false));
            document.getElementById('dm-btn-editar')?.addEventListener('click', () => resolve(true));
            document.getElementById('dm-btn-eliminar')?.addEventListener('click', () => resolve('eliminar'));
        });
    },

    // ─────────────────────────────────────────────
    // VISTA ELIMINAR — página completa (Se conserva igual)
    // ─────────────────────────────────────────────
    async mostrarConfirmacionEliminar(mosaico) {
        const contenedor = document.getElementById('content-area');
        if (!contenedor) return false;

        const bannersCount = mosaico.banners ? mosaico.banners.length : 0;

        return new Promise((resolve) => {
            contenedor.innerHTML = `
            <div class="flex flex-col h-full max-h-[calc(100vh-64px)] overflow-hidden bg-red-50/30">

                <!-- Header rojo -->
                <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-red-100 shadow-sm flex-shrink-0">
                    <div class="flex items-center gap-3">
                        <button id="dme-btn-cancelar" class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer">
                            <span class="material-symbols-outlined text-lg">arrow_back</span>
                        </button>
                        <div>
                            <p class="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-[13px]">warning</span>
                                Zona de Peligro — Eliminación Total del Grid
                            </p>
                            <h1 class="text-lg font-black text-slate-800 leading-tight">${mosaico.nombre_identificador}</h1>
                        </div>
                    </div>
                    <button id="dme-btn-confirmar" class="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-red-200 active:scale-95 cursor-pointer">
                        <span class="material-symbols-outlined text-base">delete_forever</span>
                        Confirmar Eliminación
                    </button>
                </div>

                <!-- Layout -->
                <div class="flex flex-1 overflow-hidden">

                    <div class="flex-1 overflow-y-auto p-8 relative flex items-center justify-center bg-red-50/10">
                        <div class="max-w-md w-full bg-white border border-red-100 p-8 rounded-[32px] shadow-lg flex flex-col items-center text-center">
                            <div class="w-16 h-16 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center text-red-500 mb-4">
                                <span class="material-symbols-outlined text-3xl">image_not_supported</span>
                            </div>
                            <h3 class="text-lg font-black text-slate-800 uppercase tracking-wide">Pérdida de Contenido</h3>
                            <p class="text-sm text-slate-500 leading-relaxed mt-2">
                                Se eliminarán permanentemente los <span class="font-bold text-red-600">${bannersCount} banners</span> vinculados a esta grilla. Sus archivos de imágenes serán desasociados del sistema.
                            </p>
                        </div>
                    </div>

                    <!-- Panel advertencia -->
                    <div class="w-[340px] flex-shrink-0 bg-white border-l border-red-100 overflow-y-auto flex flex-col">

                        <div class="p-6 border-b border-red-50">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                                    <span class="material-symbols-outlined text-[24px]">view_carousel</span>
                                </div>
                                <div>
                                    <p class="text-[10px] font-black text-red-400 uppercase tracking-widest">Eliminar</p>
                                    <h2 class="text-xl font-black text-slate-800 uppercase leading-tight">${mosaico.nombre_identificador}</h2>
                                </div>
                            </div>
                            <p class="text-sm text-slate-500 leading-relaxed">
                                Esta acción eliminará permanentemente la configuración del mosaico en la ubicación <span class="font-bold text-slate-700">${mosaico.ubicacion}</span>.
                            </p>
                        </div>

                        <!-- Datos afectados -->
                        <div class="p-6 flex flex-col gap-3">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Datos que se perderán</p>

                            <div class="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                <span class="material-symbols-outlined text-slate-400 text-lg">badge</span>
                                <div>
                                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre Identificador</p>
                                    <p class="text-sm font-bold text-slate-700">${mosaico.nombre_identificador}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                <span class="material-symbols-outlined text-slate-400 text-lg">tab</span>
                                <div>
                                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Plantilla Seleccionada</p>
                                    <p class="text-sm font-mono font-bold text-slate-700">${mosaico.plantilla_id}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 bg-red-50 p-3.5 rounded-2xl border border-red-100">
                                <span class="material-symbols-outlined text-red-400 text-lg">grid_off</span>
                                <div>
                                    <p class="text-[9px] font-black text-red-400 uppercase tracking-widest">Banners Asociados</p>
                                    <p class="text-sm font-bold text-slate-700">${bannersCount} banners se destruirán</p>
                                </div>
                            </div>
                        </div>

                        <!-- Botones al fondo -->
                        <div class="mt-auto p-6 border-t border-red-50 flex flex-col gap-3">
                            <button id="dme-btn-confirmar-2" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-200 active:scale-95 cursor-pointer">
                                <span class="material-symbols-outlined text-base">delete_forever</span>
                                Sí, eliminar permanentemente
                            </button>
                            <button id="dme-btn-cancelar-2" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer">
                                <span class="material-symbols-outlined text-base">close</span>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

            const cancelar = () => resolve(false);
            const confirmar = () => resolve(true);

            document.getElementById('dme-btn-cancelar')?.addEventListener('click', cancelar);
            document.getElementById('dme-btn-cancelar-2')?.addEventListener('click', cancelar);
            document.getElementById('dme-btn-confirmar')?.addEventListener('click', confirmar);
            document.getElementById('dme-btn-confirmar-2')?.addEventListener('click', confirmar);
        });
    },

    // ─────────────────────────────────────────────
    // RENDER TABLA PRINCIPAL
    // ─────────────────────────────────────────────
    render(datos, columnasVisibles = []) {
        const contenedor = document.getElementById('content-area');
        if (!contenedor) return;

        const cols = columnasVisibles.length > 0 ? columnasVisibles :
            ['nro', 'nombre', 'ubicacion', 'acciones'];

        let datosFiltrados = this._ordenarDatos(this._filtrarDatos(datos));
        const inicio = (this._estado.paginaActual - 1) * this._estado.filasPorPagina;
        const datosPaginados = datosFiltrados.slice(inicio, inicio + this._estado.filasPorPagina);

        window._mosaicosPaginados = datosPaginados;
        contenedor.innerHTML = `
    <div class="p-8 animate-fade-in max-h-[calc(100vh-64px)] overflow-y-auto">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Mosaicos Publicitarios</h1>
                <p class="text-slate-500 text-sm font-medium">Administración de grillas publicitarias y composiciones de banners para el catálogo.</p>
            </div>
            <button onclick="mosaicoController.mostrarFormularioCrear()"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition-all
                           shadow-lg shadow-emerald-200 font-bold text-sm flex items-center gap-2 w-fit cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">add_circle</span> Nuevo Mosaico
            </button>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div class="relative flex-1 md:w-96">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input type="text"
                      id="input-busqueda-mosaicos"
                      placeholder="Buscar por identificador..."
                      value="${this._estado.busqueda}"
                      oninput="mosaicoView.gestionarBusqueda(this.value)"
                      class="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm
                             outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500
                             transition-all font-medium">
                ${this._estado.busqueda ? `
                <button onclick="mosaicoView.limpiarBusqueda()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center
                            rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-[13px]">close</span>
                </button>` : ''}
            </div>

            <div class="flex items-center gap-2">
                <button onclick="mosaicoView.gestionarOrden()"
                        class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl
                               text-slate-600 hover:text-emerald-600 transition-all shadow-sm font-bold text-sm cursor-pointer">
                    <span class="material-symbols-outlined text-lg">${this._estado.orden === 'asc' ? 'sort_by_alpha' : 'text_rotate_vertical'}</span>
                    ${this._estado.orden === 'asc' ? 'A-Z' : 'Z-A'}
                </button>

                <button onclick="configuracionColumnasController.iniciarFlujoConfiguracion('carruseles', async () => { await mosaicoController.inicializar(true); })"
                        class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 transition-all shadow-sm font-bold text-sm cursor-pointer">
                    <span class="material-symbols-outlined text-lg">view_column</span>
                    Columnas
                </button>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-8">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr class="bg-slate-50/80 border-b border-slate-200">
                            <th class="px-4 py-5 w-12 text-center">
                                <input type="checkbox" id="check-all-mos"
                                       class="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                                       onchange="mosaicoView.toggleLoteTodos(window._mosaicosPaginados)">
                            </th>
                            ${cols.includes('nro') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase w-16 text-center">N°</th>` : ''}
                            ${cols.includes('nombre') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-center">Identificador</th>` : ''}
                            ${cols.includes('ubicacion') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-center">Ubicación</th>` : ''}
                            ${cols.includes('activo') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-center">Visibilidad</th>` : ''}
                            ${cols.includes('acciones') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-center">Acciones</th>` : ''}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${datosPaginados.length > 0
                ? datosPaginados.map((m, i) => this._crearFila(m, inicio + i + 1, cols)).join('')
                : `<tr><td colspan="6" class="px-6 py-12 text-center text-slate-400 italic text-sm">No se encontraron mosaicos publicitarios registrados</td></tr>`
            }
                    </tbody>
                </table>
            </div>
            ${PaginationHelper.render(datosFiltrados.length, this._estado.filasPorPagina, this._estado.paginaActual, 'mosaicoView')}
        </div>
    </div>` + this._renderBarraFlotante();

        setTimeout(() => {
            selectorUtil.sincronizarChecks();
            this._actualizarBarraFlotante(selectorUtil.estado.seleccionados.length);
        }, 0);

        this._enfocarBusqueda();
    },

    _crearFila(m, numero, cols = []) {
        const isChecked = selectorUtil.estado.seleccionados.includes(String(m.id)) ? 'checked' : '';
        return `
    <tr class="hover:bg-slate-50/50 transition-colors group ${isChecked ? 'bg-blue-50/70' : ''}">
        <td class="px-4 py-5 text-center">
            <input type="checkbox" ${isChecked}
                   class="fila-checkbox-mos w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                   data-id="${m.id}"
                   onchange="mosaicoView.toggleLote('${m.id}')">
        </td>
        ${cols.includes('nro') ? `
        <td class="px-6 py-5 text-center">
            <span class="text-slate-400 font-bold text-xs">${numero}</span>
        </td>` : ''}
        ${cols.includes('nombre') ? `
        <td class="px-6 py-5">
            <div class="flex items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100/50 flex-shrink-0">
                    <span class="material-symbols-outlined" style="font-variation-settings:'wght' 200;font-size:18px;">view_carousel</span>
                </div>
                <span class="text-slate-800 font-bold uppercase text-[13px] tracking-wide">${m.nombre_identificador}</span>
            </div>
        </td>` : ''}
        ${cols.includes('ubicacion') ? `
        <td class="px-6 py-5 text-center">
            <span class="text-slate-600 font-bold text-xs uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50">
                ${m.ubicacion?.replace('_', ' ')}
            </span>
        </td>` : ''}
        ${cols.includes('activo') ? `
        <td class="px-6 py-5 text-center">
            <label class="relative inline-flex items-center cursor-pointer justify-center">
                <input type="checkbox" ${m.activo ? 'checked' : ''} 
                       onchange="mosaicoController.toggleActivo('${m.id}', ${!m.activo})"
                       class="sr-only peer">
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
        </td>` : ''}
        ${cols.includes('acciones') ? `
        <td class="px-6 py-5 text-center">
            <div class="flex justify-center gap-2">
                ${ActionButtons.render(m.id, 'edit', 'Editar', 'blue', 'mosaicoController.editar')}
                ${ActionButtons.render(m.id, 'visibility', 'Ver Detalle', 'indigo', 'mosaicoController.verDetalle')}
                ${ActionButtons.render(m.id, 'delete', 'Eliminar', 'red', 'mosaicoController.confirmarEliminacion')}
            </div>
        </td>` : ''}
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // FILTRADO Y ORDEN (Se conserva igual)
    // ─────────────────────────────────────────────
    _filtrarDatos(datos) {
        if (!this._estado.busqueda) return [...datos];
        const term = this._estado.busqueda.toLowerCase();
        return datos.filter(m =>
            m.nombre_identificador.toLowerCase().includes(term) ||
            (m.ubicacion && m.ubicacion.toLowerCase().includes(term))
        );
    },

    _ordenarDatos(datos) {
        return [...datos].sort((a, b) => {
            const valA = (a.nombre_identificador || '').toLowerCase();
            const valB = (b.nombre_identificador || '').toLowerCase();
            return this._estado.orden === 'asc'
                ? valA.localeCompare(valB, undefined, { sensitivity: 'base' })
                : valB.localeCompare(valA, undefined, { sensitivity: 'base' });
        });
    },

    gestionarBusqueda(valor) {
        this._estado.busqueda = valor;
        this._estado.paginaActual = 1;
        mosaicoController.inicializar(true);
    },

    gestionarOrden() {
        this._estado.orden = this._estado.orden === 'asc' ? 'desc' : 'asc';
        mosaicoController.refrescarVista();
    },

    cambiarPagina(nuevaPagina) {
        this._estado.paginaActual = nuevaPagina;
        mosaicoController.refrescarVista();
    },

    _enfocarBusqueda() {
        const input = document.getElementById('input-busqueda-mosaicos');
        if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    },

    async confirmarAccion({ titulo, nombreEntidad, mensajePersonalizado, botonConfirmar = 'Confirmar' }) {
        return await Swal.fire({
            title: `<span class="text-slate-800 font-black uppercase text-sm">${titulo}</span>`,
            html: `<div class="text-center">
                       <p class="text-slate-500 text-sm">
                           ${mensajePersonalizado} <br>
                           <span class="text-slate-800 font-bold">"${nombreEntidad}"</span>
                       </p>
                   </div>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: botonConfirmar,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#059669',
            customClass: {
                popup: 'rounded-[32px] border-none shadow-2xl',
                confirmButton: 'rounded-xl px-8 py-3 font-bold text-sm uppercase transition-all hover:scale-105',
                cancelButton: 'rounded-xl px-8 py-3 font-bold text-sm bg-slate-100 text-slate-500'
            }
        });
    }
};

window.mosaicoView = mosaicoView;