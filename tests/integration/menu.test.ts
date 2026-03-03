import { MenuRepository } from '../../src/repositories/MenuRepository';

describe('Menu Repository Tests', () => {
  const menuRepo = new MenuRepository();

  test('Debe obtener menús de un restaurante', async () => {
    const menus = await menuRepo.findByRestaurante(1);
    expect(menus).toBeDefined();
    expect(Array.isArray(menus)).toBe(true);
  });

  test('Debe incrementar contador de descargas', async () => {
    // Primero obtener un menú existente
    const menus = await menuRepo.findByRestaurante(1);
    
    if (menus.length > 0) {
      const menu = menus[0];
      const contadorInicial = menu.contador_descargas;
      
      const menuActualizado = await menuRepo.incrementDownloads(menu.id_menu);
      
      expect(menuActualizado.contador_descargas).toBe(contadorInicial + 1);
    }
  });
});