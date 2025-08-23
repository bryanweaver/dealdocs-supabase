/*
Use the following code to retrieve configured secrets from SSM:
const aws = require('aws-sdk');
const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["ANVIL_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();
Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
// Use the following code to retrieve configured secrets from SSM:
// const { Parameters } = await new aws.SSM()
//   .getParameters({
//     Names: ["ANVIL_API_KEY"].map((secretName) => process.env[secretName]),
//     WithDecryption: true,
//   })
//   .promise();
// Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]

const Anvil = require("@anvilco/anvil");
const aws = require("aws-sdk");

const ssm = new aws.SSM();
const parameterName =
  "/amplify/d1v26x6qc0g3vu/dev/AMPLIFY_anvilProxy_ANV_API_KEY";

exports.handler = async (event) => {
  console.log("Received request payload:", JSON.stringify(event));

  try {
    const secretsResponse = await ssm
      .getParameter({ Name: parameterName, WithDecryption: true })
      .promise();
    const apiKey = secretsResponse.Parameter.Value;

    const client = new Anvil({ apiKey });

    const { data, templateId } = JSON.parse(event.body);
    console.log("data", data);
    const response = await client.fillPDF(templateId, { data: data });

    console.log("API response", response);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error occurred:", error);
    return {
      statusCode: error.response?.status || 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
