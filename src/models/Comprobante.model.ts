export interface IComprobante {
  id_comprobante: string;
  tipo: string;
  ruta_archivo: string;
  fecha_subida: Date;
  id_restaurante: number;
  id_solicitud: number;
  id_usuario: number;
}

export interface ICreateComprobante {
  id_comprobante: string;
  tipo: string;
  ruta_archivo: string;
  fecha_subida: Date;
  id_restaurante: number;
  id_solicitud: number;
  id_usuario: number;
}