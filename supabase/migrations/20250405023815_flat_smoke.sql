/*
  # Add CRUD policies for all tables

  1. Security Changes
    - Add INSERT, UPDATE, and DELETE policies for all tables
    - Ensure authenticated users can perform CRUD operations
    - Check for existing policies before creating new ones
*/

DO $$ 
BEGIN
  -- Devices policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users only' AND tablename = 'devices') THEN
    CREATE POLICY "Enable insert for authenticated users only" ON devices FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update for authenticated users' AND tablename = 'devices') THEN
    CREATE POLICY "Enable update for authenticated users" ON devices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete for authenticated users' AND tablename = 'devices') THEN
    CREATE POLICY "Enable delete for authenticated users" ON devices FOR DELETE TO authenticated USING (true);
  END IF;

  -- Beds policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users only' AND tablename = 'beds') THEN
    CREATE POLICY "Enable insert for authenticated users only" ON beds FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update for authenticated users' AND tablename = 'beds') THEN
    CREATE POLICY "Enable update for authenticated users" ON beds FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete for authenticated users' AND tablename = 'beds') THEN
    CREATE POLICY "Enable delete for authenticated users" ON beds FOR DELETE TO authenticated USING (true);
  END IF;

  -- Patients policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users only' AND tablename = 'patients') THEN
    CREATE POLICY "Enable insert for authenticated users only" ON patients FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update for authenticated users' AND tablename = 'patients') THEN
    CREATE POLICY "Enable update for authenticated users" ON patients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete for authenticated users' AND tablename = 'patients') THEN
    CREATE POLICY "Enable delete for authenticated users" ON patients FOR DELETE TO authenticated USING (true);
  END IF;

  -- Monitor data policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users only' AND tablename = 'monitor_data') THEN
    CREATE POLICY "Enable insert for authenticated users only" ON monitor_data FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update for authenticated users' AND tablename = 'monitor_data') THEN
    CREATE POLICY "Enable update for authenticated users" ON monitor_data FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete for authenticated users' AND tablename = 'monitor_data') THEN
    CREATE POLICY "Enable delete for authenticated users" ON monitor_data FOR DELETE TO authenticated USING (true);
  END IF;

  -- Panels policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users only' AND tablename = 'panels') THEN
    CREATE POLICY "Enable insert for authenticated users only" ON panels FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update for authenticated users' AND tablename = 'panels') THEN
    CREATE POLICY "Enable update for authenticated users" ON panels FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete for authenticated users' AND tablename = 'panels') THEN
    CREATE POLICY "Enable delete for authenticated users" ON panels FOR DELETE TO authenticated USING (true);
  END IF;

  -- Panel beds policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for authenticated users only' AND tablename = 'panel_beds') THEN
    CREATE POLICY "Enable insert for authenticated users only" ON panel_beds FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable update for authenticated users' AND tablename = 'panel_beds') THEN
    CREATE POLICY "Enable update for authenticated users" ON panel_beds FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete for authenticated users' AND tablename = 'panel_beds') THEN
    CREATE POLICY "Enable delete for authenticated users" ON panel_beds FOR DELETE TO authenticated USING (true);
  END IF;
END $$;