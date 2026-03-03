import { SolicitudRepository } from '../../src/repositories/SolicitudRepository';

describe('Solicitud Repository Tests', () => {
  const solicitudRepo = new SolicitudRepository();

  test('Debe obtener todas las solicitudes', async () => {
    const solicitudes = await solicitudRepo.findAll();
    expect(solicitudes).toBeDefined();
    expect(Array.isArray(solicitudes)).toBe(true);
  });

  test('Debe obtener solicitudes pendientes', async () => {
    const pendientes = await solicitudRepo.findPendientes();
    expect(pendientes).toBeDefined();
    expect(Array.isArray(pendientes)).toBe(true);
  });

  test('Debe obtener estadísticas de solicitudes', async () => {
    const stats = await solicitudRepo.getEstadisticas();
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('pendientes');
    expect(stats).toHaveProperty('aprobadas');
    expect(stats).toHaveProperty('rechazadas');
  });
});