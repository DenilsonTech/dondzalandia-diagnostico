import { API_BASE_URL } from "../lib/utils";

export type TeacherLoginRequest = {
  email: string;
  password: string;
};

export type TeacherLoginResponse = {
  user: {
    email: string;
    role: string;
    id: string;
  };
  access_token: string;
  token_type: string;
};

export async function loginTeacher(data: TeacherLoginRequest): Promise<TeacherLoginResponse> {
  const response = await fetch(`${API_BASE_URL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao fazer login");
  }

  return response.json();
} 