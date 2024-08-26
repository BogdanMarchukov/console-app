export interface Arguments {
  login: string;
  password: string;
  action: string;
  args: string[];
}

export enum Actions {
  SIGN_UP = "sign-up",
  SIGN_IN = "sign-in",
  CREATE_CAR = "create-car",
  GET_CAR = "get-car",
  DELETE_CAR = "delete-car",
  UPDATE_CAR = "update-car",
}
