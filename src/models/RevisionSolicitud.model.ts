export interface IRevisionSolicitud {
  id_revision: number;
  fecha: string;
  id_solicitud: number;
  id_usuario: number;
}

export interface ICreateRevisionSolicitud {
  fecha: string;
  id_solicitud: number;
  id_usuario: number;
}