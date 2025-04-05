# Healthcare Monitoring System Documentation

## System Overview

A real-time patient monitoring system that allows healthcare providers to track patient vital signs and manage medical devices across multiple hospital sectors.

## Business Rules

### Devices

- Each device has a unique serial number
- IP address must be valid and reachable
- Status can be either 'active' or 'inactive'
- Connection test required before device registration
- Only active devices can be linked to beds
- Timestamps track creation and updates

### Beds

- Each bed has a unique name and sector
- Can be linked to one active device at a time
- Device linkage is optional
- Timestamps track creation and updates
- Must be assigned to a sector for organizational purposes

### Patients

- Unique ID (typically hospital ID)
- Required information: name, birth date, gender
- Gender options: 'M', 'F', 'Other'
- Timestamps track admission and updates
- Birth date must be a valid past date

### Monitor Data

- Links device IP with patient ID
- Stores vital signs:
  - Blood Pressure (systolic/diastolic)
  - Heart Rate (beats per minute)
  - Respiratory Rate (breaths per minute)
  - SpO2 (oxygen saturation percentage)
  - Temperature (stored in °F, convertible to °C)
- Temperature conversion formula: °C = (°F - 32) × 5/9
- Each reading includes timestamp
- Patient name stored for quick reference

### Panels

- Visual display of multiple beds
- Maximum 12 beds per panel
- Real-time vital sign updates
- Device status monitoring:
  - Online/offline status based on 30-second timeout
  - Visual indicators for connection state
- Scrollable interface for bed navigation
- Automatic data refresh

## Features

### Device Management

- CRUD operations for medical devices
- Network connectivity testing
- Status tracking and updates
- Device-to-bed assignment

### Bed Management

- CRUD operations for hospital beds
- Sector organization
- Device linkage
- Occupancy tracking

### Patient Management

- CRUD operations for patient records
- Demographic information
- Admission tracking
- Historical data access

### Monitoring

- Real-time vital sign display
- Automatic data updates
- Temperature unit conversion
- Device connection status
- Historical data tracking

### Panel Display

- Multi-bed monitoring
- Customizable layouts
- Real-time updates
- Device status indicators
- Responsive design
- Touch-friendly interface

## Technical Details

### Database Schema

```sql
-- Devices
CREATE TABLE devices (
  serial TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beds
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  device_serial TEXT REFERENCES devices(serial),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F', 'Other')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monitor Data
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

-- Panels
CREATE TABLE panels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Panel Beds Junction
CREATE TABLE panel_beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
  position INTEGER CHECK (position >= 1 AND position <= 12),
  UNIQUE (panel_id, position)
);
```

### Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for all operations
- Role-based access control
- Secure API endpoints
- Data validation and sanitization

### Performance

- Optimized database queries
- Connection pooling
- Efficient real-time updates
- Lazy loading for historical data
- Caching strategies

### Monitoring

- Real-time data polling
- WebSocket connections for live updates
- Automatic reconnection handling
- Error recovery mechanisms
- Performance monitoring