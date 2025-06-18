import { API_BASE_URL } from "../lib/utils";
import Cookies from "js-cookie";

export interface Class {
    id: string;
    name: string; // Ex: "1ª Classe"
}

export interface BaseDiscipline {
    id: string;
    nome: string; // Ex: "Matemática"
}

export interface Discipline {
    id: string;
    classe_id: string;
    disciplina_base_id: string;
    descricao?: string;
    classe: Class;
    disciplina_base: BaseDiscipline;
    updated_at: string;
}

export interface CreateDisciplineRequest {
    classe_id: string;
    disciplina_base_id: string;
    description?: string;
}

// Função para buscar todas as disciplinas
export async function getDisciplines(): Promise<Discipline[]> {
    const token = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}disciplinas`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Erro ao buscar disciplinas.");
    }
    const data = await response.json();
    // Verifica se a resposta contém uma propriedade 'data' que é um array
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
        return data.data;
    }
    return data; // Retorna os dados diretamente se não estiverem aninhados
}

// Função para buscar todas as classes
export async function getClasses(): Promise<Class[]> {
    const token = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}classes`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Erro ao buscar classes.");
    }
    const data = await response.json();
    // Verifica se a resposta contém uma propriedade 'data' que é um array
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
        return data.data;
    }
    return data; // Retorna os dados diretamente se não estiverem aninhados
}

// Função para buscar todas as disciplinas base
export async function getBaseDisciplines(): Promise<BaseDiscipline[]> {
    const token = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}disciplinas-base`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Erro ao buscar disciplinas base.");
    }
    const data = await response.json();
    // Verifica se a resposta contém uma propriedade 'data' que é um array
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
        return data.data;
    }
    return data; // Retorna os dados diretamente se não estiverem aninhados
}

// Função para criar uma nova disciplina
export async function createDiscipline(data: CreateDisciplineRequest): Promise<Discipline> {
    const token = Cookies.get('access_token');
    console.log('Sending data to create discipline:', data);
    const response = await fetch(`${API_BASE_URL}disciplinas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar disciplina.");
    }
    return response.json();
}

// Função para editar uma disciplina existente
export async function editDiscipline(id: string, data: CreateDisciplineRequest): Promise<Discipline> {
    const token = Cookies.get('access_token');
    console.log(`Sending data to edit discipline ${id}:`, data); // Adicionando console.log aqui
    const response = await fetch(`${API_BASE_URL}disciplinas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao editar disciplina.");
    }
    return response.json();
} 