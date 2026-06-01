// 1. DTO para requisição de atualização de aparência (wallpaper e avatar)
package com.pomodoro.dto;

public class AparenciaRequest {

  // 2. Caminho ou base64 do wallpaper
  private String wallpaper;
  // 3. Caminho ou base64 do avatar
  private String avatar;

  public String getWallpaper() { return wallpaper; }
  public void setWallpaper(String wallpaper) { this.wallpaper = wallpaper; }
  public String getAvatar() { return avatar; }
  public void setAvatar(String avatar) { this.avatar = avatar; }
}
