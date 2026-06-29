import { PaginationHelper } from '../utils/paginationHelper.js';
import { ActionButtons } from '../utils/componentUtils.js';
import { selectorUtil } from '../utils/selectorUtil.js';

export const empresaView = {

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
        const fila = document.querySelector(`input.fila-checkbox-emp[data-id="${id}"]`)?.closest('tr');
        if (fila) fila.classList.toggle('bg-blue-50/70', selectorUtil.estado.seleccionados.includes(String(id)));
    },

    toggleLoteTodos(datos) {
        selectorUtil.toggleTodos(datos, (cant) => this._actualizarBarraFlotante(cant));
        const isAllChecked = selectorUtil.estado.seleccionados.length >= datos.length;
        document.querySelectorAll('input.fila-checkbox-emp').forEach(chk => {
            chk.checked = isAllChecked;
            chk.closest('tr')?.classList.toggle('bg-blue-50/70', isAllChecked);
        });
        const master = document.getElementById('check-all-emp');
        if (master) master.checked = isAllChecked;
    },

    limpiarSeleccion() {
        selectorUtil.limpiar((cant) => this._actualizarBarraFlotante(cant));
        empresaController.refrescarVista();
    },

    _renderBarraFlotante() {
        return `
        <div id="bulk-actions-bar-emp"
             class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]
                    translate-y-28 opacity-0 pointer-events-none
                    transition-all duration-500">
            <div class="bg-white/95 backdrop-blur-xl border border-slate-200 p-2.5 rounded-[26px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-2">
                <div class="flex items-center gap-3 px-4 py-2 border-r border-slate-100 mr-1">
                    <div class="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-red-200 shadow-lg">
                        <span class="material-symbols-outlined text-white text-xl">domain</span>
                    </div>
                    <div class="flex flex-col">
                        <span id="lote-emp-contador" class="text-[13px] font-bold text-slate-800 leading-none">0 seleccionados</span>
                        <span class="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Acciones masivas</span>
                    </div>
                </div>
                <button onclick="empresaView.confirmarEliminacionMasiva()"
                        class="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 group">
                    <span class="material-symbols-outlined text-lg">delete_sweep</span>
                    <span class="text-[11px] font-black uppercase tracking-tight">Eliminar</span>
                </button>
                <button onclick="empresaView.limpiarSeleccion()"
                        class="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all ml-1">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>`;
    },

    _actualizarBarraFlotante(cantidad) {
        const barra = document.getElementById('bulk-actions-bar-emp');
        const contador = document.getElementById('lote-emp-contador');
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
            title: `<span class="text-red-600 font-black uppercase text-xs">¿ELIMINAR ${ids.length} EMPRESAS?</span>`,
            html: `<p class="text-sm text-slate-600">Se eliminarán de manera definitiva todas las empresas seleccionadas. Esta acción no se puede deshacer.</p>`,
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
            if (r.isConfirmed) empresaController.eliminarMasivo(ids);
        });
    },

    limpiarBusqueda() {
        this._estado.busqueda = '';
        this._estado.paginaActual = 1;
        empresaController.refrescarVista();
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
    async mostrarDetalle(emp) {
        const contenedor = document.getElementById('content-area');
        if (!contenedor) return false;

        const logoSrc = emp.logo_url ? emp.logo_url : 'https://placehold.co/400x400?text=Sin+Logo';
        const fechaRegistro = emp.created_at ? new Date(emp.created_at).toLocaleString() : 'No registrada';

        return new Promise((resolve) => {
            contenedor.innerHTML = `
            <div class="flex flex-col h-full max-h-[calc(100vh-64px)] overflow-hidden bg-slate-50">

                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
                    <div class="flex items-center gap-3">
                        <button id="de-btn-volver"
                                class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100
                                       hover:bg-slate-200 text-slate-600 transition-all">
                            <span class="material-symbols-outlined text-lg">arrow_back</span>
                        </button>
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalle de la Empresa</p>
                            <h1 class="text-lg font-black text-slate-800 leading-tight">${emp.nombre}</h1>
                        </div>
                    </div>
                    <button id="de-btn-editar"
                            class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700
                                   text-white rounded-xl font-black text-[10px] uppercase tracking-widest
                                   transition-all shadow-md active:scale-95">
                        <span class="material-symbols-outlined text-base">edit_square</span>
                        Editar Empresa
                    </button>
                </div>

                <!-- Layout: Visor de Logotipo + panel info -->
                <div class="flex flex-1 overflow-hidden">

                    <!-- Visor de Imagen (izquierda 65%) -->
                    <div class="relative flex-1 overflow-hidden bg-slate-100 flex items-center justify-center p-8">
                        <div class="absolute inset-0 opacity-[0.03]" 
                             style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
                        
                        <div class="relative z-10 bg-white p-6 rounded-[32px] shadow-xl border border-slate-200 max-w-sm w-full flex flex-col items-center">
                            <img src="${logoSrc}" alt="Logotipo" 
                                 class="w-48 h-48 object-cover rounded-2xl shadow-inner border border-slate-100 bg-white mb-4">
                            <h3 class="text-base font-black text-slate-800 text-center uppercase tracking-wide">${emp.nombre}</h3>
                        </div>

                        <!-- Badge sobre el visor -->
                        <div class="absolute bottom-4 right-4 z-10
                                    bg-white/95 backdrop-blur shadow-lg rounded-2xl px-4 py-2.5
                                    flex items-center gap-2 border border-emerald-100">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span class="text-[11px] font-black text-emerald-700 uppercase tracking-wide">Activo</span>
                        </div>
                    </div>

                    <!-- Panel info (derecha) -->
                    <div class="w-[340px] flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto flex flex-col">

                        <!-- Encabezado del panel -->
                        <div class="p-6 border-b border-slate-100">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600
                                            flex items-center justify-center border border-emerald-100">
                                    <span class="material-symbols-outlined text-[24px]">domain</span>
                                </div>
                                <div>
                                    <h2 class="text-xl font-black text-slate-800 uppercase leading-tight">Empresa</h2>
                                    <span class="font-mono text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg font-bold">
                                        Registrada
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Datos técnicos -->
                        <div class="p-6 flex flex-col gap-4">

                            <!-- Nota: Se ha removido el campo UUID de la vista para el usuario final -->

                            <div class="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                                <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-[13px]">calendar_today</span>
                                    Fecha de Creación
                                </p>
                                <p class="text-xs font-bold text-indigo-800 bg-white/50 p-2.5 border border-indigo-200 rounded-xl">
                                    ${fechaRegistro}
                                </p>
                            </div>

                            <!-- Info de uso -->
                            <div class="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                <div class="flex items-start gap-2">
                                    <span class="material-symbols-outlined text-emerald-500 text-[16px] mt-0.5">info</span>
                                    <p class="text-[11px] text-emerald-700 leading-relaxed">
                                        El catálogo y la presentación para clientes se personalizarán con la marca y el logotipo de <span class="font-black">${emp.nombre}</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Botón eliminar al fondo -->
                        <div class="mt-auto p-6 border-t border-slate-100">
                            <button id="de-btn-eliminar"
                                    class="w-full flex items-center justify-center gap-2 px-4 py-3
                                           bg-red-50 hover:bg-red-100 border border-red-200
                                           text-red-600 rounded-2xl font-black text-[10px] uppercase
                                           tracking-widest transition-all">
                                <span class="material-symbols-outlined text-base">delete_forever</span>
                                Eliminar Empresa
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

            // Eventos
            document.getElementById('de-btn-volver')?.addEventListener('click', () => {
                resolve(false);
            });

            document.getElementById('de-btn-editar')?.addEventListener('click', () => {
                resolve(true);
            });

            document.getElementById('de-btn-eliminar')?.addEventListener('click', () => {
                resolve('eliminar');
            });
        });
    },

    // ─────────────────────────────────────────────
    // VISTA ELIMINAR — página completa
    // ─────────────────────────────────────────────
    async mostrarConfirmacionEliminar(emp) {
        const contenedor = document.getElementById('content-area');
        if (!contenedor) return false;

        const logoSrc = emp.logo_url ? emp.logo_url : 'https://placehold.co/400x400?text=Sin+Logo';

        return new Promise((resolve) => {
            contenedor.innerHTML = `
            <div class="flex flex-col h-full max-h-[calc(100vh-64px)] overflow-hidden bg-red-50/30">

                <!-- Header rojo -->
                <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-red-100 shadow-sm flex-shrink-0">
                    <div class="flex items-center gap-3">
                        <button id="del-btn-cancelar"
                                class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100
                                       hover:bg-slate-200 text-slate-600 transition-all">
                            <span class="material-symbols-outlined text-lg">arrow_back</span>
                        </button>
                        <div>
                            <p class="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-[13px]">warning</span>
                                Zona de Peligro — Acción Irreversible
                            </p>
                            <h1 class="text-lg font-black text-slate-800 leading-tight">${emp.nombre}</h1>
                        </div>
                    </div>
                    <button id="del-btn-confirmar"
                            class="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700
                                   text-white rounded-xl font-black text-[10px] uppercase tracking-widest
                                   transition-all shadow-md shadow-red-200 active:scale-95">
                        <span class="material-symbols-outlined text-base">delete_forever</span>
                        Confirmar Eliminación
                    </button>
                </div>

                <!-- Layout: visor con overlay de advertencia + panel info -->
                <div class="flex flex-1 overflow-hidden">

                    <!-- Visor con advertencia (izquierda 65%) -->
                    <div class="relative flex-1 overflow-hidden bg-red-50/20 flex items-center justify-center p-8">
                        <div class="absolute inset-0 pointer-events-none z-[10]"
                             style="background:linear-gradient(135deg,rgba(239,68,68,0.05),transparent);"></div>

                        <div class="relative z-20 bg-white p-6 rounded-[32px] shadow-xl border border-red-100 max-w-sm w-full flex flex-col items-center opacity-85 saturate-[0.5]">
                            <img src="${logoSrc}" alt="Logotipo" 
                                 class="w-48 h-48 object-cover rounded-2xl border border-red-50 bg-white mb-4">
                            <h3 class="text-base font-black text-slate-700 text-center uppercase tracking-wide">${emp.nombre}</h3>
                        </div>

                        <!-- Badge advertencia -->
                        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-20
                                    bg-red-600 shadow-lg shadow-red-200 rounded-2xl px-5 py-2.5
                                    flex items-center gap-2">
                            <span class="material-symbols-outlined text-white text-[18px]">warning</span>
                            <span class="text-[11px] font-black text-white uppercase tracking-wide">
                                Esta acción no se puede deshacer
                            </span>
                        </div>
                    </div>

                    <!-- Panel advertencia (derecha) -->
                    <div class="w-[340px] flex-shrink-0 bg-white border-l border-red-100 overflow-y-auto flex flex-col">

                        <!-- Encabezado del panel -->
                        <div class="p-6 border-b border-red-50">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-500
                                            flex items-center justify-center border border-red-100">
                                    <span class="material-symbols-outlined text-[24px]">domain</span>
                                </div>
                                <div>
                                    <p class="text-[10px] font-black text-red-400 uppercase tracking-widest">Eliminar</p>
                                    <h2 class="text-xl font-black text-slate-800 uppercase leading-tight">${emp.nombre}</h2>
                                </div>
                            </div>
                            <p class="text-sm text-slate-500 leading-relaxed">
                                Se eliminará permanentemente la empresa del sistema. Todos los accesos vinculados a esta marca podrían verse afectados.
                            </p>
                        </div>

                        <!-- Datos afectados -->
                        <div class="p-6 flex flex-col gap-3">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Datos que se eliminarán</p>

                            <div class="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                <span class="material-symbols-outlined text-slate-400 text-lg">badge</span>
                                <div>
                                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre</p>
                                    <p class="text-sm font-bold text-slate-700">${emp.nombre}</p>
                                </div>
                            </div>

                            <!-- Nota: Se ha removido el campo UUID de la vista para el usuario final -->

                            <div class="flex items-center gap-3 bg-red-50 p-3.5 rounded-2xl border border-red-100">
                                <span class="material-symbols-outlined text-red-400 text-lg">image_not_supported</span>
                                <div>
                                    <p class="text-[9px] font-black text-red-400 uppercase tracking-widest">Archivo</p>
                                    <p class="text-sm font-bold text-slate-700">El logotipo vinculado se desasociará</p>
                                </div>
                            </div>
                        </div>

                        <!-- Botones al fondo -->
                        <div class="mt-auto p-6 border-t border-red-50 flex flex-col gap-3">
                            <button id="del-btn-confirmar-2"
                                    class="w-full flex items-center justify-center gap-2 px-4 py-3
                                           bg-red-600 hover:bg-red-700 text-white rounded-2xl
                                           font-black text-[10px] uppercase tracking-widest
                                           transition-all shadow-lg shadow-red-200 active:scale-95">
                                <span class="material-symbols-outlined text-base">delete_forever</span>
                                Sí, eliminar permanentemente
                            </button>
                            <button id="del-btn-cancelar-2"
                                    class="w-full flex items-center justify-center gap-2 px-4 py-3
                                           bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl
                                           font-black text-[10px] uppercase tracking-widest transition-all">
                                <span class="material-symbols-outlined text-base">close</span>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

            const cancelar = () => resolve(false);
            const confirmar = () => resolve(true);

            document.getElementById('del-btn-cancelar')?.addEventListener('click', cancelar);
            document.getElementById('del-btn-cancelar-2')?.addEventListener('click', cancelar);
            document.getElementById('del-btn-confirmar')?.addEventListener('click', confirmar);
            document.getElementById('del-btn-confirmar-2')?.addEventListener('click', confirmar);
        });
    },

    // ─────────────────────────────────────────────
    // RENDER TABLA PRINCIPAL
    // ─────────────────────────────────────────────
    render(datos, columnasVisibles = []) {
        const contenedor = document.getElementById('content-area');
        if (!contenedor) return;

        const cols = columnasVisibles.length > 0 ? columnasVisibles :
            ['nro', 'logo', 'nombre', 'acciones'];

        let datosFiltrados = this._ordenarDatos(this._filtrarDatos(datos));
        const inicio = (this._estado.paginaActual - 1) * this._estado.filasPorPagina;
        const datosPaginados = datosFiltrados.slice(inicio, inicio + this._estado.filasPorPagina);

        window._empresasPaginados = datosPaginados;
        contenedor.innerHTML = `
    <div class="p-8 animate-fade-in max-h-[calc(100vh-64px)] overflow-y-auto">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Gestión de Empresas</h1>
                <p class="text-slate-500 text-sm font-medium">Administración y marcas del catálogo con sus logotipos respectivos.</p>
            </div>
            <button onclick="empresaController.mostrarFormularioCrear()"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition-all
                           shadow-lg shadow-emerald-200 font-bold text-sm flex items-center gap-2 w-fit">
                <span class="material-symbols-outlined text-[20px]">add_business</span> Nueva Empresa
            </button>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div class="relative flex-1 md:w-96">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input type="text"
                      id="input-busqueda-empresas"
                      placeholder="Buscar por nombre..."
                      value="${this._estado.busqueda}"
                      oninput="empresaView.gestionarBusqueda(this.value)"
                      class="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm
                             outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500
                             transition-all font-medium">
                ${this._estado.busqueda ? `
                <button onclick="empresaView.limpiarBusqueda()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center
                            rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 transition-all">
                    <span class="material-symbols-outlined text-[13px]">close</span>
                </button>` : ''}
            </div>

            <div class="flex items-center gap-2">
                <button onclick="empresaView.gestionarOrden()"
                        class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl
                               text-slate-600 hover:text-emerald-600 transition-all shadow-sm font-bold text-sm">
                    <span class="material-symbols-outlined text-lg">${this._estado.orden === 'asc' ? 'sort_by_alpha' : 'text_rotate_vertical'}</span>
                    ${this._estado.orden === 'asc' ? 'A-Z' : 'Z-A'}
                </button>

                <button onclick="configuracionColumnasController.iniciarFlujoConfiguracion('empresas', async () => { await empresaController.inicializar(true); })"
                        class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 transition-all shadow-sm font-bold text-sm">
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
                                <input type="checkbox" id="check-all-emp"
                                       class="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                                       onchange="empresaView.toggleLoteTodos(window._empresasPaginados)">
                            </th>
                            ${cols.includes('nro') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase w-16 text-center">N°</th>` : ''}
                            ${cols.includes('logo') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-center">Logo</th>` : ''}
                            ${cols.includes('nombre') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-center">Nombre</th>` : ''}
                            ${cols.includes('acciones') ? `<th class="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-center">Acciones</th>` : ''}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${datosPaginados.length > 0
                ? datosPaginados.map((e, i) => this._crearFila(e, inicio + i + 1, cols)).join('')
                : `<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic text-sm">No se encontraron empresas registradas</td></tr>`
            }
                    </tbody>
                </table>
            </div>
            ${PaginationHelper.render(datosFiltrados.length, this._estado.filasPorPagina, this._estado.paginaActual, 'empresaView')}
        </div>
    </div>` + this._renderBarraFlotante();

        setTimeout(() => {
            selectorUtil.sincronizarChecks();
            this._actualizarBarraFlotante(selectorUtil.estado.seleccionados.length);
        }, 0);

        this._enfocarBusqueda();
    },

    _crearFila(e, numero, cols = []) {
        const isChecked = selectorUtil.estado.seleccionados.includes(String(e.id)) ? 'checked' : '';
        const logoSrc = e.logo_url ? e.logo_url : 'https://placehold.co/100x100?text=Sin+Logo';

        return `
    <tr class="hover:bg-slate-50/50 transition-colors group ${isChecked ? 'bg-blue-50/70' : ''}">
        <td class="px-4 py-5 text-center">
            <input type="checkbox" ${isChecked}
                   class="fila-checkbox-emp w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                   data-id="${e.id}"
                   onchange="empresaView.toggleLote('${e.id}')">
        </td>
        ${cols.includes('nro') ? `
        <td class="px-6 py-5 text-center">
            <span class="text-slate-400 font-bold text-xs">${numero}</span>
        </td>` : ''}
        ${cols.includes('logo') ? `
        <td class="px-6 py-5">
            <div class="flex justify-center">
                <img src="${logoSrc}" alt="Logo" 
                     class="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-100 bg-white">
            </div>
        </td>` : ''}
        ${cols.includes('nombre') ? `
        <td class="px-6 py-5">
            <div class="text-center">
                <span class="text-slate-800 font-bold uppercase text-[13px] tracking-wide">${e.nombre}</span>
            </div>
        </td>` : ''}
        ${cols.includes('acciones') ? `
        <td class="px-6 py-5 text-center">
            <div class="flex justify-center gap-2">
                ${ActionButtons.render(e.id, 'edit', 'Editar', 'blue', 'empresaController.editar')}
                ${ActionButtons.render(e.id, 'visibility', 'Ver Detalle', 'indigo', 'empresaController.verDetalle')}
                ${ActionButtons.render(e.id, 'delete', 'Eliminar', 'red', 'empresaController.confirmarEliminacion')}
            </div>
        </td>` : ''}
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // FILTRADO Y ORDEN
    // ─────────────────────────────────────────────
    _filtrarDatos(datos) {
        if (!this._estado.busqueda) return [...datos];
        const term = this._estado.busqueda.toLowerCase();
        return datos.filter(e =>
            e.nombre.toLowerCase().includes(term)
        );
    },

    _ordenarDatos(datos) {
        return [...datos].sort((a, b) => {
            const valA = (a.nombre || '').toLowerCase();
            const valB = (b.nombre || '').toLowerCase();
            return this._estado.orden === 'asc'
                ? valA.localeCompare(valB, undefined, { sensitivity: 'base' })
                : valB.localeCompare(valA, undefined, { sensitivity: 'base' });
        });
    },

    gestionarBusqueda(valor) {
        this._estado.busqueda = valor;
        this._estado.paginaActual = 1;
        empresaController.inicializar(true);
    },

    gestionarOrden() {
        this._estado.orden = this._estado.orden === 'asc' ? 'desc' : 'asc';
        empresaController.refrescarVista();
    },

    cambiarPagina(nuevaPagina) {
        this._estado.paginaActual = nuevaPagina;
        empresaController.refrescarVista();
    },

    _enfocarBusqueda() {
        const input = document.getElementById('input-busqueda-empresas');
        if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    },

    // ─────────────────────────────────────────────
    // CONFIRMACIÓN GENÉRICA (para confirmarAccion del controller)
    // ─────────────────────────────────────────────
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

window.empresaView = empresaView;