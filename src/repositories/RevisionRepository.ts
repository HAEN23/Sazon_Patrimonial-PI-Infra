import { prisma } from '../client/prisma.client';
import { ICreateRevisionSolicitud } from '../models/RevisionSolicitud.model';

export class RevisionRepository {
  /**
   * Obtener todas las revisiones
   */
  async findAll() {
    return await prisma.revision_solicitud.findMany({
      include: {
        solicitud_registro: {
          include: {
            usuario: true,
            restaurante: true,
          },
        },
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            correo: true,
            rol: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  /**
   * Obtener revisión por ID
   */
  async findById(id: number) {
    return await prisma.revision_solicitud.findUnique({
      where: { id_revision: id },
      include: {
        solicitud_registro: {
          include: {
            usuario: true,
            restaurante: true,
          },
        },
        usuario: {
          include: {
            rol: true,
          },
        },
      },
    });
  }

  /**
   * Crear nueva revisión
   */
  async create(data: ICreateRevisionSolicitud) {
    return await prisma.revision_solicitud.create({
      data,
      include: {
        solicitud_registro: true,
        usuario: true,
      },
    });
  }

  /**
   * Eliminar revisión
   */
  async delete(id: number) {
    return await prisma.revision_solicitud.delete({
      where: { id_revision: id },
    });
  }

  /**
   * Obtener revisiones por solicitud
   */
  async findBySolicitud(id_solicitud: number) {
    return await prisma.revision_solicitud.findMany({
      where: { id_solicitud },
      include: {
        usuario: {
          select: {
            nombre: true,
            correo: true,
            rol: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  /**
   * Obtener revisiones realizadas por un usuario (admin)
   */
  async findByUsuario(id_usuario: number) {
    return await prisma.revision_solicitud.findMany({
      where: { id_usuario },
      include: {
        solicitud_registro: {
          include: {
            usuario: true,
            restaurante: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  /**
   * Verificar si una solicitud ya fue revisada
   */
  async existeRevision(id_solicitud: number): Promise<boolean> {
    const count = await prisma.revision_solicitud.count({
      where: { id_solicitud },
    });
    return count > 0;
  }

  /**
   * Obtener última revisión de una solicitud
   */
  async getUltimaRevision(id_solicitud: number) {
    return await prisma.revision_solicitud.findFirst({
      where: { id_solicitud },
      include: {
        usuario: {
          select: {
            nombre: true,
            correo: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  /**
   * Contar revisiones por usuario
   */
  async countByUsuario(id_usuario: number) {
    return await prisma.revision_solicitud.count({
      where: { id_usuario },
    });
  }

  /**
   * Obtener estadísticas de revisiones
   */
  async getEstadisticas() {
    const total = await prisma.revision_solicitud.count();
    
    const porUsuario = await prisma.revision_solicitud.groupBy({
      by: ['id_usuario'],
      _count: {
        id_revision: true,
      },
    });

    return {
      total,
      porUsuario,
    };
  }
}