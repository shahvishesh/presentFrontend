import axiosInstance from "./axiosInstance";

export type SlotResponse = {
    slotId: number;
    date: string;
    startTime: string;
    endTime: string;
    maxPlayers: number;
    gameName: string;
}

export const getSlots = async (gameId: number): Promise<SlotResponse[]> => {
    const res = await axiosInstance.get<SlotResponse[]>(`/slot/game/${gameId}`);
    return res.data;
}

export const getSlotDetail = async (slotId: number): Promise<SlotResponse> => {
    const res = await axiosInstance.get<SlotResponse>(`/slot/${slotId}`);
    return res.data;
}

export const deleteSlotConfiguration = async (slotId: number) => {
    await axiosInstance.delete(`/slot/${slotId}`);
}

export type RegisterSlot = {
    employeeIds : number[];
}

export const registerSlot = async (slotId: number, data: RegisterSlot) => {
    await axiosInstance.post(`/slot/register/${slotId}`, data);
}

export type GameTypeResponse = {
    id: number;
    gameName: number;
}

export const getGameType = async(): Promise<GameTypeResponse[]> => {
    const res = await axiosInstance.get<GameTypeResponse[]>("/game");
    return res.data;
}

export type UpdateGameInterest = {
    gameIds : number[];
}

export const updateGameInterest = async(data: UpdateGameInterest) => {
    await axiosInstance.put("/game-interest", data);
}


export type GameInterestResponse = {
    gameId: number;
    gameName: number;
}

export const getGameInterest = async(): Promise<GameInterestResponse[]> => {
    const res = await axiosInstance.get<GameInterestResponse[]>("/game-interest");
    return res.data;
}

//config api

export type CreateGameConfig = {
    startTime: string | undefined;
    endTime: string | undefined;
    maxPlayers: number;
    slotDuration: number;
    gameId: number;
}

export const createGameConfiguration = async (data: CreateGameConfig) => {
    await axiosInstance.post("/configure/create", data);

}

export type UpdateGameConfig = {
    startTime: string | undefined;
    endTime: string | undefined;
    maxPlayers: number;
    slotDuration: number;
}
export const updateGameConfiguration = async (configId: number, data: UpdateGameConfig) => {
    await axiosInstance.patch(`/configure/update/${configId}`, data);

}


export type GameConfigResponse = {
    id: number;
    startTime: string;
    endTime: string;
    maxPlayers: number;
    slotDuration: number;
    gameName: string;
}
export const getGameConfiguration = async (): Promise<GameConfigResponse[]> => {
    const res = await axiosInstance.get<GameConfigResponse[]>(`/configure`);
    return res.data;
}

export const getGameConfigurationById = async (configId: number): Promise<GameConfigResponse> => {
    const res = await axiosInstance.get<GameConfigResponse>(`/configure/${configId}`);
    return res.data;
}


export type SlotRegistrationResponse= {
    slotRegistrationId: number;
    slotId: number;
    date: string;
    startTime: string;
    endTime: string;
    maxPlayers: number;
    gameName: string;
}

export const getActiveSlotRegistrations = async (gameId: number): Promise<SlotRegistrationResponse[]> => {
    const res = await axiosInstance.get<SlotRegistrationResponse[]>(`/slot/${gameId}/registrations`);
    return res.data;
}

export const cancelRegistrationOrBooking = async (slotId: number) => {
    await axiosInstance.patch(`/slot/cancel/${slotId}`);
}


export const getUpcomingBooking = async(): Promise<SlotResponse[]> => {
    const res = await axiosInstance.get<SlotResponse[]>(`/booking/upcoming`);
    return res.data;
}

export const getCancelledgBooking = async(): Promise<SlotResponse[]> => {
    const res = await axiosInstance.get<SlotResponse[]>(`/booking/cancelled`);
    return res.data;
}

export const getCompletedBooking = async(): Promise<SlotResponse[]> => {
    const res = await axiosInstance.get<SlotResponse[]>(`/booking/completed`);
    return res.data;
}

export type GameTabType = {
    label: string;
    value: number;
}

export const getGameTabs = async(): Promise<GameTabType[]> => {
    const res = await axiosInstance.get<GameTabType[]>(`/game-interest/tabs`);
    return res.data;
}
// private Long slotRegistrationId;
//     private Long slotId;
//     private LocalDate date;
//     private LocalTime startTime;
//     private LocalTime endTime;
//     private Integer maxPlayers;
//     private String gameName;