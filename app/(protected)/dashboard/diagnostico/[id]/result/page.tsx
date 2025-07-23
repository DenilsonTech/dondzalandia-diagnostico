"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/utils"
import Cookies from "js-cookie"
import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function DiagnosticResultPage() {
    const params = useParams()
    const testId = params.id as string
    const [results, setResults] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [disciplina, setDisciplina] = React.useState<{ id: string, nome: string } | null>(null)

    React.useEffect(() => {
        async function fetchResults() {
            setLoading(true)
            setError(null)
            try {
                const token = Cookies.get("access_token")
                const res = await fetch(`${API_BASE_URL}resultados/${testId}/alunos`, {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                })
                if (!res.ok) throw new Error("Erro ao buscar resultados dos alunos.")
                const data = await res.json()
                console.log("Resultados da API:", data)
                setResults(data.data || [])
                setDisciplina(data.disciplina || null)
            } catch (err: any) {
                setError(err.message || "Erro ao buscar resultados dos alunos.")
            } finally {
                setLoading(false)
            }
        }
        if (testId) fetchResults()
    }, [testId])

    // Extrair dados do topo
    const first = results[0]
    const nomeTeste = first?.exercicio?.teste?.titulo || "Teste Diagnóstico"
    const nomeDisciplina = disciplina?.nome || "Disciplina"
    const nomeClasse = first?.aluno?.classe?.name || "Classe"
    const nomeTurma = first?.aluno?.turma?.codigo || "Turma"

    // Definir colunas para o DataTable
    const columns: ColumnDef<any>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "nome_completo", // <-- adicionado id explícito
        header: "Nome Completo",
        accessorKey: "aluno.nome_completo",
        cell: ({ row }) => row.original.aluno?.nome_completo || "-",
      },
      {
        header: "Nota",
        accessorKey: "valor_total",
        cell: ({ row }) => <span className="font-semibold">{row.original.valor_total}</span>,
      },
    ]

    // Configurar a tabela do shadcn
    const table = useReactTable({
      data: results,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    })

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl w-full mx-auto space-y-6 px-2 sm:px-4">
          <div className="px-6 py-4 border-b bg-white rounded-t-2xl">
            <h2 className="font-bold text-lg mb-2">{nomeTeste}</h2>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Disciplina: <b>{nomeDisciplina}</b></span>
              <span>Classe: <b>{nomeClasse}</b></span>
              <span>Turma: <b>{nomeTurma}</b></span>
            </div>
          </div>
          <div className="bg-white rounded-b-2xl shadow-lg p-0 overflow-x-auto w-full">
            <div className="flex items-center py-4 px-4 gap-2">
              <Input
                placeholder="Filtrar por nome..."
                value={(table.getColumn("nome_completo")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("nome_completo")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Colunas <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Carregando resultados...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <Table className="w-full min-w-[600px]">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-xs font-semibold text-gray-700 bg-gray-50">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row, idx) => (
                      <TableRow key={row.id} className="border-b last:border-0 hover:bg-gray-50 transition" data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3 px-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">Nenhum resultado encontrado.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    )
} 