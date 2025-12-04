package httpx

import (
	"encoding/json"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	AccessTokenCookieName  = "access_token"
	RefreshTokenCookieName = "refresh_token"
)

func WriteJSON(w http.ResponseWriter, v any, status int) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}
	if _, err := w.Write(b); err != nil {
		return err
	}

	return nil
}

func ToJSON(r *http.Request, dest any) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(&dest)
}

func GetClientIP(r *http.Request) string {
	if ip := r.Header.Get("X-Forwarded-For"); ip != "" {
		return strings.TrimSpace(strings.Split(ip, ",")[0])
	}
	if ip := r.Header.Get("X-Real-IP"); ip != "" {
		return ip
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil {
		return host
	}
	return r.RemoteAddr
}

func isSecure() bool {
	return os.Getenv("APP_ENV") == "prod"
}

func baseCookie(name, value string, expires time.Time) *http.Cookie {
	return &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		Secure:   isSecure(),
		SameSite: http.SameSiteStrictMode,
		Expires:  expires,
	}
}

func SetAccessTokenCookie(
	w http.ResponseWriter,
	token string,
	expiresAt time.Time,
) {
	cookie := baseCookie(
		AccessTokenCookieName,
		token,
		expiresAt,
	)

	http.SetCookie(w, cookie)
}

func SetRefreshTokenCookie(
	w http.ResponseWriter,
	token string,
	expiresAt time.Time,
) {
	cookie := baseCookie(
		RefreshTokenCookieName,
		token,
		expiresAt,
	)

	http.SetCookie(w, cookie)
}

func ClearAuthCookies(w http.ResponseWriter) {
	expired := time.Unix(0, 0)

	http.SetCookie(w, &http.Cookie{
		Name:     AccessTokenCookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   isSecure(),
		Expires:  expired,
		MaxAge:   -1,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     RefreshTokenCookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   isSecure(),
		Expires:  expired,
		MaxAge:   -1,
	})
}
