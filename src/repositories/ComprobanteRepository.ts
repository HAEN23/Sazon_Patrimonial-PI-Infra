import { prisma } from '../client/prisma.client';
import { ICreateComprobante } from '../models/Comprobante.model';

export class ComprobanteRepository {
  /**
   * Obtener todos los comprobantes
   */
  async findAll() {
    return await prisma.comprobante.findMany({
      include: {
        restaurante: {
          select: {
            id_restaurante: true,
            nombre: true,
          },
        },
        solicitud_registro: {
          select: {
            id_solicitud: true,
            nombre_propuesto_restaurante: true,
            estado: true,
          },
        },
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            correo: true,
          },
        },
      },
      orderBy: {
        fecha_subida: 'desc',
      },
    });
  }

  /**
   * Obtener comprobante por ID
   */
  async findById(id: string) {
    return await prisma.comprobante.findUnique({
      where: { id_comprobante: id },
      include: {
        restaurante: true,
        solicitud_registro: true,
        usuario: true,
      },
    });
  }

  /**
   * Crear nuevo comprobante
   */
  async create(data: ICreateComprobante) {
    return await prisma.comprobante.create({
      data,
      include: {
        restaurante: true,
        solicitud_registro: true,
        usuario: true,
      },
    });
  }

  /**
   * Eliminar comprobante
   */
  async delete(id: string) {
    return await prisma.comprobante.delete({
      where: { id_comprobante: id },
    });
  }

  /**
   * Obtener comprobantes por restaurante
   */
  async findByRestaurante(id_restaurante: number) {
    return await prisma.comprobante.findMany({
      where: { id_restaurante },
      include: {
        usuario: {
          select: {
            nombre: true,
            correo: true,
          },
        },
        solicitud_registro: true,
      },
      orderBy: {
        fecha_subida: 'desc',
      },
    });
  }

  /**
   * Obtener comprobantes por solicitud
   */
  async findBySolicitud(id_solicitud: number) {
    return await prisma.comprobante.findMany({
      where: { id_solicitud },
      include: {
        restaurante: true,
        usuario: {
          select: {
            nombre: true,
            correo: true,
          },
        },
      },
      orderBy: {
        fecha_subida: 'desc',
      },
    });
  }

  /**
   * Obtener comprobantes por usuario
   */
  async findByUsuario(id_usuario: number) {
    return await prisma.comprobante.findMany({
      where: { id_usuario },
      include: {
        restaurante: {
          select: {
            nombre: true,
          },
        },
        solicitud_registro: {
          select: {
            nombre_propuesto_restaurante: true,
            estado: true,
          },
        },
      },
      orderBy: {
        fecha_subida: 'desc',
      },
    });
  }

  /**
   * Obtener comprobantes por tipo
   */
  async findByTipo(tipo: string) {
    return await prisma.comprobante.findMany({
      where: { tipo },
      include: {
        restaurante: true,
        usuario: true,
      },
      orderBy: {
        fecha_subida: 'desc',
      },
    });
  }

  /**
   * Verificar si existe un comprobante
   */
  async exists(id: string): Promise<boolean> {
    const comprobante = await prisma.comprobante.findUnique({
      where: { id_comprobante: id },
    });
    return comprobante !== null;
  }

  /**
   * Contar comprobantes por restaurante
   */
  async countByRestaurante(id_restaurante: number) {
    return await prisma.comprobante.count({
      where: { id_restaurante },
    });
  }

  /**
   * Contar comprobantes por tipo
   */
  async countByTipo(tipo: string) {
    return await prisma.comprobante.count({
      where: { tipo },
    });
  }

  /**
   * Obtener estadísticas de comprobantes
   */
  async getEstadisticas() {
    const total = await prisma.comprobante.count();

    const porTipo = await prisma.comprobante.groupBy({
      by: ['tipo'],
      _count: {
        id_comprobante: true,
      },
    });

    return {
      total,
      porTipo,
    };
  }

  /**
   * Buscar comprobantes recientes (últimos 30 días)
   */
  async findRecientes(dias: number = 30) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - dias);

    return await prisma.comprobante.findMany({
      where: {
        fecha_subida: {
          gte: fecha,
        },
      },
      include: {
        restaurante: true,
        usuario: true,
      },
      orderBy: {
        fecha_subida: 'desc',
      },
    });
  }
}