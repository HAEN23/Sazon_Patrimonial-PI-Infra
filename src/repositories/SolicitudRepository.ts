import { prisma } from '../client/prisma.client';
import {
  ICreateSolicitudRegistro,
  IUpdateSolicitudRegistro,
} from '../models/SolicitudRegistro.model';

export class SolicitudRepository {
  /**
   * Obtener todas las solicitudes
   */
  async findAll() {
    return await prisma.solicitudRegistro.findMany({
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            correo: true,
          },
        },
        restaurantes: true,
        revisiones: {
          include: {
            usuario: {
              select: {
                nombre: true,
                correo: true,
              },
            },
          },
        },
        comprobantes: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  /**
   * Obtener solicitud por ID
   */
  async findById(id: number) {
    return await prisma.solicitudRegistro.findUnique({
      where: { id_solicitud: id },
      include: {
        usuario: true,
        restaurantes: true,
        revisiones: {
          include: {
            usuario: true,
          },
        },
        comprobantes: true,
      },
    });
  }

  /**
   * Crear nueva solicitud
   */
  async create(data: ICreateSolicitudRegistro) {
    return await prisma.solicitudRegistro.create({
      data,
      include: {
        usuario: true,
      },
    });
  }

  /**
   * Actualizar solicitud
   */
  async update(id: number, data: IUpdateSolicitudRegistro) {
    return await prisma.solicitudRegistro.update({
      where: { id_solicitud: id },
      data,
      include: {
        usuario: true,
        revisiones: true,
      },
    });
  }

  /**
   * Eliminar solicitud
   */
  async delete(id: number) {
    return await prisma.solicitudRegistro.delete({
      where: { id_solicitud: id },
    });
  }

  /**
   * Obtener solicitudes por estado
   */
  async findByEstado(estado: string) {
    return await prisma.solicitudRegistro.findMany({
      where: { estado },
      include: {
        usuario: {
          select: {
            nombre: true,
            correo: true,
          },
        },
        restaurantes: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  /**
   * Obtener solicitudes pendientes
   */
  async findPendientes() {
    return await this.findByEstado('Pendiente');
  }

  /**
   * Obtener solicitudes aprobadas
   */
  async findAprobadas() {
    return await this.findByEstado('Aprobado');
  }

  /**
   * Obtener solicitudes rechazadas
   */
  async findRechazadas() {
    return await this.findByEstado('Rechazado');
  }

  /**
   * Obtener solicitudes por usuario
   */
  async findByUsuario(id_usuario: number) {
    return await prisma.solicitudRegistro.findMany({
      where: { id_usuario },
      include: {
        restaurantes: true,
        revisiones: true,
        comprobantes: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  /**
   * Cambiar estado de solicitud
   */
  async cambiarEstado(id: number, estado: string) {
    return await prisma.solicitudRegistro.update({
      where: { id_solicitud: id },
      data: { estado },
    });
  }

  /**
   * Contar solicitudes por estado
   */
  async countByEstado(estado: string) {
    return await prisma.solicitudRegistro.count({
      where: { estado },
    });
  }

  /**
   * Obtener estadísticas de solicitudes
   */
  async getEstadisticas() {
    const total = await prisma.solicitudRegistro.count();
    const pendientes = await this.countByEstado('Pendiente');
    const aprobadas = await this.countByEstado('Aprobado');
    const rechazadas = await this.countByEstado('Rechazado');

    return {
      total,
      pendientes,
      aprobadas,
      rechazadas,
    };
  }

  /**
   * Buscar solicitudes por nombre de restaurante
   */
  async searchByNombreRestaurante(nombre: string) {
    return await prisma.solicitudRegistro.findMany({
      where: {
        nombre_propuesto_restaurante: {
          contains: nombre,
          mode: 'insensitive',
        },
      },
      include: {
        usuario: true,
        restaurantes: true,
      },
    });
  }
}