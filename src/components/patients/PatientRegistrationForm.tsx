"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import { ComboboxDemo } from "@/components/ui/combobox";

// Schemas de validação
const ownerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

const patientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  species: z.string().min(1, "Espécie é obrigatória"),
  breed: z.string().optional(),
  age: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  owner: z.object({
    name: z.string().min(1, "Nome do tutor é obrigatório"),
    email: z.string().email("Email inválido").optional(),
    phone: z.string().min(1, "Telefone é obrigatório"),
  }),
});

type OwnerFormData = z.infer<typeof ownerSchema>;
type PatientFormData = z.infer<typeof patientSchema>;

interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export function PatientRegistrationForm() {
  const [step, setStep] = useState<"select-owner" | "new-owner" | "patient">("select-owner");
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  // Buscar tutores ao montar o componente
  const fetchOwners = async () => {
    try {
      const response = await fetch("/api/owners");
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      toast.error("Erro ao carregar tutores");
    }
  };

  // Criar novo tutor
  const onOwnerSubmit = async (data: OwnerFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Erro ao criar tutor");
      
      const newOwner = await response.json();
      setSelectedOwnerId(newOwner.id);
      setStep("patient");
      toast.success("Tutor cadastrado com sucesso");
    } catch (error) {
      toast.error("Erro ao cadastrar tutor");
    } finally {
      setLoading(false);
    }
  };

  // Criar novo paciente
  const onPatientSubmit = async (data: PatientFormData) => {
    if (!selectedOwnerId) {
      toast.error("Selecione um tutor primeiro");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          ownerId: selectedOwnerId,
        }),
      });
      
      if (!response.ok) throw new Error("Erro ao criar paciente");
      
      toast.success("Paciente cadastrado com sucesso");
      
      // Resetar formulário e voltar ao início
      setValue("name", "");
      setValue("species", "");
      setValue("breed", "");
      setValue("age", 0);
      setValue("weight", 0);
      setValue("owner.name", "");
      setValue("owner.email", "");
      setValue("owner.phone", "");
      setStep("select-owner");
      setSelectedOwnerId("");
    } catch (error) {
      toast.error("Erro ao cadastrar paciente");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step === "select-owner" ? "new-owner" : "patient");
  const previousStep = () => setStep(step === "new-owner" ? "select-owner" : "patient");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {step === "select-owner" && "Selecione o Tutor"}
          {step === "new-owner" && "Cadastrar Novo Tutor"}
          {step === "patient" && "Cadastrar Paciente"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "select-owner" && (
          <div className="space-y-4">
            <ComboboxDemo
              owners={owners}
              onSelect={(id) => {
                setSelectedOwnerId(id);
                setStep("patient");
              }}
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("new-owner")}
              >
                Cadastrar Novo Tutor
              </Button>
            </div>
          </div>
        )}

        {step === "new-owner" && (
          <form onSubmit={handleSubmit(onOwnerSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register("name")}
                error={errors.owner?.name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("owner.email")}
                error={errors.owner?.email?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register("owner.phone")}
                error={errors.owner?.phone?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                {...register("address")}
                error={errors.address?.message}
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Próximo
              </Button>
            </div>
          </form>
        )}

        {step === "patient" && (
          <form onSubmit={handleSubmit(onPatientSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Paciente</Label>
              <Input
                id="name"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Espécie</Label>
              <Select
                onValueChange={(value) => setValue("species", value)}
                value={watch("species")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a espécie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Cachorro</SelectItem>
                  <SelectItem value="cat">Gato</SelectItem>
                  <SelectItem value="bird">Pássaro</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Raça</Label>
              <Input
                id="breed"
                {...register("breed")}
                error={errors.breed?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade (anos)</Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  error={errors.age?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register("weight", { valueAsNumber: true })}
                  error={errors.weight?.message}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cadastrar Paciente
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 