'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Patient } from '@prisma/client';

const patientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().optional(),
  birthDate: z.string().optional(),
  weight: z.string().optional(),
  ownerName: z.string().min(1, 'Nome do tutor é obrigatório'),
  ownerPhone: z.string().min(1, 'Telefone do tutor é obrigatório'),
  ownerEmail: z.string().email('Email inválido').optional().or(z.literal('')),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormData) => Promise<void>;
  onCancel: () => void;
}

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          ...patient,
          birthDate: patient.birthDate
            ? new Date(patient.birthDate).toISOString().split('T')[0]
            : undefined,
          weight: patient.weight?.toString(),
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome do Pet"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Espécie"
          error={errors.species?.message}
          {...register('species')}
        />
        <Input
          label="Raça"
          error={errors.breed?.message}
          {...register('breed')}
        />
        <Input
          label="Data de Nascimento"
          type="date"
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
        <Input
          label="Peso (kg)"
          type="number"
          step="0.01"
          error={errors.weight?.message}
          {...register('weight')}
        />
        <Input
          label="Nome do Tutor"
          error={errors.ownerName?.message}
          {...register('ownerName')}
        />
        <Input
          label="Telefone do Tutor"
          error={errors.ownerPhone?.message}
          {...register('ownerPhone')}
        />
        <Input
          label="Email do Tutor"
          type="email"
          error={errors.ownerEmail?.message}
          {...register('ownerEmail')}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {patient ? 'Salvar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
} 