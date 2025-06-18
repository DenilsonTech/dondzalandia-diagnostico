import { API_BASE_URL } from "../lib/utils";

export type StudentLoginRequest = {
  codigo: string;
};

export type StudentLoginResponse = {
  user: {
    id: string;
    email: string;
    role: string;
  };
  aluno: {
    id: string;
    nome_completo: string;
    codigo: string;
  };
  access_token: string;
  token_type: string;
};

export async function loginStudent(data: StudentLoginRequest): Promise<StudentLoginResponse> {
  const response = await fetch(`${API_BASE_URL}login-aluno-codigo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Código de estudante inválido ou erro de conexão.");
  }

  return response.json();
} 