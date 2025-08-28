import { deleteCookie, getCookie } from "cookies-next";

export function getCookieclient() {
  const token = getCookie("fitscore-session");
  return token;
}
export function deleteCookieClient() {
  deleteCookie("fitscore-session");
}
