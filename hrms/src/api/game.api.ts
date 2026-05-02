import axiosInstance from "./axiosInstance";

export interface GameResponse {
  id: number;
  gameName: string;
}

export interface GameRequest {
  gameName: string;
}

export const getAllGames = async (): Promise<GameResponse[]> => {
  const res = await axiosInstance.get("/game");
  return res.data;
};

export const createGame = async (
  data: GameRequest
): Promise<GameResponse> => {
  const res = await axiosInstance.post("/game", data);
  return res.data;
};

export const updateGame = async (
  id: number,
  data: GameRequest
): Promise<GameResponse> => {
  const res = await axiosInstance.put(`/game/${id}`, data);
  return res.data;
};

export const deleteGame = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/game/${id}`);
};