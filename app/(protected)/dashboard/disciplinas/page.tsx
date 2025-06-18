"use client";

import React from 'react';
import DisciplineList from '@/components/disciplines/DisciplineList';

export default function DisciplinasPage() {
    return (
        <div className="flex flex-col items-center justify-center p-6 w-full">
            <DisciplineList />
        </div>
    );
}