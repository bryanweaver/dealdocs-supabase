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
  console.log("Received request payload:", event);

  try {
    const secretsResponse = await ssm
      .getParameter({ Name: parameterName, WithDecryption: true })
      .promise();
    const apiKey = secretsResponse.Parameter.Value;

    const client = new Anvil({ apiKey });

    const {
      userId,
      signers,
      currentSigner,
      etchPacket: providedEtchPacket,
    } = JSON.parse(event.body);

    console.log("event body", JSON.parse(event.body));

    let createEtchPacket;
    if (providedEtchPacket) {
      createEtchPacket = providedEtchPacket;
    } else {
      const etchPacketResponse = await client.createEtchPacket({
        variables: JSON.parse(event.body),
      });
      console.log("etchPacket", etchPacketResponse);
      console.log("Etch packet data", etchPacketResponse.data.data);
      createEtchPacket = etchPacketResponse.data.data.createEtchPacket;
    }

    const { signers: allSigners } = createEtchPacket.documentGroup;

    console.log("allSigners", allSigners);
    const currentSignerData = signers.find(
      (signer) => signer.id === currentSigner,
    );
    const currentSignerEid = createEtchPacket.documentGroup.signers.find(
      (signer) => signer.name === currentSignerData.name,
    ).eid;

    const variables = {
      signerEid: currentSignerEid,
      clientUserId: `${currentSigner}-${userId}`,
    };

    console.log("variables", variables);

    const response = await client.generateEtchSignUrl({ variables });

    console.log("API response", response);

    if (response.errors) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify({ errors: response.errors }),
      };
    }

    return {
      statusCode: response.statusCode,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({
        createEtchPacket: createEtchPacket,
        signingUrl: response.url,
        currentSigner,
        allSigners,
      }),
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
