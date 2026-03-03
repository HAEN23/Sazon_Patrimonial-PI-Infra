export interface IUsuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  contrasena: string;
  id_rol: number;
  foto_evidencia: string | null;
}

export interface ICreateUsuario {
  nombre: string;
  correo: string;
  contrasena: string;
  id_rol: number;
  foto_evidencia?: string | null;
}

export interface IUpdateUsuario {
  nombre?: string;
  correo?: string;
  contrasena?: string;
  id_rol?: number;
  foto_evidencia?: string | null;
}