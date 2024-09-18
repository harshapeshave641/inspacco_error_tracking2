import React from 'react';
import { useQuery } from '@apollo/client';
import { FAULTY_QUERY } from './graphql/queries/faultyQuery';

const ErrorTrigger = () => {
  const { loading, error, data } = useQuery(FAULTY_QUERY);

  if (loading) return <p>Loading...</p>;
    if(error){
        throw new Error(`Found on ErrorTrigger: ${error}`)
    }
  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ErrorTrigger;
