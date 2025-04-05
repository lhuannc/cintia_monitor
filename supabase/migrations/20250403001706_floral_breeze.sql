/*
  # Healthcare Monitoring System Schema

  1. New Tables
    - devices
      - serial (text, primary key)
      - ip_address (text)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - beds
      - id (uuid, primary key)
      - name (text)
      - sector (text)
      - device_serial (text, foreign key)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - patients
      - id (text, primary key)
      - name (text)
      - birth_date (date)
      - gender (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - monitor_data
      - id (uuid, primary key)
      - patient_id (text, foreign key)
      - device_ip (text)
      - record_date (timestamp)
      - patient_name (text)
      - systolic_pressure (integer)
      - diastolic_pressure (integer)
      - heart_rate (integer)
      - respiratory_rate (integer)
      - o2_saturation (integer)
      - temperature_f (numeric)
    
    - panels
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - panel_beds
      - id (uuid, primary key)
      - panel_id (uuid, foreign key)
      - bed_id (uuid, foreign key)
      - position (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Devices table
CREATE TABLE devices (
  serial TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Beds table
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  device_serial TEXT REFERENCES devices(serial),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON beds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Patients table
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F', 'Other')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Monitor data table
CREATE TABLE monitor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT REFERENCES patients(id),
  device_ip TEXT NOT NULL,
  record_date TIMESTAMPTZ DEFAULT NOW(),
  patient_name TEXT NOT NULL,
  systolic_pressure INTEGER,
  diastolic_pressure INTEGER,
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  o2_saturation INTEGER,
  temperature_f NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Panels table
CREATE TABLE panels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON panels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Panel beds junction table
CREATE TABLE panel_beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
  position INTEGER CHECK (position >= 1 AND position <= 12),
  UNIQUE (panel_id, position)
);

-- Enable Row Level Security
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE panel_beds ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON devices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON beds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON monitor_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON panels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON panel_beds FOR SELECT
  TO authenticated
  USING (true);

-- Create function to convert Fahrenheit to Celsius
CREATE OR REPLACE FUNCTION fahrenheit_to_celsius(fahrenheit NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(((fahrenheit - 32) * 5 / 9)::NUMERIC, 1);
END;
$$ LANGUAGE plpgsql;