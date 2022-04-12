import { http } from "./http";

export function listarCategorias()
{
    return http().get('/v1/categoria');
}

export function guardarCategorias(datos)
{
    return http().post('/v1/categoria', datos);
}

export function mostarCategorias(id)
{
    return http().get('/v1/categoria/'+id);
}

export function modificarCategorias(id, datos)
{
    return http().patch('/v1/categoria/'+id, datos);
}

export function eliminarCategorias(id)
{
    return http().delete('/v1/categoria/'+id);
}