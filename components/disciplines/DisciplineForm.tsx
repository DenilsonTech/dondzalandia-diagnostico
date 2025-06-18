"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    getClasses,
    getBaseDisciplines,
    createDiscipline,
    editDiscipline,
    Class,
    BaseDiscipline,
    Discipline,
} from '../../services/DisciplineService';

interface DisciplineFormProps {
    onDisciplineCreated: () => void;
    onCancel: () => void;
    setOpen: (open: boolean) => void;
    initialData?: Discipline | null;
}

const DisciplineForm: React.FC<DisciplineFormProps> = ({
    onDisciplineCreated,
    onCancel,
    setOpen,
    initialData,
}) => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [baseDisciplines, setBaseDisciplines] = useState<BaseDiscipline[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedBaseDisciplineId, setSelectedBaseDisciplineId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [fetchedClasses, fetchedBaseDisciplines] = await Promise.all([
                    getClasses(),
                    getBaseDisciplines(),
                ]);
                console.log('Fetched classes:', fetchedClasses);
                console.log('Fetched base disciplines:', fetchedBaseDisciplines);
                setClasses(fetchedClasses);
                setBaseDisciplines(fetchedBaseDisciplines);
            } catch (err: any) {
                setFetchError(err.message || 'Erro ao carregar dados.');
            } finally {
                setFetchLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (initialData) {
            setSelectedClassId(initialData.classe_id);
            setSelectedBaseDisciplineId(initialData.disciplina_base_id);
            setDescription(initialData.descricao || '');
        } else {
            setSelectedClassId('');
            setSelectedBaseDisciplineId('');
            setDescription('');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedClassId || !selectedBaseDisciplineId) {
            setError('Por favor, selecione a classe e a disciplina base.');
            setLoading(false);
            return;
        }

        try {
            const disciplineData = {
                classe_id: selectedClassId,
                disciplina_base_id: selectedBaseDisciplineId,
                description: description || undefined,
            };

            if (initialData) {
                await editDiscipline(initialData.id, disciplineData);
                console.log('Disciplina atualizada com sucesso!');
            } else {
                await createDiscipline(disciplineData);
                console.log('Disciplina criada com sucesso!');
            }

            if (onDisciplineCreated) {
                onDisciplineCreated();
            }
            setOpen(false);
        } catch (err: any) {
            setError(err.message || (initialData ? 'Erro ao editar disciplina.' : 'Erro ao criar disciplina.'));
        } finally {
            setLoading(false);
        }
    };

    if (fetchError) {
        return <div className="text-red-500">Erro: {fetchError}</div>;
    }

    const dialogTitle = initialData ? 'Editar Disciplina' : 'Criar Nova Disciplina';
    const dialogDescription = initialData ? 'Edite os campos da disciplina existente.' : 'Preencha os campos para adicionar uma nova disciplina.';
    const submitButtonText = initialData ? (loading ? 'Salvando...' : 'Salvar Alterações') : (loading ? 'Criando...' : 'Criar Disciplina');

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription>
                    {dialogDescription}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="class-select">Classe</Label>
                    <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                        <SelectTrigger id="class-select" className="w-full">
                            <SelectValue placeholder="Selecione a classe" />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="discipline-base-select">Disciplina Base</Label>
                    <Select onValueChange={setSelectedBaseDisciplineId} value={selectedBaseDisciplineId}>
                        <SelectTrigger id="discipline-base-select" className="w-full">
                            <SelectValue placeholder="Selecione a disciplina base" />
                        </SelectTrigger>
                        <SelectContent>
                            {baseDisciplines.map((bd) => (
                                <SelectItem key={bd.id} value={bd.id}>
                                    {bd.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descrição (Opcional)</Label>
                    <Input
                        id="description"
                        type="text"
                        placeholder="Ex: Português versão 2025"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full"
                    />
                </div>

                {error && <div className=" text-red-500 text-sm text-center">{error}</div>}
            </form>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" onClick={handleSubmit} disabled={loading}>
                    {submitButtonText}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default DisciplineForm; 