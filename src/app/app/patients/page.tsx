"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PatientRegistrationForm } from "@/components/patients/PatientRegistrationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";

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

export default function PatientsPage() {
  const [open, setOpen] = useState(false);

  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("/api/patients");
      if (!response.ok) {
        throw new Error("Erro ao carregar pacientes");
      }
      return response.json();
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Paciente</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
              <DialogDescription>
                Preencha os dados do tutor e do paciente para realizar o cadastro.
              </DialogDescription>
            </DialogHeader>
            <PatientRegistrationForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : (
          <DataTable columns={columns} data={patients || []} />
        )}
      </div>
    </div>
  );
} 