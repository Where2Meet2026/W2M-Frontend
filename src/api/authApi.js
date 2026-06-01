const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "로그인에 실패했습니다.");
  }

  return await response.json();
};

export const signup = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "회원가입에 실패했습니다.");
  }

  return response.text();
};

export const socialSignup = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/social-signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "소셜 회원가입에 실패했습니다.");
  }

  return await response.json();
};

export const sendCode = async (email) => {
  const response = await fetch(`${BASE_URL}/api/v1/send-code?email=${encodeURIComponent(email)}`, {
    method: "POST",
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("이미 가입된 이메일입니다.");
    }
    throw new Error("인증코드 발송에 실패했습니다.");
  }
};

export const verifyCode = async (email, code) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/verify-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("인증 확인 중 오류가 발생했습니다.");
  }

  const isOk = await response.json();
  if (!isOk) {
    throw new Error("인증코드가 일치하지 않습니다.");
  }

  return isOk;
};

