import { http } from "./http";

export function listarPersonas()
{
    return http().get('/v1/persona');
}
export function guardarPersonas(datos)
{
    return http().post('/v1/persona', datos);
}
export function mostrarPersonas(id)
{
    return http().get('/v1/persona/'+id);
}
export function modificarPersonas(id, datos)
{
    return http().patch('/v1/persona/'+id, datos);
}
export function eliminarPersonas(id)
{
    return http().delete('/v1/persona/'+id);
}