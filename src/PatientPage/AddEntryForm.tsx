import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { useStateValue } from "../state";
import { TextField, SelectField, TypeOption, DiagnosisSelection, NumberField } from "./FormField";
import { EntryType, HealthCheckRating, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry } from "../types";


/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
type HospitalEntryValues = Omit<HospitalEntry, "id">;
type HealthCheckEntryFormValues = Omit<HealthCheckEntry, "id">;
type OccupationalHealthcareEntryFormValues = Omit<OccupationalHealthcareEntry, "id">;
export type EntryFormValues = HospitalEntryValues | HealthCheckEntryFormValues | OccupationalHealthcareEntryFormValues


interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.HealthCheck, label: "HealthCheck" },
  { value: EntryType.OccupationalHealthcare, label: "OccupationalHealthcare" }
];


const validateDate = (date: string) => {
  const YYYY_MM_DDregex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
  return YYYY_MM_DDregex.test(date)
}

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: EntryType.Hospital,
        date: '',
        description: '',
        specialist: '',
        diagnosisCodes: [],
        discharge: {
          date: '',
          criteria: ''
        },
        healthCheckRating: HealthCheckRating.Healthy,
        sickLeave: {
          startDate: '',
          endDate: ''
        },
        employerName: ''
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const dateFormatError = 'Incorrect date format';
        let errors: { [field: string]: string | { [key: string]: string } } = {};
        errors.discharge = {};
        errors.sickLeave = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (values.date && !validateDate(values.date)) {
          errors.date = dateFormatError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (values.type === EntryType.Hospital) {
          if (!values.discharge.date) {
            errors.discharge.date = requiredError;
          }
          if (values.discharge.date && !validateDate(values.discharge.date)) {
            errors.discharge.date = dateFormatError;
          }
          if (!values.discharge.criteria) {
            errors.discharge.criteria = requiredError;
          }
        } else if (values.type === EntryType.HealthCheck) {
          if (!values.healthCheckRating) {
            errors.healthCheckRating = requiredError;
          }
        } else {
          if (values.sickLeave.startDate && !validateDate(values.sickLeave.startDate)) {
            errors.sickLeave.startDate = dateFormatError;
          }
          if (values.sickLeave.endDate && !validateDate(values.sickLeave.endDate)) {
            errors.sickLeave.endDate = dateFormatError;
          }
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
        }
        if (Object.entries(errors.discharge).length === 0) {
          const { discharge, ...rest } = errors
          errors = rest
        }
        if (Object.entries(errors.sickLeave).length === 0) {
          const { sickLeave, ...rest } = errors
          errors = rest
        }
        console.log('ENTRY FORM ERRORS', errors)
        return errors;
      }}
    >
      {({ isValid, dirty, values, ...props }) => {

        console.log('ENTRY FORM VALUES', values)

        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={typeOptions}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection {...props} diagnoses={Object.values(diagnoses)} />
            {values.type === 'Hospital' &&
              <div> Discharge
                <Field
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  name="discharge.date"
                  component={TextField}
                />
                <Field
                  label="Criteria"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </div>}
            {values.type === 'HealthCheck' &&
              <Field
                label="Health check rating"
                placeholder="Health check"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />}
            {values.type === 'OccupationalHealthcare' &&
              <div> SickLeave
                <Field
                  label="Start Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  component={TextField}
                />
                <Field
                  label="End Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  component={TextField}
                />
                <Field
                  label="Employer"
                  placeholder="Employer"
                  name="employerName"
                  component={TextField}
                />
              </div>}

            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                //disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
