import { http } from "./http";

export function listarEmpresas()
{
    return http().get('/v1/empresa');
}
export function guardarEmpresas(datos)
{
    return http().post('/v1/empresa', datos);
}
export function mostrarEmpresas(id)
{
    return http().get('/v1/empresa/'+id);
}
export function modificarEmpresas(id, datos)
{
    return http().patch('/v1/empresa/'+id, datos);
}
export function eliminarEmpresas(id)
{
    return http().delete('/v1/empresa/'+id);
}