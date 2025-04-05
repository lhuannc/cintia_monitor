import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';

interface Bed {
  id: string;
  name: string;
  sector: string;
}

const panelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  beds: z.array(
    z.object({
      bed_id: z.string(),
      position: z.number().min(1).max(12),
    })
  ),
});

type PanelFormData = z.infer<typeof panelSchema>;

interface PanelFormProps {
  onSuccess?: () => void;
}

export function PanelForm({ onSuccess }: PanelFormProps) {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<Array<{ id: string; position: number }>>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PanelFormData>({
    resolver: zodResolver(panelSchema),
  });

  useEffect(() => {
    async function fetchBeds() {
      try {
        const { data, error } = await supabase.from('beds').select('*');
        if (error) throw error;
        setBeds(data || []);
      } catch (error) {
        console.error('Error fetching beds:', error);
      }
    }
    fetchBeds();
  }, []);

  const onSubmit = async (data: PanelFormData) => {
    try {
      const { data: panel, error: panelError } = await supabase
        .from('panels')
        .insert([{ name: data.name }])
        .select()
        .single();

      if (panelError) throw panelError;

      const panelBeds = selectedBeds.map((bed) => ({
        panel_id: panel.id,
        bed_id: bed.id,
        position: bed.position,
      }));

      const { error: bedsError } = await supabase
        .from('panel_beds')
        .insert(panelBeds);

      if (bedsError) throw bedsError;

      reset();
      setSelectedBeds([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating panel:', error);
    }
  };

  const addBed = (bedId: string) => {
    if (selectedBeds.length >= 12) return;
    setSelectedBeds([...selectedBeds, { id: bedId, position: selectedBeds.length + 1 }]);
  };

  const removeBed = (bedId: string) => {
    setSelectedBeds(selectedBeds.filter((bed) => bed.id !== bedId));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Panel Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Add Beds (Max 12)</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {beds.map((bed) => {
            const isSelected = selectedBeds.some((selected) => selected.id === bed.id);
            return (
              <div
                key={bed.id}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-gray-400"
              >
                <div className="min-w-0 flex-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">{bed.name}</p>
                  <p className="truncate text-sm text-gray-500">{bed.sector}</p>
                </div>
                <button
                  type="button"
                  onClick={() => isSelected ? removeBed(bed.id) : addBed(bed.id)}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isSelected
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isSelected ? 'Remove' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || selectedBeds.length === 0}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Panel'}
      </button>
    </form>
  );
}