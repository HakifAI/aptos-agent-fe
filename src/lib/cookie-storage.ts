import { AuthType } from "@/types/user.type";

// Cookie utilities for auth token storage
export class CookieStorage {
  static setAuthToken(token: string, expiresAt: Date) {
    const expires = expiresAt.toUTCString();
    const isSecure = window.location.protocol === "https:";
    document.cookie = `auth_token=${token}; expires=${expires}; path=/; ${isSecure ? "secure;" : ""} samesite=strict`;
  }

  static setAuthAddress(address: string, expiresAt: Date) {
    const expires = expiresAt.toUTCString();
    const isSecure = window.location.protocol === "https:";
    document.cookie = `auth_address=${address}; expires=${expires}; path=/; ${isSecure ? "secure;" : ""} samesite=strict`;
  }

  static setAuthType(type: AuthType, expiresAt: Date) {
    const expires = expiresAt.toUTCString();
    const isSecure = window.location.protocol === "https:";
    document.cookie = `auth_type=${type}; expires=${expires}; path=/; ${isSecure ? "secure;" : ""} samesite=strict`;
  }

  static getAuthType(): AuthType | null {
    return this.getCookie("auth_type") as AuthType | null;
  }

  static getAuthToken(): string | null {
    return this.getCookie("auth_token");
  }

  static getAuthAddress(): string | null {
    return this.getCookie("auth_address");
  }

  static clearAuth() {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "auth_address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "auth_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  private static getCookie(name: string): string | null {

    if (typeof document === "undefined") return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trimStart();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return null;
  }

  static isTokenValid(): boolean {
    const token = this.getAuthToken();
    const address = this.getAuthAddress();
    const authType = this.getAuthType()
    return !!((authType === "twitter" && token) || (token && address));
  }
}
