import { prisma } from '../client/prisma.client';
import { ICreateRestaurante, IUpdateRestaurante } from '../models/Restaurante.model';

export class RestauranteRepository {
  // Obtener todos los restaurantes
  async findAll() {
    return await prisma.restaurante.findMany({
      include: {
        usuario: true,
        solicitud_registro: true,
        favoritos: true,
        menu: true,
      },
    });
  }

  // Obtener restaurante por ID
  async findById(id: number) {
    return await prisma.restaurante.findUnique({
      where: { id_restaurante: id },
      include: {
        usuario: true,
        solicitud_registro: true,
        favoritos: {
          include: {
            usuario: true,
          },
        },
        menu: true,
        comprobante: true,
      },
    });
  }

  // Crear nuevo restaurante
  async create(data: ICreateRestaurante) {
    return await prisma.restaurante.create({
      data,
      include: {
        usuario: true,
        solicitud_registro: true,
      },
    });
  }

  // Actualizar restaurante
  async update(id: number, data: IUpdateRestaurante) {
    return await prisma.restaurante.update({
      where: { id_restaurante: id },
      data,
      include: {
        usuario: true,
        solicitud_registro: true,
      },
    });
  }

  // Eliminar restaurante
  async delete(id: number) {
    return await prisma.restaurante.delete({
      where: { id_restaurante: id },
    });
  }

  // Buscar restaurantes por zona
  async findByZona(zona: string) {
    return await prisma.restaurante.findMany({
      where: { zona },
      include: {
        usuario: true,
      },
    });
  }

  // Buscar restaurantes por etiquetas
  async findByEtiquetas(etiqueta: string) {
    return await prisma.restaurante.findMany({
      where: {
        etiquetas: {
          contains: etiqueta,
        },
      },
      include: {
        usuario: true,
      },
    });
  }

  // Obtener restaurantes de un usuario
  async findByUsuario(id_usuario: number) {
    return await prisma.restaurante.findMany({
      where: { id_usuario },
      include: {
        solicitud_registro: true,
        menu: true,
      },
    });
  }
}