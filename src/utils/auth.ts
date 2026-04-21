const ACCESS_TOKEN_COOKIE = 'accessToken';
const RESET_PASSWORD_TOKEN_COOKIE = 'resetPasswordToken';
const AUTH_EMAIL_COOKIE = 'authEmail';

function isBrowser() {
    return typeof document !== 'undefined';
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
    if (!isBrowser()) return;

    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function getCookie(name: string) {
    if (!isBrowser()) return undefined;

    const encodedName = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie.split('; ').find((item) => item.startsWith(encodedName));
    if (!cookie) return undefined;

    return decodeURIComponent(cookie.slice(encodedName.length));
}

function deleteCookie(name: string) {
    if (!isBrowser()) return;
    document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function saveAccessToken(token: string) {
    setCookie(ACCESS_TOKEN_COOKIE, token, 60 * 60 * 24 * 30);
}

export function getAccessToken() {
    return getCookie(ACCESS_TOKEN_COOKIE);
}

export function clearAccessToken() {
    deleteCookie(ACCESS_TOKEN_COOKIE);
}

export function saveResetPasswordToken(token: string) {
    setCookie(RESET_PASSWORD_TOKEN_COOKIE, token, 60 * 10);
}

export function getResetPasswordToken() {
    return getCookie(RESET_PASSWORD_TOKEN_COOKIE);
}

export function clearResetPasswordToken() {
    deleteCookie(RESET_PASSWORD_TOKEN_COOKIE);
}

export function saveAuthEmail(email: string) {
    setCookie(AUTH_EMAIL_COOKIE, email, 60 * 10);
}

export function getAuthEmail() {
    return getCookie(AUTH_EMAIL_COOKIE);
}

export function clearAuthEmail() {
    deleteCookie(AUTH_EMAIL_COOKIE);
}

export function clearAllAuthCookies() {
    clearAccessToken();
    clearResetPasswordToken();
    clearAuthEmail();
}