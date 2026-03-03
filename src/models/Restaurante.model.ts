export interface IRestaurante {
  id_restaurante: number;
  nombre: string;
  horario: string;
  telefono: string;
  etiquetas: string;
  id_solicitud: number;
  id_usuario: number;
  direccion: string;
  link_direccion: string;
  facebook: string;
  instagram: string;
  zona: string;
  horario_atencion: string;
  foto_portada: string;
}

export interface ICreateRestaurante {
  nombre: string;
  horario: string;
  telefono: string;
  etiquetas: string;
  id_solicitud: number;
  id_usuario: number;
  direccion: string;
  link_direccion: string;
  facebook: string;
  instagram: string;
  zona: string;
  horario_atencion: string;
  foto_portada: string;
}

export interface IUpdateRestaurante {
  nombre?: string;
  horario?: string;
  telefono?: string;
  etiquetas?: string;
  direccion?: string;
  link_direccion?: string;
  facebook?: string;
  instagram?: string;
  zona?: string;
  horario_atencion?: string;
  foto_portada?: string;
}