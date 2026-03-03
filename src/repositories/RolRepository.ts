import { prisma } from '../client/prisma.client';
import { ICreateRol, IUpdateRol } from '../models/Rol.model';

export class RolRepository {
  /**
   * Obtener todos los roles
   */
  async findAll() {
    return await prisma.rol.findMany({
      include: {
        usuarios: {
          select: {
            id_usuario: true,
            nombre: true,
            correo: true,
          },
        },
      },
    });
  }

  /**
   * Obtener rol por ID
   */
  async findById(id: number) {
    return await prisma.rol.findUnique({
      where: { id_rol: id },
      include: {
        usuarios: {
          select: {
            id_usuario: true,
            nombre: true,
            correo: true,
            foto_evidencia: true,
          },
        },
      },
    });
  }

  /**
   * Obtener rol por nombre
   */
  async findByName(nombre_rol: string) {
    return await prisma.rol.findFirst({
      where: { nombre_rol },
      include: {
        usuarios: true,
      },
    });
  }

  /**
   * Crear nuevo rol
   */
  async create(data: ICreateRol) {
    return await prisma.rol.create({
      data,
    });
  }

  /**
   * Actualizar rol
   */
  async update(id: number, data: IUpdateRol) {
    return await prisma.rol.update({
      where: { id_rol: id },
      data,
    });
  }

  /**
   * Eliminar rol
   */
  async delete(id: number) {
    return await prisma.rol.delete({
      where: { id_rol: id },
    });
  }

  /**
   * Contar usuarios por rol
   */
  async countUsuariosByRol(id_rol: number) {
    return await prisma.usuario.count({
      where: { id_rol },
    });
  }

  /**
   * Verificar si el rol existe
   */
  async exists(id: number): Promise<boolean> {
    const rol = await prisma.rol.findUnique({
      where: { id_rol: id },
    });
    return rol !== null;
  }
}