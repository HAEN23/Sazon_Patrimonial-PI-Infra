import { prisma } from '../client/prisma.client';
import { ICreateMenu, IUpdateMenu } from '../models/Menu.model';

export class MenuRepository {
  // Obtener menú por restaurante
  async findByRestaurante(id_restaurante: number) {
    return await prisma.menu.findMany({
      where: { id_restaurante },
      include: {
        restaurante: true,
        usuario: true,
      },
    });
  }

  // Crear nuevo menú
  async create(data: ICreateMenu) {
    return await prisma.menu.create({
      data,
      include: {
        restaurante: true,
        usuario: true,
      },
    });
  }

  // Actualizar menú
  async update(id: number, data: IUpdateMenu) {
    return await prisma.menu.update({
      where: { id_menu: id },
      data,
    });
  }

  // Incrementar contador de descargas
  async incrementDownloads(id: number) {
    return await prisma.menu.update({
      where: { id_menu: id },
      data: {
        contador_descargas: {
          increment: 1,
        },
      },
    });
  }

  // Eliminar menú
  async delete(id: number) {
    return await prisma.menu.delete({
      where: { id_menu: id },
    });
  }
}