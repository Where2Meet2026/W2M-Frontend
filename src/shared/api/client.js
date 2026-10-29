const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 로그인 없이 볼 수 있는 화면에서는 만료 처리로 이동시키지 않는다.
const PUBLIC_PATHS = ["/", "/signup", "/kakao-callback"];
let isHandlingExpiry = false;

// 토큰이 만료됐거나 유효하지 않으면 토큰을 지우고, 로그인 후 돌아올 주소를 저장한 뒤 로그인 화면으로 보낸다.
function handleSessionExpired() {
    if (isHandlingExpiry) return;

    localStorage.removeItem("token");

    const { pathname, search } = window.location;
    if (pathname === "/") return; // 이미 로그인 화면
    isHandlingExpiry = true;
    if (!PUBLIC_PATHS.includes(pathname) && !pathname.startsWith("/invite/login")) {
        localStorage.setItem("returnUrl", pathname + search);
    }
    window.location.replace("/");
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
    const token = localStorage.getItem("token");

    const finalHeaders = { ...headers };
    if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        // 서버는 인증이 없으면 401이 아니라 카카오 로그인 화면으로 302 리다이렉트한다.
        // 그대로 따라가면 CORS 오류("Failed to fetch")로만 보이므로 직접 감지한다.
        redirect: "manual",
    });

    if (response.type === "opaqueredirect" || (token && response.status === 401)) {
        handleSessionExpired();
        const error = new Error("로그인이 만료되었어요. 다시 로그인해주세요.");
        error.status = 401;
        throw error;
    }

    const contentType = response.headers.get("content-type") || "";
    const parseBody = () =>
        contentType.includes("application/json") ? response.json() : response.text();

    if (!response.ok) {
        const errorBody = await parseBody().catch(() => null);
        const message =
        (errorBody && errorBody.message) ||
        (typeof errorBody === "string" && errorBody) ||
        `요청 실패 (${response.status})`;
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    if (response.status === 204) return null;
    return await parseBody().catch(() => null);
}

export const apiClient = {
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) => request(path, { ...options, method: "POST", body }),
    patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
    delete: (path, body, options) => request(path, { ...options, method: "DELETE", body }),
};
