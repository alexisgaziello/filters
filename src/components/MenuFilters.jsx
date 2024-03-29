import React, { useState, useEffect } from 'react'
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
  Container,
  Header,
  Segment,
  Form,
  Radio,
  Button,
  Icon,
  Grid,
  Card,
  Dimmer,
  Loader,
  Popup,
} from 'semantic-ui-react';

import { useHistory } from "react-router-dom";

import { motion } from "framer-motion"

import { Steps } from './filters/Steps.jsx'
import { PaypalPaymentForm } from './filters/PaypalPaymentForm.jsx'
import { UploadOptions } from './filters/UploadOptions.jsx'
import HiddenDiv from './General.jsx'

import { blue, pink, yellow } from "../constants.js"

// S3 config
const client = new S3Client({
  apiVersion: '2006-03-01',
  region: process.env.CLOUD_REGION,
  credentials: {
    accessKeyId: process.env.CLOUD_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_SECRET_ACCESS_KEY,
  }
});

// Steps
const stepsDescription = [
  {
    title: "Upload Menu",
    iconName: "upload",
  },
  {
    title: "Payment",
    iconName: "payment",
  }
]

export const MenuFilters = () => {

  const history = useHistory();

  const [activeStep, setActiveStepOnly] = useState(0);
  const [completed, setCompleted] = useState(stepsDescription.map(() => false));
  const [filtersQty, setFiltersQty] = useState(1);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleUploads = async (transactionID, payerEmail, payerName) => {
    // TODO: cancel if error?
    try {
      const sendEmailReq = sendEmail(payerEmail, transactionID, payerName, filtersQty);
      const uploadFile1 = uploadFile(file1, transactionID);

      if (filtersQty > 1) {
        const uploadFile2 = uploadFile(file2, transactionID);
        await uploadFile2;
      }
      await uploadFile1;

      await sendEmailReq;

      // Success
      history.push(["/purchase-completed", "success", transactionID, payerName].join("/"));

    } catch (error) {
      // Failure
      onError(error)
    }
  }

  const pushActiveStep = () => {
    setActiveStep(activeStep + 1)
  }

  const setActiveStep = (index) => {
    completed[index - 1] = true;
    setCompleted(completed);
    setActiveStepOnly(index)
  }

  const formAnimation = {
    show: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: "-100%", transition: { when: "beforeChildren" } },
  }

  const filesSelectedCorrectly = (
    file1
    && (filtersQty === 1
      || (filtersQty === 2 && file2))
  )

  const filesSelectedAreEqual = (
    file1 && file2
    && file1.fileData === file2.fileData
  )

  const uploadFile = ({ fileName, fileData, fileContentType, fileID }, transactionID) => {

    // TODO: add timestamp?? const timestamp = Date.now();
    const ID_fileName = [transactionID, fileID, fileName].join("_");

    const input = {
      Body: fileData,
      Bucket: process.env.CLOUD_BUCKET_NAME,
      Key: ID_fileName,
      ContentType: fileContentType,
    };

    const command = new PutObjectCommand(input);

    return client.send(command);
  }

  const sendEmail = (email, transactionID, name, filtersQty) => {

    const requestBody = {
        method: 'POST',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            action: "sendEmail",
            data: {
                recipient: email,
                transactionID: transactionID,
                name: name,
                filtersQty: filtersQty
            }
        }),
    };
    return fetch(process.env.SERVER_URL, requestBody);
}

  const onError = (error) => {
    console.log(error)
    history.push(["/purchase-completed", "failure", error].join("/"));
  }

  const popUpContent = filesSelectedAreEqual
    ? "Please, select 2 different files!"
    : filesSelectedCorrectly
      ? "Proceed to payment"
      : `Upload ${filtersQty} file${filtersQty === 1 ? "" : "s"} first`

  return (
    <Container>

      <br />
      <br />

      {/* Step 1: Upload file */}
      <HiddenDiv isHidden={(activeStep === 0)}>
        <UploadOptions
          filtersQty={filtersQty}
          setFiltersQty={setFiltersQty}
          setFile1={setFile1}
          setFile2={setFile2}
        />

        <br />
        <br />

        <Grid textAlign="center">
          <Grid.Column>
            <Popup
              content={popUpContent}
              position="top center"
              trigger={
                <div>
                  <Button
                    disabled={!filesSelectedCorrectly || filesSelectedAreEqual}
                    onClick={pushActiveStep}
                    negative={filesSelectedAreEqual}
                  >
                    Next
                  </Button>
                </div>
              } />
          </Grid.Column>
        </Grid>
      </HiddenDiv>


      {/* Step 2: Payment */}
      <HiddenDiv isHidden={activeStep === 1}>
        <PaypalPaymentForm
          filtersQty={filtersQty}
          pushActiveStep={pushActiveStep}
          handleUploads={handleUploads}
          onError={onError}
        ></PaypalPaymentForm>
      </HiddenDiv>


      {/* Final message */}
      <HiddenDiv isHidden={activeStep === 2}>
        <Segment loading={true} style={{ height: "500px" }}>
        </Segment>
      </HiddenDiv>


      <br />


      {/* Steps */}
      <HiddenDiv isHidden={activeStep < 2}>
        <Steps
          stepsDescription={stepsDescription}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          completed={completed}
        />
      </HiddenDiv>

      <Button onClick={() => pushActiveStep()}></Button>

      <br />
      <br />

    </Container>
  )
};
