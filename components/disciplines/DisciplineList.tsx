"use client";

import React, { useState, useEffect } from 'react';
import { getDisciplines, Discipline, editDiscipline } from '../../services/DisciplineService';
import NoDisciplinesFound from './NoDisciplinesFound';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import DisciplineForm from './DisciplineForm';
import { Edit3, BookOpen, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DisciplineList: React.FC = () => {
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);

    const fetchDisciplines = async () => {
        try {
            setLoading(true);
            const fetchedDisciplines = await getDisciplines();
            setDisciplines(fetchedDisciplines);
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar disciplinas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisciplines();
    }, []);

    const handleFormSubmissionSuccess = () => {
        setIsModalOpen(false);
        setEditingDiscipline(null);
        fetchDisciplines();
    };

    const handleEditClick = (discipline: Discipline) => {
        setEditingDiscipline(discipline);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="text-gray-700">Carregando disciplinas...</div>;
    }

    if (error) {
        return <div className="text-red-500">Erro: {error}</div>;
    }

    const getGradientStyle = (baseDisciplineName: string) => {
        switch (baseDisciplineName) {
            case 'Matemática':
                return { background: 'linear-gradient(to right, #61DAFB, #1D91EF)' }; // Azul/Ciano
            case 'Língua Portuguesa':
                return { background: 'linear-gradient(to right, #FFC0CB, #FF69B4)' }; // Rosa/Magenta
            case 'Língua Inglesa':
                return { background: 'linear-gradient(to right, #98FB98, #008000)' }; // Verde/Verde Escuro
            case 'Língua Moçambicana':
                return { background: 'linear-gradient(to right, #DA70D6, #8A2BE2)' }; // Roxo/Violeta
            case 'Ciências Naturais':
                return { background: 'linear-gradient(to right, #ADD8E6, #87CEEB)' }; // Azul Claro/Céu
            case 'Física':
                return { background: 'linear-gradient(to right, #FF4500, #DC143C)' }; // Laranja/Vermelho Intenso
            case 'Química':
                return { background: 'linear-gradient(to right, #20B2AA, #008B8B)' }; // Verde-azulado/Ciano Escuro
            case 'Biologia':
                return { background: 'linear-gradient(to right, #32CD32, #228B22)' }; // Verde Limão/Verde Floresta
            case 'Ciências Sociais':
                return { background: 'linear-gradient(to right, #F4A460, #CD853F)' }; // Marrom/Dourado Queimado
            case 'História':
                return { background: 'linear-gradient(to right, #FFD700, #FFA500)' }; // Dourado/Laranja
            case 'Geografia':
                return { background: 'linear-gradient(to right, #87CEEB, #4682B4)' }; // Azul Claro/Azul Aço
            case 'Educação Moral e Cívica':
                return { background: 'linear-gradient(to right, #9ACD32, #6B8E23)' }; // Verde Amarelado/Verde Oliva
            case 'Formação Moral e Cívica':
                return { background: 'linear-gradient(to right, #8FBC8F, #3CB371)' }; // Verde Mar/Verde Médio
            case 'Educação Física':
                return { background: 'linear-gradient(to right, #FF6347, #FF4500)' }; // Tomate/Laranja Avermelhado
            case 'Educação Musical':
                return { background: 'linear-gradient(to right, #EE82EE, #DA70D6)' }; // Violeta/Orquídea
            case 'Educação Visual':
                return { background: 'linear-gradient(to right, #F0E68C, #DAA520)' }; // Cáqui/Dourado Escuro
            case 'Ofícios':
                return { background: 'linear-gradient(to right, #D2B48C, #BC8F8F)' }; // Bronzeado/Rosado Marrom
            case 'Desenho de Geometria Descritiva':
                return { background: 'linear-gradient(to right, #778899, #2F4F4F)' }; // Cinza Claro/Cinza Escuro
            case 'Tecnologias de Informação e Comunicação (TIC)':
                return { background: 'linear-gradient(to right, #4169E1, #191970)' }; // Azul Royal/Meia-noite
            case 'Filosofia':
                return { background: 'linear-gradient(to right, #6A5ACD, #483D8B)' }; // Azul Ardósia/Azul Ardósia Escuro
            case 'Psicopedagogia':
                return { background: 'linear-gradient(to right, #E0BBE4, #957DAD)' }; // Lavanda/Roxo Claro
            case 'Empreendedorismo':
                return { background: 'linear-gradient(to right, #FFD700, #B8860B)' }; // Ouro/Dourado Escuro
            case 'Agropecuária':
                return { background: 'linear-gradient(to right, #8B4513, #A0522D)' }; // Marrom Sela/Siena
            default:
                return { background: 'linear-gradient(to right, #A9A9A9, #808080)' }; // Cinza padrão
        }
    };

    const getDisciplineIcon = (baseDisciplineName: string) => {
        switch (baseDisciplineName) {
            case 'Matemática':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Língua Portuguesa':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Língua Inglesa':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Língua Moçambicana':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Ciências Naturais':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Física':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Química':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Biologia':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Ciências Sociais':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'História':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Geografia':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Educação Moral e Cívica':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Formação Moral e Cívica':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Educação Física':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Educação Musical':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Educação Visual':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Ofícios':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Desenho de Geometria Descritiva':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Tecnologias de Informação e Comunicação (TIC)':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Filosofia':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Psicopedagogia':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Empreendedorismo':
                return <BookOpen size={24} className="text-emerald-600" />;
            case 'Agropecuária':
                return <BookOpen size={24} className="text-emerald-600" />;
            default:
                return null;
        }
    };

    const splitDisciplineName = (name: string) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            return {
                firstLine: parts[0].toUpperCase(),
                secondLine: parts.slice(1).join(' ').toUpperCase(),
            };
        }
        return { firstLine: name.toUpperCase(), secondLine: '' };
    };

    return (
        <div className="w-full">
            {disciplines.length !== 0 && (
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Disciplinas Existentes</h1>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                                Criar Nova Disciplina
                            </Button>
                        </DialogTrigger>
                        <DisciplineForm onDisciplineCreated={handleFormSubmissionSuccess} onCancel={() => setIsModalOpen(false)} setOpen={setIsModalOpen} initialData={editingDiscipline} />
                    </Dialog>
                </div>
            )}

            {disciplines.length === 0 ? (
                <NoDisciplinesFound onCreateNew={() => setIsModalOpen(true)} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {disciplines.map((discipline) => {
                        const { firstLine, secondLine } = splitDisciplineName(discipline.disciplina_base.nome || '');
                        return (
                            <div key={discipline.id} className="w-80  mx-auto p-4 flex-shrink-0">
                                {/* Book Container */}
                                <div className="relative w-full h-full">
                                    {/* Book Shadow */}
                                    <div className="absolute inset-0 bg-gray-800 rounded-r-lg transform translate-x-1 translate-y-1 opacity-20"></div>

                                    {/* Main Book */}
                                    <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden" style={getGradientStyle(discipline.disciplina_base.nome || '')}>
                                        {/* Book Spine Lines */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black opacity-20"></div>
                                        <div className="absolute left-2 top-0 bottom-0 w-px bg-white opacity-30"></div>

                                        {/* Book Cover */}
                                        <div className="relative p-6 pb-4">
                                            {/* Grade Badge */}
                                            <Badge className="absolute top-4 right-4 bg-white text-emerald-700 hover:bg-gray-50 font-semibold">
                                                <GraduationCap className="w-3 h-3 mr-1" />
                                                {discipline.classe.name}
                                            </Badge>

                                            {/* Book Icon and Title Area */}
                                            <div className="flex flex-col items-center text-center mt-8 mb-6">
                                                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                                    {getDisciplineIcon(discipline.disciplina_base.nome || '')}
                                                </div>

                                                {/* Book Title on Cover */}
                                                <h1 className="text-white font-bold text-xl mb-2 drop-shadow-lg">{firstLine}</h1>
                                                {secondLine && <h2 className="text-white font-bold text-2xl drop-shadow-lg">{secondLine}</h2>}

                                                {/* Decorative Line */}
                                                <div className="w-16 h-px bg-white/60 mt-3"></div>
                                            </div>
                                        </div>

                                        {/* Book Pages Effect */}
                                        <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-white/40"></div>

                                        {/* Edit Button at bottom-left */} 
                                        <Button
                                            onClick={() => handleEditClick(discipline)}
                                            className="absolute bottom-4 left-4 bg-transparent hover:bg-white/50 text-white font-medium py-1 px-3 rounded-lg"
                                        >
                                            <Edit3 className="w-4 h-4 mr-1" />
                                        </Button>
                                    </div>

                                    {/* Book Pages */}
                                    <div className="absolute -right-1 top-1 bottom-1 w-2 bg-gray-100 rounded-r-sm shadow-inner">
                                        <div className="w-full h-full bg-gradient-to-r from-gray-200 to-white rounded-r-sm"></div>
                                    </div>
                                    <div className="absolute -right-2 top-2 bottom-2 w-1 bg-gray-200 rounded-r-sm shadow-inner opacity-60"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DisciplineForm onDisciplineCreated={handleFormSubmissionSuccess} onCancel={() => setIsModalOpen(false)} setOpen={setIsModalOpen} initialData={editingDiscipline} />
            </Dialog>
        </div>
    );
};

export default DisciplineList; 