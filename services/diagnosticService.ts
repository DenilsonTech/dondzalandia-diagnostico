import { API_BASE_URL } from "@/lib/utils";
import Cookies from "js-cookie";

export interface Opcao {
    texto_opcao: string;
    correta: boolean;
}

export interface Exercicio {
    id: string;
    jogabilidade: "MULTIPLA_ESCOLHA" | "VERDADEIRO_FALSO";
    enunciado: string;
    opcoes: Opcao[];
    resposta_verdadeiro_falso?: boolean; // Optional for true/false questions
}

export interface Competencia {
    id: string;
    nome: string;
    descricao: string;
    exercicios: Exercicio[];
}

export interface CreateDiagnosticTestRequest {
    titulo: string;
    descricao: string;
    classe_id: string;
    disciplina_id: string;
    criado_por: string; // ID do professor
    competencias: Competencia[]; // Usar Competencia (com id)
}

export interface DiagnosticTest {
    id: string;
    titulo: string;
    descricao: string;
    classe_id: string;
    nome_classe: string | null;
    disciplina_id: string;
    nome_disciplina: string | null;
    criado_por_id: string;
    criado_por_email: string;
    status: "Ativo" | "Rascunho";
    data_criacao: string; // Updated from criado_em
    numero_competencias: number; // New field
    numero_exercicios: number; // New field
    competencias: Competencia[]; // Usar Competencia (com id)
}

export interface GetDiagnosticTestsResponse {
    data: DiagnosticTest[];
}

export async function createDiagnosticTest(data: CreateDiagnosticTestRequest): Promise<DiagnosticTest> {
    const token = Cookies.get("access_token")
    const response = await fetch(`${API_BASE_URL}testes_diagnosticos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar teste diagnóstico.");
    }

    return response.json();
}

export async function getDiagnosticTests(): Promise<GetDiagnosticTestsResponse> {
    const token = Cookies.get("access_token")
    const response = await fetch(`${API_BASE_URL}testes_diagnosticos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar testes diagnósticos.");
    }

    return response.json();
}

export async function getDiagnosticTestsByClass(classeId: string): Promise<GetDiagnosticTestsResponse> {
    const token = Cookies.get("access_token");
    const response = await fetch(`${API_BASE_URL}testes_diagnosticos?classe_id=${classeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar testes diagnósticos por classe.");
    }

    return response.json();
}

export async function getDiagnosticTestById(id: string): Promise<DiagnosticTest> {
    const token = Cookies.get("access_token");
    const response = await fetch(`${API_BASE_URL}testes_diagnosticos/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar teste diagnóstico.");
    }

    return response.json();
}

export async function updateDiagnosticTest(id: string, data: CreateDiagnosticTestRequest): Promise<DiagnosticTest> {
    const token = Cookies.get("access_token");
    const response = await fetch(`${API_BASE_URL}testes_diagnosticos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar teste diagnóstico.");
    }

    return response.json();
}

export interface RespostaExercicio {
    exercicio_id: string;
    resposta: string | boolean | undefined;
}

export interface SubmitTestResponseRequest {
    aluno_id: string;
    teste_id: string;
    respostas: RespostaExercicio[];
}

export interface SubmitTestResponse {
    valor_total: number;
    // Add other fields from the response if necessary
}

export interface DiagnosticTestResult {
    aluno_id: string;
    teste_id: string;
    valor_total: number;
    respostas_corretas: number;
    total_exercicios: number;
    data_submissao: string;
    detalhes_respostas: Array<{
        exercicio_id: string;
        resposta_aluno: string | boolean | null;
        resposta_correta: string | boolean;
        correta: boolean;
    }>;
}

export async function submitDiagnosticTestAnswers(data: SubmitTestResponseRequest): Promise<SubmitTestResponse> {
    const token = Cookies.get("access_token");
    const response = await fetch(`${API_BASE_URL}responder`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao submeter respostas do teste.");
    }

    return response.json();
}

export async function getDiagnosticTestResult(testId: string, alunoId: string): Promise<DiagnosticTestResult> {
    const token = Cookies.get("access_token");
    const response = await fetch(`${API_BASE_URL}resultados/${testId}/${alunoId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar resultado do teste.");
    }

    return response.json();
} 