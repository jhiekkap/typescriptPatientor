import React from "react";
import { Entry, EntryType, Diagnosis, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry } from "../types";
import { Container, Card, Icon } from "semantic-ui-react";
import HealthRatingBar from "../components/HealthRatingBar";

interface CardProps {
    diagnoses: { [code: string]: Diagnosis };
    entry: Entry;
}

interface BasicCardProps {
    type: string;
    date: string;
    description: string;
    specialist?: string;
    diagnosisCodes?: Array<Diagnosis['code']>;
    diagnoses: { [code: string]: Diagnosis };
}

const icons: any = {
    'Hospital': 'hospital',
    'OccupationalHealthcare': 'fork',
    'HealthCheck': 'check'
}

const BasicCard: React.FC<BasicCardProps> = (props) => {
    const { type, date, description, specialist, diagnosisCodes, diagnoses } = props
    return (
        <Card>
            <Card.Content>
                <Card.Header>{date}{' '}<Icon name={icons[type]} /></Card.Header>
                {specialist &&
                    <Card.Meta>
                        Specialist: {specialist}
                    </Card.Meta>}
                <Card.Description>
                    Description:  {description}
                </Card.Description>
                {diagnosisCodes && diagnosisCodes.length > 0 &&
                    <Container>
                        Diagnoses:
                       <ul>
                            {diagnosisCodes.map((code, c) => {
                                const diagnosis: Diagnosis | undefined = Object.values(diagnoses).find((diagnosis: Diagnosis) => diagnosis.code === code)
                                return <li key={c}>{code}{' '}{diagnosis && diagnosis.name}</li>
                            })}
                        </ul>
                    </Container>}
            </Card.Content>
            <Card.Content>
                {props.children}
            </Card.Content>
        </Card>
    )
}

const HospitalEntryCard: React.FC<{ entry: HospitalEntry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    const { discharge, ...basics } = entry
    return (
        <BasicCard {...basics} diagnoses={diagnoses}>
            {discharge &&
                <Container>
                    <p>Discharged: {discharge.date}</p>
                    <p>Criteria: {discharge.criteria}</p>
                </Container>}
        </BasicCard>
    )
}

const OccupationalHealthcareEntryCard: React.FC<{ entry: OccupationalHealthcareEntry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    const { employerName, sickLeave, ...basics } = entry
    return (
        <BasicCard {...basics} diagnoses={diagnoses}>
            <p>Employer: {employerName}</p>
            {sickLeave && sickLeave.startDate && sickLeave.endDate&&
                <Container>
                    Sick leave:
                    <ul>
                        <li>From: {sickLeave.startDate}</li>
                        <li>To: {sickLeave.endDate}</li>
                    </ul>
                </Container>}
        </BasicCard>
    )
}

const HealthCheckEntryCard: React.FC<{ entry: HealthCheckEntry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    const { healthCheckRating, ...basics } = entry
    return (
        <BasicCard {...basics} diagnoses={diagnoses}>
            <HealthRatingBar showText={true} rating={healthCheckRating} />
        </BasicCard>
    )
}

const EntryDetails: React.FC<CardProps> = ({ entry, diagnoses }) => {

    const assertNever = (value: never): never => {
        throw new Error(
            `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
    };

    switch (entry.type) {
        case EntryType.Hospital:
            return <HospitalEntryCard entry={entry} diagnoses={diagnoses} />;
        case EntryType.OccupationalHealthcare:
            return <OccupationalHealthcareEntryCard entry={entry} diagnoses={diagnoses} />;
        case EntryType.HealthCheck:
            return <HealthCheckEntryCard entry={entry} diagnoses={diagnoses} />;
        default:
            return assertNever(entry)
    }
}

export default EntryDetails;
