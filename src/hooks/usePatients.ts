import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: Date;
  weight: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
}

interface UsePatients {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  createPatient: (data: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

export function usePatients(): UsePatients {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/patients');
      if (!response.ok) {
        throw new Error('Erro ao buscar pacientes');
      }
      
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao buscar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (data: Omit<Patient, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar paciente');
      }

      await fetchPatients();
      toast.success('Paciente criado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao criar paciente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: string, data: Partial<Patient>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/patients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar paciente');
      }

      await fetchPatients();
      toast.success('Paciente atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao atualizar paciente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar paciente');
      }

      await fetchPatients();
      toast.success('Paciente deletado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao deletar paciente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
} 