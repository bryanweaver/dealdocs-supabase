import { generateClient } from "aws-amplify/api";

const client = generateClient();

function removeTypename(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      if (key !== "__typename") {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export async function graphqlRequest(query, variables) {
  const cleanedVariables = removeTypename(variables);
  const response = await client.graphql({
    query,
    variables: cleanedVariables,
  });
  return response;
}
