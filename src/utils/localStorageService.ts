import { ISSERVER } from "./is-server";

class LocalStorageService {
  setToken(token: string) {
    if (!ISSERVER) localStorage.setItem("token", token);
  }
  setAdminToken(token: string) {
    if (!ISSERVER) localStorage.setItem("admin", token);
  }
  getToken(): string | null {
    if (ISSERVER) return null;
    return localStorage.getItem("token");
  }
  getAdminToken(): string | null {
    if (ISSERVER) return null;
    return localStorage.getItem("admin");
  }
  removeToken() {
    if (!ISSERVER) localStorage.removeItem("token");
  }

  removeAdminToken() {
    if (!ISSERVER) localStorage.removeItem("admin");
  }
}

export const localStorageService = new LocalStorageService();
