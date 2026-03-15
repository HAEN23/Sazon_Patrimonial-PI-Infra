import { prisma } from '../client/prisma.client';
import { ICreateUsuario, IUpdateUsuario } from '../models/Usuario.model';

export class UsuarioRepository {
  // Obtener todos los usuarios
  async findAll() {
    return await prisma.usuario.findMany({
      include: {
        rol: true,
      },
    });
  }

  // Obtener usuario por ID
  async findById(id: number) {
    return await prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: {
        rol: true,
        favoritos: true,
        restaurante: true,
      },
    });
  }

  // Obtener usuario por correo
  async findByEmail(correo: string) {
    return await prisma.usuario.findUnique({
      where: { correo },
      include: {
        rol: true,
      },
    });
  }

  // Crear nuevo usuario
  async create(data: ICreateUsuario) {
    return await prisma.usuario.create({
      data,
      include: {
        rol: true,
      },
    });
  }

  // Actualizar usuario
  async update(id: number, data: IUpdateUsuario) {
    return await prisma.usuario.update({
      where: { id_usuario: id },
      data,
      include: {
        rol: true,
      },
    });
  }

  // Eliminar usuario
  async delete(id: number) {
    return await prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }

  // Obtener usuarios por rol
  async findByRol(id_rol: number) {
    return await prisma.usuario.findMany({
      where: { id_rol },
      include: {
        rol: true,
      },
    });
  }
}