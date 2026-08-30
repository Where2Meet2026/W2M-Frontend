const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, { method = "GET", body, headers = {} } = {}) {
    const token = localStorage.getItem("token");

    const finalHeaders = { ...headers };
    if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

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
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};