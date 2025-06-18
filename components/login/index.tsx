"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { Input } from "../ui/input"
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card"
import { Hash } from "lucide-react"
import { Label } from "../ui/label"
import StudentForm from "./studentForm"
import TeacherForm from "./TeacherForm"
import InstallPWAButton from "../InstallPWAButton"

export default function LoginPage() {
    const [profile, setProfile] = useState<"student" | "teacher">("student")

    return (
        <div className="min-h-screen">
            <main className="relative w-full h-screen bg-white/80 backdrop-blur-sm overflow-hidden">
                <Image
                    src="/images/Home.png"
                    alt="Estudantes usando tablets na sala de aula em Moçambique"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-6 left-6 z-20">
                    <Image
                        src="/images/Logo.png"
                        alt="Dondzalandia Logo"
                        width={200}
                        height={60}
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-full max-w-md p-8 flex flex-col items-center">
                        <Tabs
                            value={profile}
                            onValueChange={(value) => setProfile(value as "student" | "teacher")}
                            className="w-full flex flex-col items-center mb-6"
                        >
                            <TabsList className="flex justify-center gap-4 mb-6 bg-transparent p-0">
                                <TabsTrigger
                                    value="student"
                                    className={`px-8 py-3 text-lg font-bold transition-all duration-300 transform hover:scale-105 ${profile === "student"
                                        ? "bg-yellow-400 text-gray-800 shadow-lg"
                                        : "bg-black/20 backdrop-blur-sm text-white hover:bg-yellow-400 border border-yellow-400/30"
                                        }`}
                                >
                                    Sou Estudante
                                </TabsTrigger>
                                <TabsTrigger
                                    value="teacher"
                                    className={`px-8 py-3 text-lg font-bold transition-all duration-300 transform hover:scale-105 ${profile === "teacher"
                                        ? "bg-yellow-400 text-gray-800 shadow-lg"
                                        : "bg-black/20 backdrop-blur-sm text-white hover:bg-yellow-400 border border-yellow-400"
                                        }`}
                                >
                                    Sou Professor
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="student" className="flex justify-center items-center w-full">
                                <StudentForm />
                            </TabsContent>
                            <TabsContent value="teacher">
                                <TeacherForm />
                            </TabsContent>
                        </Tabs>

                        <InstallPWAButton />
                    </div>
                </div>
            </main>
        </div>
    )
}
