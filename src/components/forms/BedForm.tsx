import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';

interface Device {
  serial: string;
  ip_address: string;
  status: string;
}

const bedSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sector: z.string().min(1, 'Sector is required'),
  device_serial: z.string().nullable(),
});

type BedFormData = z.infer<typeof bedSchema>;

interface BedFormProps {
  onSuccess?: () => void;
}

export function BedForm({ onSuccess }: BedFormProps) {
  const [devices, setDevices] = useState<Device[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BedFormData>({
    resolver: zodResolver(bedSchema),
  });

  useEffect(() => {
    async function fetchDevices() {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('status', 'active');
        if (error) throw error;
        setDevices(data || []);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    }
    fetchDevices();
  }, []);

  const onSubmit = async (data: BedFormData) => {
    try {
      const { error } = await supabase.from('beds').insert([data]);
      if (error) throw error;
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating bed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
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
        <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
          Sector
        </label>
        <input
          type="text"
          id="sector"
          {...register('sector')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.sector && (
          <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="device_serial" className="block text-sm font-medium text-gray-700">
          Device
        </label>
        <select
          id="device_serial"
          {...register('device_serial')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a device</option>
          {devices.map((device) => (
            <option key={device.serial} value={device.serial}>
              {device.serial} - {device.ip_address}
            </option>
          ))}
        </select>
        {errors.device_serial && (
          <p className="mt-1 text-sm text-red-600">{errors.device_serial.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Bed'}
      </button>
    </form>
  );
}