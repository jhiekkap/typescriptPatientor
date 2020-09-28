import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStateValue, updatePatient } from "../state";
import { Icon, Container, Button } from "semantic-ui-react";
import { Patient, EntryType } from "../types";
import EntryDetails from './EntryDetails'
import AddEntryModal from './AddEntryModal'
import { apiBaseUrl } from "../constants";
import { EntryFormValues } from "./AddEntryForm";



const PatientPage: React.FC = () => {

  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  let { id }: any = useParams();
  let patient: Patient | undefined = Object.values(patients).find((patient: Patient) => patient.id === id);


  console.log('DIAGNOOSIT', diagnoses)

  const submitNewEntry = async (values: EntryFormValues) => {
   
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  }

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };



  if (patient) {
    return (
      <Container className="App">
        <h2>{patient.name} <Icon name={patient.gender === 'male' ? 'man' : 'woman'} /></h2>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        {patient.entries &&
          <Container>
            <h4>entries</h4>
            {patient.entries.map((entry, e) => <EntryDetails key={e} entry={entry} diagnoses={diagnoses} />)}
          </Container>}
        <Button onClick={openModal}>Add entry</Button>
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
      </Container>
    );
  } else {
    return <div>Unknown patient</div>
  }

};

export default PatientPage;
