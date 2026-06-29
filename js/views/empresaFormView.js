export const empresaFormView = {

    async abrir({ datos = null, esEdicion = false, onGuardar, onCancelar }) {
        const titulo = esEdicion ? 'EDITAR EMPRESA' : 'NUEVA EMPRESA';
        const nombreInicial = datos ? datos.nombre : '';
        const logoInicial = datos && datos.logo_url ? datos.logo_url : 'https://placehold.co/150x150?text=Subir+Logo';

        const { value: formValues, isDismissed } = await Swal.fire({
            title: `<span class="text-slate-800 font-black uppercase text-sm">${titulo}</span>`,
            html: `
                <div class="flex flex-col gap-5 text-left p-2">
                    
                    <!-- Previsualización y Carga de Logotipo -->
                    <div class="flex flex-col items-center justify-center gap-2 mb-2">
                        <div class="relative group">
                            <img id="form-logo-preview" src="${logoInicial}" 
                                 class="w-28 h-28 rounded-2xl object-cover shadow-md border border-slate-200 bg-white transition-all group-hover:opacity-90">
                            
                            <!-- Botón Flotante para Subir Imagen -->
                            <label for="form-logo-input" 
                                   class="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full shadow-md cursor-pointer hover:bg-indigo-700 transition-all flex items-center justify-center border-2 border-white">
                                <span class="material-symbols-outlined text-[16px] font-bold">upload</span>
                            </label>
                        </div>
                        <span class="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Logotipo Corporativo</span>
                        <input type="file" id="form-logo-input" accept="image/*" class="hidden">
                    </div>

                    <!-- Input para el Nombre de la Empresa -->
                    <div>
                        <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Nombre de la Empresa</label>
                        <input type="text" id="form-emp-nombre" value="${nombreInicial}"
                               class="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm
                                      outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500
                                      transition-all font-medium text-slate-800"
                               placeholder="Ej. Geek Center">
                    </div>

                </div>
            `,
            showCancelButton: true,
            confirmButtonText: esEdicion ? 'APLICAR CAMBIOS' : 'REGISTRAR',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#4f46e5', // Indigo-600
            customClass: {
                popup: 'rounded-[32px] border-none shadow-2xl max-w-sm',
                confirmButton: 'rounded-xl px-6 py-2.5 font-bold text-xs uppercase',
                cancelButton: 'rounded-xl px-6 py-2.5 font-bold text-xs uppercase bg-slate-100 text-slate-500'
            },
            didOpen: () => {
                const input = document.getElementById('form-logo-input');
                const preview = document.getElementById('form-logo-preview');
                
                if (input && preview) {
                    input.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                preview.src = event.target.result;
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                }
            },
            preConfirm: () => {
                const nombre = document.getElementById('form-emp-nombre')?.value.trim();
                const logoInput = document.getElementById('form-logo-input');
                const archivoLogo = logoInput?.files ? logoInput.files[0] : null;

                if (!nombre) {
                    Swal.showValidationMessage('El nombre de la empresa es obligatorio.');
                    return false;
                }

                return {
                    datos: { nombre },
                    archivoLogo
                };
            }
        });

        if (isDismissed) {
            if (onCancelar) onCancelar();
            return;
        }

        if (formValues && onGuardar) {
            await onGuardar(formValues.datos, formValues.archivoLogo);
        }
    }
};

window.empresaFormView = empresaFormView;