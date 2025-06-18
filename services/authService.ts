import { API_BASE_URL } from "@/lib/utils";

export type MeResponse = {
    user: {
        id: string;
        email: string;
        role: string;
        alunoId: string;
        nome_completo: string;
        data_nascimento: string;
        sexo: string;
        telefone: string;
        endereco: string;
        codigo: string;
        idade: number;
        classe: {
            id: string;
            name: string;
        };
        turma: {
            id: string;
            name: string | null;
        };
    };
};

export async function getMeData(): Promise<MeResponse> {
    const accessToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];

    if (!accessToken) {
        throw new Error("Access token não encontrado nos cookies.");
    }

    const response = await fetch(`${API_BASE_URL}me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário.");
    }

    return response.json();
} 