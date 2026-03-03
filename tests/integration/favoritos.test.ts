import { FavoritosRepository } from '../../src/repositories/FavoritosRepository';

describe('Favoritos Repository Tests', () => {
  const favoritosRepo = new FavoritosRepository();

  test('Debe verificar si existe un favorito', async () => {
    const existe = await favoritosRepo.exists(1, 1);
    expect(typeof existe).toBe('boolean');
  });

  test('Debe obtener favoritos de un usuario', async () => {
    const favoritos = await favoritosRepo.findByUsuario(1);
    expect(favoritos).toBeDefined();
    expect(Array.isArray(favoritos)).toBe(true);
  });
});