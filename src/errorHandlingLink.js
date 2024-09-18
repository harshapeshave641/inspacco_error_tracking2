import { ApolloLink, Observable } from '@apollo/client';
import rollbar from './rollbar'; 

const errorHandlingLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    forward(operation).subscribe({
      next: (result) => {
        if (result.errors) {
          result.errors.forEach(error => {
            console.error('GraphQL Error:', error);
             rollbar.error('GraphQL Error reported by error handling link', { error });
            // throw new Error('GraphQL Error using error boundary: ' + error.message);
          });
        }
        observer.next(result);
      },
      error: (networkError) => {
        console.error('Network Error:', networkError);
        rollbar.error('Network Error', { error: networkError });
        observer.error(networkError);
      },
      complete: () => observer.complete(),
    });
  });
});

export default errorHandlingLink;
