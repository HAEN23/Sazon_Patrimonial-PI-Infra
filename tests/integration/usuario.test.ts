import { UsuarioRepository } from '../../src/repositories/UsuarioRepository';

describe('Usuario Repository Tests', () => {
  const usuarioRepo = new UsuarioRepository();

  test('Debe obtener todos los usuarios', async () => {
    const usuarios = await usuarioRepo.findAll();
    expect(usuarios).toBeDefined();
    expect(Array.isArray(usuarios)).toBe(true);
  });

  test('Debe obtener un usuario por email', async () => {
    const usuario = await usuarioRepo.findByEmail('admin@sazonpatrimonial.com');
    expect(usuario).toBeDefined();
    expect(usuario?.correo).toBe('admin@sazonpatrimonial.com');
  });
});
