/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TURBOTRACTSCONTRACTS_BUCKETNAME
	SES_FROM_EMAIL
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");

const ses = new aws.SES();
const s3 = new aws.S3();
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

const getContentType = (filetype) => {
  switch (filetype.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

exports.handler = async (event) => {
  for (const streamedItem of event.Records) {
    if (streamedItem.eventName === "INSERT") {
      //pull off items from stream
      const accountId = streamedItem.dynamodb.NewImage.accountId.S;
      const contractId = streamedItem.dynamodb.NewImage.contractId.S;
      const streetAddress = streamedItem.dynamodb.NewImage.streetAddress.S;
      const contractKeys = streamedItem.dynamodb.NewImage.contractFiles.L.map(
        (item) => item.S,
      );
      const preApprovalKey = streamedItem.dynamodb.NewImage.preApprovalFile.S;
      const earnestKey = streamedItem.dynamodb.NewImage.earnestFile.S;
      const optionKey = streamedItem.dynamodb.NewImage.optionFile.S;
      const agentEmail = streamedItem.dynamodb.NewImage.agentEmail.S;
      const agentName = streamedItem.dynamodb.NewImage.agentName.S;
      const comments = streamedItem.dynamodb.NewImage.comments.S;

      console.log("streamedItem", streamedItem.dynamodb.NewImage);
      console.log("Account ID:", accountId);
      console.log("Contract ID:", contractId);
      console.log("Street Address:", streetAddress);
      console.log("Contract File Keys:", contractKeys);
      console.log("Pre-Approval File Key:", preApprovalKey);
      console.log("Earnest Money File Key:", earnestKey);
      console.log("Option Fee File Key:", optionKey);
      console.log("Agent Email:", agentEmail);
      console.log("Agent Name:", agentName);
      console.log("Comments:", comments);

      const appLink = `http://localhost:5173/#/seller-revision-request/${contractId}`;

      const CONTRACT_BUCKET =
        process.env.STORAGE_TURBOTRACTSCONTRACTS_BUCKETNAME;

      let contractFiles = [];
      let preApprovalFile, earnestFile, optionFile;

      try {
        // Fetch all contract files
        for (const contractKey of contractKeys) {
          try {
            console.log(
              `Fetching contractFile from S3: Bucket=${CONTRACT_BUCKET}, Key=public/${contractKey}`,
            );
            const contractFile = await s3
              .getObject({
                Bucket: CONTRACT_BUCKET,
                Key: `public/${contractKey}`,
              })
              .promise();
            contractFile.Key = contractKey;
            console.log("Successfully fetched contractFile from S3");
            console.log("contractFile size:", contractFile.Body.length);
            contractFiles.push(contractFile);
          } catch (error) {
            console.error(
              `Error fetching contractFile ${contractKey} from S3:`,
              error,
            );
            throw error;
          }
        }

        console.log("contractFiles after fetch", contractFiles);

        try {
          console.log(
            `Fetching preApprovalFile from S3: Bucket=${CONTRACT_BUCKET}, Key=public/${preApprovalKey}`,
          );
          console.log("preApprovalKey", preApprovalKey);
          preApprovalFile = await s3
            .getObject({
              Bucket: CONTRACT_BUCKET,
              Key: `public/${preApprovalKey}`,
            })
            .promise();
          preApprovalFile.filetype = preApprovalKey.split(".").pop();
          console.log("Successfully fetched preApprovalFile from S3");
          console.log("preApproval file", preApprovalFile.Body);
          console.log("preApprovalFile size:", preApprovalFile.Body.length);
        } catch (error) {
          console.error("Error fetching preApprovalFile from S3:", error);
          throw error;
        }

        try {
          console.log(
            `Fetching earnestFile from S3: Bucket=${CONTRACT_BUCKET}, Key=public/${earnestKey}`,
          );
          console.log("earnestKey", earnestKey);
          earnestFile = await s3
            .getObject({
              Bucket: CONTRACT_BUCKET,
              Key: `public/${earnestKey}`,
            })
            .promise();
          earnestFile.filetype = earnestKey.split(".").pop();
          console.log("Successfully fetched earnestFile from S3");
          console.log("earnest file", earnestFile.Body);
          console.log("earnestFile size:", earnestFile.Body.length);
        } catch (error) {
          console.error("Error fetching earnestFile from S3:", error);
          throw error;
        }

        try {
          console.log(
            `Fetching optionFile from S3: Bucket=${CONTRACT_BUCKET}, Key=public/${optionKey}`,
          );
          console.log("optionKey", optionKey);
          optionFile = await s3
            .getObject({
              Bucket: CONTRACT_BUCKET,
              Key: `public/${optionKey}`,
            })
            .promise();
          optionFile.filetype = optionKey.split(".").pop();
          console.log("Successfully fetched optionFile from S3");
          console.log("option file", optionFile.Body);
          console.log("optionFile size:", optionFile.Body.length);
        } catch (error) {
          console.error("Error fetching optionFile from S3:", error);
          throw error;
        }

        // console.log(
        //   "files",
        //   contractFile,
        //   preApprovalFile,
        //   earnestFile,
        //   optionFile,
        // );

        const todayShortDate = new Date()
          .toLocaleDateString()
          .replace(/\//g, "-");

        // Create attachments array starting with contract files
        const attachments = contractFiles
          .filter((file) => file && file.Key && file.Body)
          .map((file) => ({
            filename: `${file.Key.split("/")
              .pop()
              .replace(/_\d+\.pdf$/, "")}-${todayShortDate}.pdf`,
            content: file.Body,
            contentType: "application/pdf",
            contentTransferEncoding: "base64",
          }));
        // Add other attachments
        attachments.push(
          {
            filename: `pre-approval-${todayShortDate}.${preApprovalFile.filetype}`,
            content: preApprovalFile.Body,
            contentType: getContentType(preApprovalFile.filetype),
            contentTransferEncoding: "base64",
          },
          {
            filename: `earnest-${todayShortDate}.${earnestFile.filetype}`,
            content: earnestFile.Body,
            contentType: getContentType(earnestFile.filetype),
            contentTransferEncoding: "base64",
          },
          {
            filename: `option-${todayShortDate}.${optionFile.filetype}`,
            content: optionFile.Body,
            contentType: getContentType(optionFile.filetype),
            contentTransferEncoding: "base64",
          },
        );

        //setup email with attachment
        const mailOptions = {
          from: process.env.SES_FROM_EMAIL,
          subject: `Formal Contract Offer re: ${streetAddress}`,
          html: `<p>Hi ${agentName}</p>
                <p>Our client is interested in purchasing your listing at ${streetAddress}. Please
                see attachments for all necessary contract offer documents.</p>
                <p>Comments from Buyer:</p>
                <p>${comments}</p>
                <p>Thank you!</p>
                <p>Best Regards,</p>
                <p>DocuDeals Team</p>`,
          to: agentEmail,
          attachments,
        };

        //send email
        await transporter.sendMail(mailOptions);
      } catch (e) {
        console.error("Error", e);
      }
    }
  }
  return { status: "done" };
};
