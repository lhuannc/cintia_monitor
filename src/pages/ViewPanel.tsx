import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PanelBed {
  id: string;
  position: number;
  bed: {
    id: string;
    name: string;
    sector: string;
    device_serial: string | null;
  };
}

interface MonitorData {
  systolic_pressure: number | null;
  diastolic_pressure: number | null;
  heart_rate: number | null;
  respiratory_rate: number | null;
  o2_saturation: number | null;
  temperature_f: number | null;
  record_date: string;
}

export function ViewPanel() {
  const { id } = useParams<{ id: string }>();
  const [panelBeds, setPanelBeds] = useState<PanelBed[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitorData, setMonitorData] = useState<Record<string, MonitorData>>({});

  useEffect(() => {
    fetchPanelBeds();
    const interval = setInterval(fetchMonitorData, 1000);
    return () => clearInterval(interval);
  }, [id]);

  async function fetchPanelBeds() {
    try {
      const { data, error } = await supabase
        .from('panel_beds')
        .select(`
          id,
          position,
          bed:beds (
            id,
            name,
            sector,
            device_serial
          )
        `)
        .eq('panel_id', id)
        .order('position');

      if (error) throw error;
      setPanelBeds(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching panel beds:', error);
      setLoading(false);
    }
  }

  async function fetchMonitorData() {
    try {
      const deviceSerials = panelBeds
        .map((pb) => pb.bed.device_serial)
        .filter((serial): serial is string => serial !== null);

      if (deviceSerials.length === 0) return;

      const { data, error } = await supabase
        .from('monitor_data')
        .select('*')
        .in('device_ip', deviceSerials)
        .order('record_date', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data) {
        const newMonitorData: Record<string, MonitorData> = {};
        data.forEach((record) => {
          newMonitorData[record.device_ip] = record;
        });
        setMonitorData(newMonitorData);
      }
    } catch (error) {
      console.error('Error fetching monitor data:', error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {panelBeds.map((panelBed) => (
        <div
          key={panelBed.id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {panelBed.bed.name}
            </h2>
            <p className="text-sm text-gray-500">{panelBed.bed.sector}</p>
            {panelBed.bed.device_serial && monitorData[panelBed.bed.device_serial] && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Blood Pressure:</span>
                  <span className="text-sm font-medium">
                    {monitorData[panelBed.bed.device_serial].systolic_pressure}/
                    {monitorData[panelBed.bed.device_serial].diastolic_pressure} mmHg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Heart Rate:</span>
                  <span className="text-sm font-medium">
                    {monitorData[panelBed.bed.device_serial].heart_rate} bpm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Respiratory Rate:</span>
                  <span className="text-sm font-medium">
                    {monitorData[panelBed.bed.device_serial].respiratory_rate} rpm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">O2 Saturation:</span>
                  <span className="text-sm font-medium">
                    {monitorData[panelBed.bed.device_serial].o2_saturation}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Temperature:</span>
                  <span className="text-sm font-medium">
                    {monitorData[panelBed.bed.device_serial].temperature_f}°F
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}