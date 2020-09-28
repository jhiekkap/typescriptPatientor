export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

  export enum EntryType {
  Hospital = 'Hospital',
  HealthCheck = 'HealthCheck',
  OccupationalHealthcare = 'OccupationalHealthcare'
}  

//export type EntryType = 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare'


export interface Discharge {
  date: string;
  criteria: string;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

interface BaseEntry { 
  type: EntryType;
  id: string;
  description: string;
  date: string;
  specialist?: string;
  diagnosisCodes?: string[] /* Array<Diagnosis['code']> */; 
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: Discharge;
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  sickLeave?: SickLeave;
  employerName: string;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry 

export interface Patient {
  id: string | any;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Entry[]
}
