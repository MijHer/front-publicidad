import { http } from "./http";

export function listarPublicaciones(page=1)
{
    return http().get(`/v1/publicacion?page=${page}`);
}
export function guardarPublicaciones(datos)
{
    return http().post('/v1/publicacion', datos); 
}
export function mostrarPublicaciones(id)
{
    return http().get(`/v1/publicacion/${id}`);
}
export function modificarPublicaciones(id, datos)
{
    return http().patch('/v1/publicacion/'+id, datos);   
}
export function eliminarPublicaciones(id)
{
    return http().delete(`/v1/publicacion/${id}`);
}
