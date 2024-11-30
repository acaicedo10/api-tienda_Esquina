const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION,
  AWS_VERIFIED_EMAIL_ADDRESS,
} = require("../config/env");
const ApiResponse = require("../utils/apiResponse");

const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const sendEmail = async (to, template, templateData) => {
  const params = {
    Source: AWS_VERIFIED_EMAIL_ADDRESS,
    Template: template,
    Destination: {
      ToAddresses: to,
    },
    TemplateData: templateData,
  };

  try {
    const command = new SendTemplatedEmailCommand(params);
    const response = await sesClient.send(command);
    return response;
  } catch (error) {
    console.log(error);
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  sendEmail,
};
