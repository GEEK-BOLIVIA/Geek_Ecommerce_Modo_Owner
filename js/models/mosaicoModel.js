import { supabase } from '../config/supabaseClient.js';

export const mosaicoModel = {
    baseUrl: 'https://khaki-seahorse-622009.hostingersite.com/api/mosaicos',

    // Obtiene el token JWT dinámico del usuario logueado en Supabase
    async getAuthHeaders() {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // GET /api/mosaicos/activo/:ubicacion (Público para el e-commerce)
    async getActivoPorUbicacion(ubicacion = 'home_principal') {
        try {
            const response = await fetch(`${this.baseUrl}/activo/${ubicacion}`);
            if (!response.ok) throw new Error('No se pudo recuperar el mosaico activo.');
            const resultado = await response.json();
            return resultado.success ? resultado.data : null;
        } catch (error) {
            console.error('Error en mosaicoModel.getActivoPorUbicacion:', error.message);
            return null;
        }
    },

    // GET /api/mosaicos/privado (Listado administrativo filtrado por rol)
    async getAllAdmin() {
        try {
            const response = await fetch(`${this.baseUrl}/privado`, {
                headers: await this.getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al listar las configuraciones de mosaicos.');
            const resultado = await response.json();
            return resultado.success ? resultado.data : [];
        } catch (error) {
            console.error('Error en mosaicoModel.getAllAdmin:', error.message);
            return [];
        }
    },

    // GET /api/mosaicos/:id (Obtiene la configuración padre junto con sus banners hijos)
    async getById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                headers: await this.getAuthHeaders()
            });
            if (!response.ok) throw new Error(`Error al obtener el mosaico con ID: ${id}`);
            const resultado = await response.json();
            return resultado.success ? resultado.data : null;
        } catch (error) {
            console.error('Error en mosaicoModel.getById:', error.message);
            return null;
        }
    },

    // POST /api/mosaicos o PUT /api/mosaicos/:id
    // Recibe la configuración del mosaico, la lista de banners y los archivos de imagen mapeados
    async guardar(id = null, config, banners = [], archivosBanners = []) {
        try {
            const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
            const method = id ? 'PUT' : 'POST';

            const formData = new FormData();
            
            // Adjunta la metadata estructurada esperada por el backend en Express
            formData.append('data', JSON.stringify({ config, banners }));

            // Adjunta los archivos de imágenes respetando su posición o índice correspondiente
            // archivosBanners debe ser un array de objetos con formato: { index: 0, file: File }
            archivosBanners.forEach((item) => {
                formData.append(`banners[${item.index}][archivo_imagen]`, item.file);
            });

            const response = await fetch(url, {
                method: method,
                headers: await this.getAuthHeaders(),
                body: formData
            });

            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.error || 'Error al procesar el guardado del mosaico.');
            return resultado;
        } catch (error) {
            console.error('Error en mosaicoModel.guardar:', error.message);
            throw error;
        }
    },

    // PATCH /api/mosaicos/:id/activo
    async toggleActivo(id, activo) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}/activo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...await this.getAuthHeaders()
                },
                body: JSON.stringify({ activo })
            });

            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.error || 'No se pudo actualizar el estado del mosaico.');
            return resultado;
        } catch (error) {
            console.error('Error en mosaicoModel.toggleActivo:', error.message);
            throw error;
        }
    },

    // DELETE /api/mosaicos/:id
    async delete(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders()
            });

            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.error || 'No se pudo eliminar el mosaico.');
            return resultado;
        } catch (error) {
            console.error('Error en mosaicoModel.delete:', error.message);
            throw error;
        }
    }
};