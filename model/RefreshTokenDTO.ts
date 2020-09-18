export interface RefreshTokenDTO {
    token: string,
    device: string,
    isActive: boolean,
    userId: string
}