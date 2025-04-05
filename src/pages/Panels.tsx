import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PanelForm } from '../components/forms/PanelForm';
import { Plus } from 'lucide-react';

interface Panel {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function Panels() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPanels();
  }, []);

  async function fetchPanels() {
    try {
      const { data, error } = await supabase
        .from('panels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPanels(data || []);
    } catch (error) {
      console.error('Error fetching panels:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panels</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Panel
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-medium">New Panel</h2>
          <PanelForm
            onSuccess={() => {
              fetchPanels();
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.map((panel) => (
          <Link
            key={panel.id}
            to={`/panels/${panel.id}`}
            className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">{panel.name}</h2>
              <p className="mt-2 text-sm text-gray-500">
                Created: {new Date(panel.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}