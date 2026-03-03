import { prisma } from '../client/prisma.client';
import { ICreateFavoritos } from '../models/Favoritos.model';

export class FavoritosRepository {
  // Obtener todos los favoritos de un usuario
  async findByUsuario(id_usuario: number) {
    return await prisma.favoritos.findMany({
      where: { id_usuario },
      include: {
        restaurante: true,
      },
    });
  }

  // Agregar a favoritos
  async create(data: ICreateFavoritos) {
    return await prisma.favoritos.create({
      data,
      include: {
        restaurante: true,
        usuario: true,
      },
    });
  }

  // Eliminar de favoritos
  async delete(id: number) {
    return await prisma.favoritos.delete({
      where: { id_favorito: id },
    });
  }

  // Verificar si existe en favoritos
  async exists(id_usuario: number, id_restaurante: number) {
    const favorito = await prisma.favoritos.findFirst({
      where: {
        id_usuario,
        id_restaurante,
      },
    });
    return favorito !== null;
  }

  // Eliminar favorito específico
  async deleteByUsuarioRestaurante(id_usuario: number, id_restaurante: number) {
    return await prisma.favoritos.deleteMany({
      where: {
        id_usuario,
        id_restaurante,
      },
    });
  }
}