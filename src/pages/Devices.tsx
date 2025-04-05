import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DeviceForm } from '../components/forms/DeviceForm';
import { Alert } from '../components/ui/Alert';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Device {
  serial: string;
  ip_address: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setAlert({ type: 'error', message: 'Failed to fetch devices' });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setShowForm(true);
  };

  const handleDelete = async (serial: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('serial', serial);

      if (error) throw error;

      setDevices(devices.filter(device => device.serial !== serial));
      setAlert({ type: 'success', message: 'Device deleted successfully' });
    } catch (error) {
      console.error('Error deleting device:', error);
      setAlert({ type: 'error', message: 'Failed to delete device' });
    }
  };

  const handleFormSuccess = () => {
    fetchDevices();
    setShowForm(false);
    setEditingDevice(null);
    setAlert({
      type: 'success',
      message: `Device ${editingDevice ? 'updated' : 'created'} successfully`,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Devices</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingDevice(null);
          }}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </button>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} />
      )}

      {showForm && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-medium">
            {editingDevice ? 'Edit Device' : 'New Device'}
          </h2>
          <DeviceForm
            onSuccess={handleFormSuccess}
            initialData={editingDevice || undefined}
            mode={editingDevice ? 'edit' : 'create'}
          />
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.serial}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {device.serial}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {device.ip_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      device.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(device.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(device)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(device.serial)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}