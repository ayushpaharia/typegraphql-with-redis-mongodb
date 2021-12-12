import { GraphQLError, GraphQLFormattedError } from "graphql";

export const formatArgumentValidationError = () => {
  return (error: GraphQLError): GraphQLFormattedError => {
    const message = error.message;
    console.log(message);

    let customError;
    if (error.extensions && error.extensions.code) {
      console.log(error.extensions.exception.validationErrors);
      customError = error.extensions.exception.validationErrors;
    }
    return {
      message,
      error: customError,
      locations: error.locations,
      path: error.path,
    } as GraphQLFormattedError;
  };
};
