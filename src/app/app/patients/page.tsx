'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PatientList } from '@/components/patients/PatientList';
import { PatientForm } from '@/components/patients/PatientForm';
import { usePatients } from '@/hooks/usePatients';
import { Loader2 } from 'lucide-react';

export default function PatientsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { patients, loading, error, fetchPatients, createPatient, updatePatient, deletePatient } = usePatients();

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      if (selectedPatient) {
        await updatePatient(selectedPatient.id, data);
      } else {
        await createPatient(data);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await deletePatient(id);
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
      }
    }
  };

  const handleEdit = (patient: any) => {
    setSelectedPatient(patient);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setSelectedPatient(null);
    setIsFormVisible(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Erro ao carregar pacientes: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        {!isFormVisible && (
          <Button onClick={() => setIsFormVisible(true)}>
            Novo Paciente
          </Button>
        )}
      </div>

      {isFormVisible ? (
        <PatientForm
          patient={selectedPatient}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      ) : (
        <PatientList
          patients={patients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
} 