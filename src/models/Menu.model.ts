export interface IMenu {
  id_menu: number;
  ruta_archivo: string;
  id_restaurante: number;
  id_usuario: number;
  contador_descargas: number;
}

export interface ICreateMenu {
  ruta_archivo: string;
  id_restaurante: number;
  id_usuario: number;
  contador_descargas?: number;
}

export interface IUpdateMenu {
  ruta_archivo?: string;
  contador_descargas?: number;
}