"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  owner: {
    name: string;
    email?: string;
    phone?: string;
  };
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "species",
    header: "Espécie",
  },
  {
    accessorKey: "breed",
    header: "Raça",
  },
  {
    accessorKey: "age",
    header: "Idade",
    cell: ({ row }) => {
      const age = row.getValue("age");
      return age ? `${age} anos` : "-";
    },
  },
  {
    accessorKey: "weight",
    header: "Peso",
    cell: ({ row }) => {
      const weight = row.getValue("weight");
      return weight ? `${weight} kg` : "-";
    },
  },
  {
    accessorKey: "owner.name",
    header: "Tutor",
  },
  {
    accessorKey: "owner.phone",
    header: "Telefone do Tutor",
    cell: ({ row }) => {
      const phone = row.original.owner.phone;
      return phone || "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(patient.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 