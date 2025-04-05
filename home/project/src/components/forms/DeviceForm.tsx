import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

const deviceSchema = z.object({
  serial: z.string().min(1, 'Serial is required'),
  ip_address: z.string().min(1, 'IP address is required').regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP address format'),
  status: z.enum(['active', 'inactive']),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
  onSuccess?: () => void;
  initialData?: DeviceFormData;
  mode?: 'create' | 'edit';
}

export function DeviceForm({ onSuccess, initialData, mode = 'create' }: DeviceFormProps) {
  const [pingLoading, setPingLoading] = useState(false);
  const [pingError, setPingError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: initialData || {
      status: 'inactive',
    },
  });

  const ipAddress = watch('ip_address');

  const testConnection = async (ip: string): Promise<boolean> => {
    setPingLoading(true);
    setPingError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ping`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });

      const data = await response.json();
      
      if (!data.success) {
        setPingError('Device is not reachable');
        return false;
      }

      return true;
    } catch (error) {
      setPingError('Failed to test connection');
      return false;
    } finally {
      setPingLoading(false);
    }
  };

  const onSubmit = async (data: DeviceFormData) => {
    try {
      // Skip ping test for edit mode
      if (mode === 'create') {
        const isReachable = await testConnection(data.ip_address);
        if (!isReachable) return;
      }

      if (mode === 'edit') {
        const { error } = await supabase
          .from('devices')
          .update(data)
          .eq('serial', initialData?.serial);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('devices').insert([data]);
        if (error) throw error;
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="serial" className="block text-sm font-medium text-gray-700">
          Serial Number
        </label>
        <input
          type="text"
          id="serial"
          disabled={mode === 'edit'}
          {...register('serial')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
        />
        {errors.serial && (
          <p className="mt-1 text-sm text-red-600">{errors.serial.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="ip_address" className="block text-sm font-medium text-gray-700">
          IP Address
        </label>
        <div className="relative">
          <input
            type="text"
            id="ip_address"
            {...register('ip_address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {ipAddress && mode === 'create' && (
            <button
              type="button"
              onClick={() => testConnection(ipAddress)}
              disabled={pingLoading || !ipAddress}
              className="absolute right-2 top-[6px] rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {pingLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Test Connection'
              )}
            </button>
          )}
        </div>
        {errors.ip_address && (
          <p className="mt-1 text-sm text-red-600">{errors.ip_address.message}</p>
        )}
        {pingError && (
          <p className="mt-1 text-sm text-red-600">{pingError}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || (mode === 'create' && pingLoading)}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Device' : 'Create Device'}
      </button>
    </form>
  );
}