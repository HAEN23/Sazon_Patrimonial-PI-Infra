export interface IFavoritos {
  id_favorito: number;
  id_usuario: number;
  id_restaurante: number;
  fecha_favorito: Date;
}

export interface ICreateFavoritos {
  id_usuario: number;
  id_restaurante: number;
  fecha_favorito: Date;
}