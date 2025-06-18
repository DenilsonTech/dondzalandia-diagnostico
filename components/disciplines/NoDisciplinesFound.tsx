import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface NoDisciplinesFoundProps {
    onCreateNew: () => void;
}

const NoDisciplinesFound: React.FC<NoDisciplinesFoundProps> = ({ onCreateNew }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg  max-w-sm mx-auto text-center">
            <Image
                src="/images/NoFile.png" // Caminho para a imagem fornecida
                alt="Nenhuma disciplina encontrada"
                width={200}
                height={200}
                className="mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma Disciplina Criada</h2>
            <p className="text-gray-600 mb-6">
                Parece que ainda não há disciplinas cadastradas. Crie a primeira agora!
            </p>
            <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                Criar Nova Disciplina
            </Button>
        </div>
    );
};

export default NoDisciplinesFound; 