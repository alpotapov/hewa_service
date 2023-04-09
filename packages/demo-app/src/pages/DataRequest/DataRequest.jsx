import React from 'react';
import DataRequestPure from './DataRequestPure';

function DataRequest() {
  const diagnoses = [
    'Covid',
    'Diabetes',
    'Hypertension',
    'Asthma',
    'Cancer',
    'Heart Disease',
    'Stroke',
    'Alzheimer',
    'Kidney Disease',
    'Liver Disease',
    'Depression',
    'Anxiety',
    'OCD',
    'Bipolar Disorder',
    'Schizophrenia',
    'PTSD',
    'Eating Disorder',
    'Autism',
    'ADHD',
    'Dementia',
    'Parkinson',
    'Multiple Sclerosis',
    'Arthritis',
    'Chronic Pain',
    'Sleep Disorder',
  ];
  const data = [
    'Blood Pressure',
    'Blood Sugar',
    'Weight',
    'Height',
    'BMI',
    'Pulse',
    'Oxygen Saturation',
  ];
  const onSendRequest = (collected) => {
    console.log({ collected });
  };
  return <DataRequestPure diagnoses={diagnoses} data={data} onSendRequest={onSendRequest} />;
}

DataRequest.propTypes = {};

export default DataRequest;
