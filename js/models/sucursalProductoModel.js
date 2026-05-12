import { supabase } from '../config/supabaseClient.js';

export const sucursalProductoModel = {

    async getBySucursal(idSucursal) {
        try {
            const { data, error } = await supabase
                .from('sucursal_producto')
                .select('*')
                .eq('id_sucursal', idSucursal)
                .eq('visible', true);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Model Error [sucursalProducto.getBySucursal]:', error.message);
            return [];
        }
    },

    /**
     * Obtiene todas las sucursales donde está asignado un producto
     * Retorna [{ id_sucursal, precio, stock, visible }]
     */
    async getByProducto(idProducto) {
        try {
            const { data, error } = await supabase
                .from('sucursal_producto')
                .select('id_sucursal, precio, stock, visible')
                .eq('id_producto', idProducto);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Model Error [sucursalProducto.getByProducto]:', error.message);
            return [];
        }
    },

    async updateStock(idSucursal, idProducto, updates) {
        try {
            const { data, error } = await supabase
                .from('sucursal_producto')
                .update({
                    precio: updates.precio,
                    stock: updates.stock,
                    visible: updates.visible ?? true
                })
                .eq('id_sucursal', idSucursal)
                .eq('id_producto', idProducto)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Model Error [sucursalProducto.updateStock]:', error.message);
            return null;
        }
    },

    async asignarProducto(payload) {
        try {
            const { data, error } = await supabase
                .from('sucursal_producto')
                .insert([{
                    id_sucursal: payload.idSucursal,
                    id_producto: payload.idProducto,
                    precio: payload.precio || 0,
                    stock: payload.stock || 0,
                    visible: true
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Model Error [sucursalProducto.asignar]:', error.message);
            throw error;
        }
    },

    async ocultarProducto(idSucursal, idProducto) {
        try {
            const { error } = await supabase
                .from('sucursal_producto')
                .update({ visible: false })
                .match({ id_sucursal: idSucursal, id_producto: idProducto });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Model Error [sucursalProducto.ocultar]:', error.message);
            return false;
        }
    },

    async sincronizar(idProducto, sucursales) {
        try {
            const activas = sucursales.filter(s => s.activa);
            const idsActivas = activas.map(s => parseInt(s.id_sucursal));

            await Promise.all([
                // Elimina las que no están en la lista activa
                idsActivas.length > 0
                    ? supabase.from('sucursal_producto').delete()
                        .eq('id_producto', parseInt(idProducto))
                        .not('id_sucursal', 'in', `(${idsActivas.join(',')})`)
                    : supabase.from('sucursal_producto').delete()
                        .eq('id_producto', parseInt(idProducto)),

                // Upsert de las activas
                activas.length > 0
                    ? supabase.from('sucursal_producto').upsert(
                        activas.map(s => ({
                            id_sucursal: parseInt(s.id_sucursal),
                            id_producto: parseInt(idProducto),
                            precio: parseFloat(s.precio) || 0,
                            stock: parseInt(s.stock) || 0,
                            visible: true
                        })),
                        { onConflict: 'id_sucursal,id_producto' }
                    )
                    : Promise.resolve()
            ]);

            return { exito: true };
        } catch (error) {
            console.error('Model Error [sucursalProducto.sincronizar]:', error.message);
            return { exito: false, mensaje: error.message };
        }
    }
};