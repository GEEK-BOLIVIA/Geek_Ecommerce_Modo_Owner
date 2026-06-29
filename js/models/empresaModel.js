import { supabase } from '../config/supabaseClient.js';

export const empresaModel = {
    baseUrl: 'https://khaki-seahorse-622009.hostingersite.com/api/empresas',

    // Extrae de forma dinámica el token JWT activo de la sesión de Supabase
    async getAuthHeaders() {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    async getAll() {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) throw new Error('Error al listar las empresas.');
            const resultado = await response.json();
            return resultado.success ? resultado.data : [];
        } catch (error) {
            console.error('Error al obtener empresas:', error.message);
            return [];
        }
    },

    async getById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) throw new Error(`Error al obtener la empresa ${id}`);
            const resultado = await response.json();
            return resultado.success ? resultado.data : null;
        } catch (error) {
            console.error('Model Error [empresaModel.getById]:', error.message);
            return null;
        }
    },

    async create(datos, archivoLogo = null) {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(datos));

            if (archivoLogo) {
                formData.append('logo', archivoLogo);
            }

            // Nota el uso de 'await' al llamar a getAuthHeaders()
            const authHeaders = await this.getAuthHeaders();

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    ...authHeaders
                },
                body: formData
            });

            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.error || 'Error al crear la empresa.');
            return resultado.data;
        } catch (error) {
            console.error('Model Error [empresaModel.create]:', error.message);
            throw error;
        }
    },

    async update(id, updates, archivoLogo = null) {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(updates));

            if (archivoLogo) {
                formData.append('logo', archivoLogo);
            }

            // Nota el uso de 'await' al llamar a getAuthHeaders()
            const authHeaders = await this.getAuthHeaders();

            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    ...authHeaders
                },
                body: formData
            });

            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.error || 'Error al actualizar la empresa.');
            return resultado.data;
        } catch (error) {
            console.error('Model Error [empresaModel.update]:', error.message);
            throw error;
        }
    },

    async delete(id) {
        // Nota el uso de 'await' al llamar a getAuthHeaders()
        const authHeaders = await this.getAuthHeaders();

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                ...authHeaders
            }
        });

        const resultado = await response.json();
        if (!response.ok) throw new Error(resultado.error || 'Error al intentar eliminar la empresa.');
        return resultado.data;
    }
};