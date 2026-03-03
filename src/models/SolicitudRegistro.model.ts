export interface ISolicitudRegistro {
  id_solicitud: number;
  fecha: Date;
  estado: string;
  nombre_propuesto_restaurante: string;
  correo: string;
  nombre_propietario: string;
  horario_atencion: string;
  id_restaurante: number;
  id_usuario: number;
}

export interface ICreateSolicitudRegistro {
  fecha: Date;
  estado: string;
  nombre_propuesto_restaurante: string;
  correo: string;
  nombre_propietario: string;
  horario_atencion: string;
  id_restaurante: number;
  id_usuario: number;
}

export interface IUpdateSolicitudRegistro {
  estado?: string;
  nombre_propuesto_restaurante?: string;
  correo?: string;
  nombre_propietario?: string;
  horario_atencion?: string;
}