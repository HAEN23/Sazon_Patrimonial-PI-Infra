import { RestauranteRepository } from '../../src/repositories/RestauranteRepository';

describe('Restaurante Repository Tests', () => {
  const restauranteRepo = new RestauranteRepository();

  test('Debe obtener todos los restaurantes', async () => {
    const restaurantes = await restauranteRepo.findAll();
    expect(restaurantes).toBeDefined();
    expect(Array.isArray(restaurantes)).toBe(true);
  });

  test('Debe obtener restaurantes por zona', async () => {
    const restaurantes = await restauranteRepo.findByZona('Centro');
    expect(restaurantes).toBeDefined();
    expect(Array.isArray(restaurantes)).toBe(true);
  });

  test('Debe buscar restaurantes por etiquetas', async () => {
    const restaurantes = await restauranteRepo.findByEtiquetas('Mexicana');
    expect(restaurantes).toBeDefined();
    expect(Array.isArray(restaurantes)).toBe(true);
  });
});