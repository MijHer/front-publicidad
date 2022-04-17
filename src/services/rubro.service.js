import { http } from "./http";

export function listarRubros()
{
    return http().get('/v1/rubro');
}
export function guardarRubros(datos)
{
    return http().post('/v1/rubro', datos);
}
export function mostrarRubros(id)
{
    return http().get('/v1/rubro/'+id);
}
export function modificarRubros(id, datos)
{
    return http().patch('/v1/rubro/'+id, datos);
}
export function eliminarRubros(id)
{
    return http().delete('/v1/rubro/'+id);
}