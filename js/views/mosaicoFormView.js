import { empresaModel } from '../models/empresaModel.js';

export const mosaicoFormView = {

    _estado: {
        currentTemplateId: 'editorialLeft',
        gap: 'md',
        borderRadius: 'rounded-2xl',
        bgColor: 'bg-white',
        activeCellIndex: null,
        empresasDisponibles: [], // Almacena el catálogo de empresas para los selects
        banners: Array(8).fill(null).map(() => ({
            titulo: '',
            imagen_url: '',
            enlace_url: '',
            col_span: 1,
            row_span: 1,
            rotacion: 0,
            ajuste_modo: 'cover',
            empresa_id: '' // <-- Almacenado a nivel de banner individual
        })),
        archivosBanners: {} 
    },

    _plantillas: {
        editorialLeft: {
            id: 'editorialLeft',
            name: 'Grande Izquierda',
            colsClass: 'grid-cols-3',
            rowsClass: 'grid-rows-2',
            slots: [
                { colSpan: 2, rowSpan: 2 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-3 grid-rows-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="col-span-2 row-span-2 bg-indigo-500 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        editorialRight: {
            id: 'editorialRight',
            name: 'Grande Derecha',
            colsClass: 'grid-cols-3',
            rowsClass: 'grid-rows-2',
            slots: [
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 2, rowSpan: 2 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-3 grid-rows-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="col-span-2 row-span-2 bg-indigo-500 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        fourGrid: {
            id: 'fourGrid',
            name: 'Cuatro Cuadrantes',
            colsClass: 'grid-cols-2',
            rowsClass: 'grid-rows-2',
            slots: [
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        tripleColumn: {
            id: 'tripleColumn',
            name: '3 Columnas',
            colsClass: 'grid-cols-3',
            rowsClass: 'grid-rows-1',
            slots: [
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-3 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        quadrupleColumn: {
            id: 'quadrupleColumn',
            name: '4 Columnas',
            colsClass: 'grid-cols-4',
            rowsClass: 'grid-rows-1',
            slots: [
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-4 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        splitCenterFocus: {
            id: 'splitCenterFocus',
            name: 'Enfoque Central',
            colsClass: 'grid-cols-4',
            rowsClass: 'grid-rows-2',
            slots: [
                { colSpan: 1, rowSpan: 2 },
                { colSpan: 2, rowSpan: 2 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-4 grid-rows-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="col-span-1 row-span-2 bg-slate-400 rounded-sm"></div>
                    <div class="col-span-2 row-span-2 bg-indigo-500 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        bannerTopThree: {
            id: 'bannerTopThree',
            name: 'Banner Superior',
            colsClass: 'grid-cols-3',
            rowsClass: 'grid-rows-2',
            slots: [
                { colSpan: 3, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-3 grid-rows-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="col-span-3 bg-indigo-500 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        gridEight: {
            id: 'gridEight',
            name: 'Mosaico Completo',
            colsClass: 'grid-cols-4',
            rowsClass: 'grid-rows-2',
            slots: [
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-4 grid-rows-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        splitFourLeft: {
            id: 'splitFourLeft',
            name: 'Lateral Izquierda',
            colsClass: 'grid-cols-4',
            rowsClass: 'grid-rows-2',
            slots: [
                { colSpan: 2, rowSpan: 2 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-4 grid-rows-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="col-span-2 row-span-2 bg-indigo-500 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        },
        horizontalDuet: {
            id: 'horizontalDuet',
            name: 'Dúo Horizontal',
            colsClass: 'grid-cols-2',
            rowsClass: 'grid-rows-1',
            slots: [
                { colSpan: 1, rowSpan: 1 },
                { colSpan: 1, rowSpan: 1 }
            ],
            previewHtml: `
                <div class="grid grid-cols-2 gap-0.5 w-10 h-7 bg-slate-200 p-0.5 rounded border border-slate-300">
                    <div class="bg-slate-400 rounded-sm"></div>
                    <div class="bg-slate-400 rounded-sm"></div>
                </div>
            `
        }
    },

    async abrir({ datos = null, esEdicion = false, empresas = [], onGuardar, onCancelar }) {
        const contenedor = document.getElementById('content-area');
        if (!contenedor) return;

        // Almacenamos el catálogo de empresas en el estado para renderizar los selects de celdas
        this._estado.empresasDisponibles = empresas;
        this._estado.archivosBanners = {};

        if (esEdicion && datos) {
            this._estado.currentTemplateId = datos.plantilla_id || 'editorialLeft';
            this._estado.gap = datos.separacion || 'md';
            this._estado.borderRadius = datos.redondeado || 'rounded-2xl';
            this._estado.bgColor = datos.color_fondo || 'bg-white';
            
            this._estado.banners = Array(8).fill(null).map((_, i) => {
                const bannerExistente = datos.banners?.find(b => b.orden === i + 1);
                return bannerExistente ? { ...bannerExistente } : {
                    titulo: '',
                    imagen_url: '',
                    enlace_url: '',
                    col_span: 1,
                    row_span: 1,
                    rotacion: 0,
                    ajuste_modo: 'cover',
                    empresa_id: ''
                };
            });
        } else {
            this._estado.currentTemplateId = 'editorialLeft';
            this._estado.gap = 'md';
            this._estado.borderRadius = 'rounded-2xl';
            this._estado.bgColor = 'bg-white';
            this._estado.banners = Array(8).fill(null).map(() => ({
                titulo: '',
                imagen_url: '',
                enlace_url: '',
                col_span: 1,
                row_span: 1,
                rotacion: 0,
                ajuste_modo: 'cover',
                empresa_id: ''
            }));
        }

        // Renderizado del layout del creador con el 70% Izquierda y 30% Derecha
        contenedor.innerHTML = `
        <div class="flex flex-col h-full max-h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
            
            <!-- Cabecera -->
            <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-30">
                <div class="flex items-center gap-3">
                    <button id="mform-btn-cancelar" class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer">
                        <span class="material-symbols-outlined text-lg">arrow_back</span>
                    </button>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">MosaicoFácil</p>
                        <h1 class="text-base font-black text-slate-800 tracking-tight mt-1">${esEdicion ? 'Editar Mosaico Publicitario' : 'Nuevo Mosaico Publicitario'}</h1>
                    </div>
                </div>
                <button id="mform-btn-guardar" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer">
                    <span class="material-symbols-outlined text-base">save</span>
                    Guardar Diseño
                </button>
            </div>

            <!-- Cuerpo Principal -->
            <div class="flex flex-1 overflow-hidden">
                
                <!-- Columna Izquierda (70%): Lienzo + Plantillas de Grillas -->
                <div class="w-full lg:w-[70%] flex flex-col gap-6 p-6 overflow-hidden h-full">
                    
                    <!-- Lienzo Principal -->
                    <div class="flex-[7] bg-slate-200/50 rounded-3xl border border-slate-300/40 p-4 flex flex-col justify-center items-center overflow-y-auto relative min-h-[320px]">
                        <div id="mform-canvas-wrapper" class="p-3 bg-white rounded-3xl shadow-xl border border-slate-200/80 max-w-full flex justify-center items-center transition-all duration-300 ${this._estado.borderRadius}">
                            <div id="mform-canvas" class="grid w-[580px] h-[390px] max-w-full rounded-2xl overflow-hidden p-1 transition-all duration-300">
                                <!-- Las celdas se cargan con JS -->
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">* Haz clic en cualquier celda para cargar imagen, anunciante, título y redirección.</p>
                    </div>

                    <!-- Selección de Plantillas Predefinidas -->
                    <div class="flex-[3] bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col min-h-[160px] overflow-hidden">
                        <div class="flex items-center space-x-2 pb-2 border-b border-slate-100 shrink-0">
                            <span class="material-symbols-outlined text-indigo-500 text-lg">layout</span>
                            <h2 class="font-bold text-slate-900 text-xs tracking-wide uppercase">Modelos de Mosaicos Predefinidos (Miniaturas)</h2>
                        </div>

                        <!-- Selector Horizontal -->
                        <div class="flex-1 overflow-x-auto flex items-center space-x-4 py-3 no-scrollbar" id="mform-templates-container">
                            <!-- Se generan dinámicamente con JS -->
                        </div>
                    </div>
                </div>

                <!-- Columna Derecha (30%): Ajustes de Datos y Estilos Globales -->
                <div class="w-full lg:w-[30%] flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto flex flex-col">
                    
                    <!-- Datos Generales (Se removió Empresa Anunciante general de este bloque) -->
                    <div class="p-6 border-b border-slate-100 space-y-4">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">settings</span> Datos del Mosaico</h3>
                        
                        <div>
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Nombre Identificador</label>
                            <input type="text" id="mform-identificador" value="${datos ? datos.nombre_identificador : ''}" class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold" placeholder="Ej. Grilla Principal Multimarca">
                        </div>

                        <div>
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Ubicación de Despliegue</label>
                            <select id="mform-ubicacion" class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold">
                                <option value="home_principal" ${datos && datos.ubicacion === 'home_principal' ? 'selected' : ''}>Home Principal</option>
                                <option value="home_secundario" ${datos && datos.ubicacion === 'home_secundario' ? 'selected' : ''}>Home Secundario</option>
                                <option value="categoria_principal" ${datos && datos.ubicacion === 'categoria_principal' ? 'selected' : ''}>Categorías</option>
                            </select>
                        </div>
                    </div>

                    <!-- Ajustes de Diseño -->
                    <div class="p-6 border-b border-slate-100 space-y-4">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><span class="material-symbols-outlined text-sm">palette</span> Bordes y Colores</h3>
                        
                        <!-- Separación -->
                        <div>
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Separación entre fotos</label>
                            <div class="grid grid-cols-4 gap-1">
                                <button data-mform-gap="none" class="mform-gap-btn py-1.5 text-[9px] font-bold border border-slate-200 rounded-lg">Ninguna</button>
                                <button data-mform-gap="sm" class="mform-gap-btn py-1.5 text-[9px] font-bold border border-slate-200 rounded-lg">Fina</button>
                                <button data-mform-gap="md" class="mform-gap-btn py-1.5 text-[9px] font-bold border border-slate-200 rounded-lg">Normal</button>
                                <button data-mform-gap="lg" class="mform-gap-btn py-1.5 text-[9px] font-bold border border-slate-200 rounded-lg">Ancha</button>
                            </div>
                        </div>

                        <!-- Bordes -->
                        <div>
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Esquinas Redondeadas</label>
                            <div class="grid grid-cols-3 gap-1">
                                <button data-mform-border="rounded-none" class="mform-border-btn py-1.5 text-[9px] font-bold border border-slate-200 rounded-lg">Rectas</button>
                                <button data-mform-border="rounded-2xl" class="mform-border-btn py-1.5 text-[9px] font-bold border border-slate-200 rounded-lg">Suaves</button>
                                <button data-mform-border="rounded-[32px]" class="mform-border-btn py-1.5 text-[9px] font-bold border border-slate-200 rounded-lg">Redondas</button>
                            </div>
                        </div>

                        <!-- Fondo -->
                        <div>
                            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Fondo / Líneas de Unión</label>
                            <div class="flex items-center gap-2">
                                <button class="bg-white border-2 border-slate-300 w-6 h-6 rounded-full mform-col-dot shrink-0 cursor-pointer" data-mform-color="bg-white"></button>
                                <button class="bg-slate-100 border border-slate-300 w-6 h-6 rounded-full mform-col-dot shrink-0 cursor-pointer" data-mform-color="bg-slate-100"></button>
                                <button class="bg-slate-900 border border-slate-900 w-6 h-6 rounded-full mform-col-dot shrink-0 cursor-pointer" data-mform-color="bg-slate-900"></button>
                                <button class="bg-rose-100 border border-rose-300 w-6 h-6 rounded-full mform-col-dot shrink-0 cursor-pointer" data-mform-color="bg-rose-100"></button>
                                <div class="flex-1"></div>
                                <input type="color" id="mform-customBgColor" class="w-6 h-6 rounded-md cursor-pointer border border-slate-200 shrink-0" title="Color personalizado">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PANEL DE EDICIÓN DE CELDA (Slide-in) -->
        <div id="mform-cell-editor" class="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl border-l border-slate-200 z-50 transform translate-x-full transition-transform duration-300 flex flex-col justify-between">
            <div class="p-6 flex-1 overflow-y-auto space-y-5 no-scrollbar">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 class="font-black text-slate-800 text-xs tracking-widest uppercase flex items-center gap-1.5"><span class="material-symbols-outlined text-indigo-500">sliders_horizontal</span> Ajustar Celda</h3>
                    <button id="mform-btn-close-editor" class="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <!-- Imagen Seleccionada -->
                <div>
                    <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Fotografía del Banner</label>
                    <div class="relative w-full h-32 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
                        <img id="mform-editor-preview" src class="object-cover w-full h-full">
                        <label for="mform-file-input" class="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition-all flex items-center justify-center">
                            <span class="material-symbols-outlined text-[16px] font-bold">upload</span>
                        </label>
                    </div>
                    <input type="file" id="mform-file-input" accept="image/*" class="hidden">
                </div>

                <!-- NUEVO: Selección de Empresa para este banner específico -->
                <div>
                    <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Empresa Anunciante (Celda)</label>
                    <select id="mform-banner-empresa" class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold">
                        <option value="">-- Seleccionar Empresa --</option>
                        ${this._estado.empresasDisponibles.map(emp => `<option value="${emp.id}">${emp.nombre}</option>`).join('')}
                    </select>
                </div>

                <!-- Título -->
                <div>
                    <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Título del Banner</label>
                    <input type="text" id="mform-banner-titulo" class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold" placeholder="Ej. ¡Última oportunidad!">
                </div>

                <!-- Enlace de redirección -->
                <div>
                    <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Enlace de Redirección (URL)</label>
                    <input type="text" id="mform-banner-link" class="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono font-bold" placeholder="/categoria/calzados">
                </div>

                <!-- Ajustes de Orientación -->
                <div class="grid grid-cols-2 gap-2">
                    <button id="mform-btn-rotate" class="flex flex-col items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-[10px] font-bold text-slate-600 space-y-1 cursor-pointer">
                        <span class="material-symbols-outlined text-sm">rotate_90_degrees_cw</span>
                        <span>Girar 90°</span>
                    </button>
                    <button id="mform-btn-fit" class="flex flex-col items-center justify-center py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-[10px] font-bold text-slate-600 space-y-1 cursor-pointer">
                        <span class="material-symbols-outlined text-sm">aspect_ratio</span>
                        <span id="mform-fit-text">Modo: Recortar</span>
                    </button>
                </div>
            </div>

            <!-- Acciones Celda -->
            <div class="p-6 border-t border-slate-100 space-y-2 bg-slate-50/50">
                <button id="mform-btn-eliminar-imagen" class="flex items-center justify-center space-x-2 w-full py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-black text-[10px] uppercase border border-rose-200 transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-sm">delete_forever</span>
                    <span>Vaciar Celda</span>
                </button>
                <button id="mform-btn-guardar-celda" class="w-full py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-black text-[10px] uppercase shadow-md transition-all cursor-pointer">
                    Confirmar Celda
                </button>
            </div>
        </div>`;

        // Inicializar lógica de renderizado del lienzo y listeners
        this._setupLienzo();
        this._renderTemplatesList();
        this._setupEventListeners(onGuardar, onCancelar, esEdicion);
    },

    _setupLienzo() {
        const canvas = document.getElementById('mform-canvas');
        const template = this._plantillas[this._estado.currentTemplateId];

        // Configuración de columnas y filas según plantilla
        canvas.className = `grid w-[580px] h-[390px] max-w-full rounded-2xl overflow-hidden p-1 transition-all duration-300 ${template.colsClass} ${template.rowsClass}`;
        
        // Separación (Gap)
        canvas.classList.remove('gap-0', 'gap-1.5', 'gap-3', 'gap-5');
        if (this._estado.gap === 'none') canvas.classList.add('gap-0');
        if (this._estado.gap === 'sm') canvas.classList.add('gap-1.5');
        if (this._estado.gap === 'md') canvas.classList.add('gap-3');
        if (this._estado.gap === 'lg') canvas.classList.add('gap-5');

        // Color de fondo
        const wrapper = document.getElementById('mform-canvas-wrapper');
        wrapper.className = `p-3 shadow-xl border border-slate-200/80 max-w-full flex justify-center items-center transition-all duration-300 ${this._estado.borderRadius}`;
        
        wrapper.style.backgroundColor = '';
        canvas.style.backgroundColor = '';
        wrapper.classList.remove('bg-white', 'bg-slate-100', 'bg-slate-900', 'bg-rose-100');
        canvas.classList.remove('bg-white', 'bg-slate-100', 'bg-slate-900', 'bg-rose-100');

        if (this._estado.bgColor.startsWith('bg-')) {
            wrapper.classList.add(this._estado.bgColor);
            canvas.classList.add(this._estado.bgColor);
        } else {
            wrapper.style.backgroundColor = this._estado.bgColor;
            canvas.style.backgroundColor = this._estado.bgColor;
        }

        canvas.innerHTML = '';

        // Dibujar celdas (slots)
        template.slots.forEach((slot, index) => {
            const cell = document.createElement('div');
            cell.className = `col-span-${slot.colSpan} row-span-${slot.rowSpan} group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center border border-slate-200/50`;
            
            const bData = this._estado.banners[index];
            const hasUpload = this._estado.archivosBanners[index];

            if (bData.imagen_url || hasUpload) {
                cell.classList.add('bg-slate-100');
                const src = hasUpload ? URL.createObjectURL(hasUpload) : bData.imagen_url;

                const fitClass = bData.ajuste_modo === 'cover' ? 'object-cover' : 'object-contain p-2';
                
                cell.innerHTML = `
                    <img src="${src}" style="transform: rotate(${bData.rotacion}deg);" class="w-full h-full ${fitClass} transition-all duration-300">
                    <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                        <span class="material-symbols-outlined text-lg">edit</span>
                        <span class="text-[9px] font-black uppercase tracking-wider mt-1">Configurar</span>
                    </div>
                `;
            } else {
                cell.classList.add('bg-slate-50/50', 'hover:bg-blue-50/50', 'hover:border-blue-300', 'border-dashed', 'border-2', 'border-slate-300/80');
                cell.innerHTML = `
                    <div class="text-center p-3">
                        <span class="material-symbols-outlined text-slate-400 group-hover:text-blue-500 text-xl transition-all duration-300">add</span>
                        <span class="block text-[8px] font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest mt-1">Añadir</span>
                    </div>
                `;
            }

            cell.addEventListener('click', () => this._abrirEditorCelda(index));
            canvas.appendChild(cell);
        });

        this._sincronizarBotonesEstilo();
    },

    _renderTemplatesList() {
        const listContainer = document.getElementById('mform-templates-container');
        listContainer.innerHTML = '';

        Object.values(this._plantillas).forEach(tmpl => {
            const btn = document.createElement('button');
            const isActive = tmpl.id === this._estado.currentTemplateId;

            // Integración de clases con miniaturas visuales del prototipo original
            btn.className = `flex items-center space-x-3 p-3 rounded-2xl border-2 shrink-0 transition-all duration-200 h-20 cursor-pointer ${
                isActive 
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100 font-bold' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`;

            // Se inserta la previsualización gráfica (previewHtml) de celdas
            btn.innerHTML = `
                <div class="shrink-0 flex items-center justify-center">${tmpl.previewHtml}</div>
                <div class="leading-tight text-left">
                    <span class="block text-xs font-bold text-slate-800 break-words max-w-[120px]">${tmpl.name}</span>
                    <span class="text-[10px] text-slate-400">${tmpl.slots.length} celdas</span>
                </div>
            `;

            btn.addEventListener('click', () => {
                this._estado.currentTemplateId = tmpl.id;
                this._setupLienzo();
                this._renderTemplatesList();
            });

            listContainer.appendChild(btn);
        });
    },

    _abrirEditorCelda(index) {
        this._estado.activeCellIndex = index;
        const banner = this._estado.banners[index];
        const file = this._estado.archivosBanners[index];

        const preview = document.getElementById('mform-editor-preview');
        const fileInput = document.getElementById('mform-file-input');
        const selectEmpresa = document.getElementById('mform-banner-empresa');
        const inputTitulo = document.getElementById('mform-banner-titulo');
        const inputLink = document.getElementById('mform-banner-link');
        const txtFit = document.getElementById('mform-fit-text');

        inputTitulo.value = banner.titulo;
        inputLink.value = banner.enlace_url;
        selectEmpresa.value = banner.empresa_id || ''; // Precarga la empresa de la celda
        txtFit.innerText = banner.ajuste_modo === 'cover' ? 'Modo: Recortar' : 'Modo: Contener';

        if (file) {
            preview.src = URL.createObjectURL(file);
        } else if (banner.imagen_url) {
            preview.src = banner.imagen_url;
        } else {
            preview.src = 'https://placehold.co/150x150?text=Subir+Banner';
        }

        preview.style.transform = `rotate(${banner.rotacion}deg)`;
        preview.className = `w-full h-full ${banner.ajuste_modo === 'cover' ? 'object-cover' : 'object-contain p-2'}`;

        document.getElementById('mform-cell-editor').classList.remove('translate-x-full');
    },

    _cerrarEditorCelda() {
        document.getElementById('mform-cell-editor').classList.add('translate-x-full');
        this._estado.activeCellIndex = null;
    },

    _sincronizarBotonesEstilo() {
        // Separación (Gaps)
        document.querySelectorAll('[data-mform-gap]').forEach(btn => {
            const isMatch = btn.getAttribute('data-mform-gap') === this._estado.gap;
            btn.className = `mform-gap-btn py-1.5 px-3 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                isMatch ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
            }`;
        });

        // Bordes (Border-radius)
        document.querySelectorAll('[data-mform-border]').forEach(btn => {
            const isMatch = btn.getAttribute('data-mform-border') === this._estado.borderRadius;
            btn.className = `mform-border-btn py-1.5 px-3 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                isMatch ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
            }`;
        });

        // Colores de fondo de la grilla
        document.querySelectorAll('.mform-col-dot').forEach(dot => {
            const isMatch = dot.getAttribute('data-mform-color') === this._estado.bgColor;
            dot.classList.toggle('ring-2', isMatch);
            dot.classList.toggle('ring-blue-500', isMatch);
            dot.classList.toggle('ring-offset-2', isMatch);
        });
    },

    _setupEventListeners(onGuardar, onCancelar, esEdicion) {
        
        // Volver a la tabla principal
        document.getElementById('mform-btn-cancelar').addEventListener('click', () => {
            if (onCancelar) onCancelar();
        });

        // Selección de Gaps
        document.querySelectorAll('[data-mform-gap]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._estado.gap = e.target.getAttribute('data-mform-gap');
                this._setupLienzo();
            });
        });

        // Selección de Bordes
        document.querySelectorAll('[data-mform-border]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._estado.borderRadius = e.target.getAttribute('data-mform-border');
                this._setupLienzo();
            });
        });

        // Selección de paleta de colores predefinidos
        document.querySelectorAll('.mform-col-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this._estado.bgColor = dot.getAttribute('data-mform-color');
                this._setupLienzo();
            });
        });

        // Selector de color personalizado
        document.getElementById('mform-customBgColor').addEventListener('input', (e) => {
            this._estado.bgColor = e.target.value;
            this._setupLienzo();
        });

        // Cerrar panel lateral de celdas
        document.getElementById('mform-btn-close-editor').addEventListener('click', () => this._cerrarEditorCelda());

        // Escuchar cambios de archivo local para el banner activo
        const fileInput = document.getElementById('mform-file-input');
        const preview = document.getElementById('mform-editor-preview');

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && this._estado.activeCellIndex !== null) {
                this._estado.archivosBanners[this._estado.activeCellIndex] = file;
                preview.src = URL.createObjectURL(file);
            }
        });

        // Rotación de la imagen
        document.getElementById('mform-btn-rotate').addEventListener('click', () => {
            if (this._estado.activeCellIndex === null) return;
            const banner = this._estado.banners[this._estado.activeCellIndex];
            banner.rotacion = (banner.rotacion + 90) % 360;
            preview.style.transform = `rotate(${banner.rotacion}deg)`;
        });

        // Modos de ajuste de imagen (Recortar o Contener)
        document.getElementById('mform-btn-fit').addEventListener('click', () => {
            if (this._estado.activeCellIndex === null) return;
            const banner = this._estado.banners[this._estado.activeCellIndex];
            banner.ajuste_modo = banner.ajuste_modo === 'cover' ? 'contain' : 'cover';
            document.getElementById('mform-fit-text').innerText = banner.ajuste_modo === 'cover' ? 'Modo: Recortar' : 'Modo: Contener';
            preview.className = `w-full h-full ${banner.ajuste_modo === 'cover' ? 'object-cover' : 'object-contain p-2'}`;
        });

        // Vaciar celda activa
        document.getElementById('mform-btn-eliminar-imagen').addEventListener('click', () => {
            if (this._estado.activeCellIndex === null) return;
            const idx = this._estado.activeCellIndex;
            
            this._estado.banners[idx] = {
                titulo: '',
                imagen_url: '',
                enlace_url: '',
                col_span: 1,
                row_span: 1,
                rotacion: 0,
                ajuste_modo: 'cover',
                empresa_id: ''
            };
            delete this._estado.archivosBanners[idx];
            
            this._cerrarEditorCelda();
            this._setupLienzo();
        });

        // Guardar cambios específicos de la celda en memoria
        document.getElementById('mform-btn-guardar-celda').addEventListener('click', () => {
            if (this._estado.activeCellIndex === null) return;
            const idx = this._estado.activeCellIndex;

            this._estado.banners[idx].titulo = document.getElementById('mform-banner-titulo').value.trim();
            this._estado.banners[idx].enlace_url = document.getElementById('mform-banner-link').value.trim();
            this._estado.banners[idx].empresa_id = document.getElementById('mform-banner-empresa').value; // Guarda la empresa de la celda

            this._cerrarEditorCelda();
            this._setupLienzo();
        });

        // PROCESAR Y ENVIAR REGISTRO COMPLETO AL CONTROLADOR
        document.getElementById('mform-btn-guardar').addEventListener('click', async () => {
            const identificador = document.getElementById('mform-identificador').value.trim();
            const ubicacion = document.getElementById('mform-ubicacion').value;

            if (!identificador) {
                mosaicoView.notificarError('El nombre identificador del mosaico es un campo requerido.');
                return;
            }

            const template = this._plantillas[this._estado.currentTemplateId];
            
            const configPayload = {
                nombre_identificador: identificador,
                ubicacion: ubicacion,
                plantilla_id: this._estado.currentTemplateId,
                color_fondo: this._estado.bgColor,
                separacion: this._estado.gap,
                redondeado: this._estado.borderRadius,
                activo: true
            };

            const bannersArray = [];
            const archivosBannersArray = [];

            for (let i = 0; i < template.slots.length; i++) {
                const slotConfig = template.slots[i];
                const localBanner = this._estado.banners[i];

                // Validación: Cada celda activa de la plantilla elegida DEBE tener una empresa asociada [4]
                if (!localBanner.empresa_id) {
                    mosaicoView.notificarError(`Cada banner individual del mosaico debe estar asociado a una empresa (Falta configurar el anunciante en la celda ${i + 1}).`);
                    return;
                }

                bannersArray.push({
                    empresa_id: localBanner.empresa_id, // <-- Vinculado de forma individual a la celda [4]
                    titulo: localBanner.titulo,
                    imagen_url: localBanner.imagen_url, // Conserva la URL de Supabase actual si ya existía
                    enlace_url: localBanner.enlace_url,
                    col_span: slotConfig.colSpan,
                    row_span: slotConfig.rowSpan,
                    orden: i + 1,
                    rotacion: localBanner.rotacion,
                    ajuste_modo: localBanner.ajuste_modo
                });

                // Si se cargó una nueva imagen binaria local, se prepara para el FormData
                if (this._estado.archivosBanners[i]) {
                    archivosBannersArray.push({
                        index: i,
                        file: this._estado.archivosBanners[i]
                    });
                }
            }

            if (onGuardar) {
                await onGuardar(configPayload, bannersArray, archivosBannersArray);
            }
        });
    }
};

window.mosaicoFormView = mosaicoFormView;