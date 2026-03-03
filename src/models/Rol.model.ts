export interface IRol {
  id_rol: number;
  nombre_rol: string;
}

export interface ICreateRol {
  nombre_rol: string;
}

export interface IUpdateRol {
  nombre_rol?: string;
}