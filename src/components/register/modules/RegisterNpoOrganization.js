import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import {
  Button,
  InputGroup,
  InputField,
  InputFile,
  ChoiceGroup,
  Radio,
  Select,
  Stack,
  Textarea,
  Text,
  Heading,
} from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsNpoDetails, setIsBackToLanding, setNpoOrganizationDetails } from '../actions';
import { months } from '../../../../utils/constants/month';
import styled from 'styled-components';
import BlueButton from '../../button/BlueButton';

const HeadingColor = styled.div`
  color: #065ef5;
`;

const NextButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const RegisterNpoOrganization = () => {
  // TODO: Restore state when user comes back to this page
  const dispatch = useDispatch();
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    getAllOrganizations();
  }, []);

  const handleBackToLandingOnClick = () => {
    dispatch(setIsBackToLanding());
  };

  const handleFormSubmission = (values) => {
    dispatch(setNpoOrganizationDetails(values));
    dispatch(setIsNpoDetails());
  };

  const getAllOrganizations = () => {
    // Get all organizations from firebase
    setOrganizations([
      {
        label: 'Zero-th item',
        value: 0,
      },
      {
        label: 'First item',
        value: 1,
      },
    ]);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    registeredUnder: Yup.string().required('Required'),
    registrationNumber: Yup.string().required('Required'),
    dateOfRegistrationDay: Yup.number()
      .min(1, 'Day must be in the range 1-31')
      .max(31, 'Day must be in the range 1-31')
      .positive('Day must be in the range 1-31')
      .integer('No decimal values allowed')
      .required('Required'),
    dateOfRegistrationMonth: Yup.string().required('Required'),
    dateOfRegistrationYear: Yup.number()
      .min(1900, 'Year must be in the range 1900-2020')
      .max(2020, 'Year must be in the range 1900-2020')
      .required('Required'),
    proofImage: Yup.mixed().required('Required'),
    activities: Yup.string()
      .min(1, 'Please fill in something about your organization')
      .max(2000, 'You have reached the limit of 2000 characters')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      registeredUnder: '',
      registrationNumber: '',
      dateOfRegistrationDay: '',
      dateOfRegistrationMonth: '',
      dateOfRegistrationYear: '',
      proofImage: null,
      activities: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });
  return (
    <div>
      <Button
        type="secondary"
        circled
        iconLeft={<ChevronLeft />}
        onClick={handleBackToLandingOnClick}
        spaceAfter="normal"
      />
      <Text align="center" as="div" spaceAfter="largest">
        <Stack direction="column" align="center" justify="center" desktop={{ direction: 'row' }}>
          <Heading size="normal" weight="bold">
            I am a
          </Heading>
          <Heading size="normal" weight="bold">
            <HeadingColor>Non Profit Organization</HeadingColor>
          </Heading>
        </Stack>
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="loose">
          <Select
            label="Organization you are from"
            name="name"
            options={organizations}
            {...formik.getFieldProps('name')}
            error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
          />
          <ChoiceGroup
            name="registeredUnder"
            label="Declare who your organization registered under"
            {...formik.getFieldProps('registeredUnder')}
            error={formik.touched.registeredUnder && formik.errors.registeredUnder ? formik.errors.registeredUnder : ''}
            onChange={(event) => {
              formik.setFieldValue('registeredUnder', event.target.value);
            }}
          >
            <Radio
              label="Registry of Societies"
              value="registry_of_societies"
              checked={'registry_of_societies' === formik.values.registeredUnder}
            />
            <Radio
              label="Commissioner of Charities"
              value="commissioner_of_charities"
              checked={'commissioner_of_charities' === formik.values.registeredUnder}
            />
            <Radio
              label="Affiliated to the National Council of Social Service"
              value="affiliated_national_council_of_social_service"
              checked={'affiliated_national_council_of_social_service' === formik.values.registeredUnder}
            />
          </ChoiceGroup>
          <InputField
            label="Registration Number"
            name="registrationNumber"
            placeholder="Registration Number"
            error={
              formik.touched.registrationNumber && formik.errors.registrationNumber
                ? formik.errors.registrationNumber
                : ''
            }
            {...formik.getFieldProps('registrationNumber')}
          />

          <InputGroup
            label="Date of Registration"
            error={
              formik.touched.dateOfRegistrationDay ||
              formik.touched.dateOfRegistrationMonth ||
              formik.touched.dateOfRegistrationYear
                ? formik.errors.dateOfRegistrationDay ||
                  formik.errors.dateOfRegistrationMonth ||
                  formik.errors.dateOfRegistrationYear
                : ''
            }
            required
          >
            <InputField
              placeholder="DD"
              type="number"
              inputMode="numeric"
              maxValue={31}
              minValue={1}
              {...formik.getFieldProps('dateOfRegistrationDay')}
            />
            <Select options={months} placeholder="Month" {...formik.getFieldProps('dateOfRegistrationMonth')} />
            <InputField
              placeholder="YYYY"
              type="number"
              inputMode="numeric"
              {...formik.getFieldProps('dateOfRegistrationYear')}
            />
          </InputGroup>

          <InputFile
            label="Proof of registration"
            allowedFileTypes={['image/*', '.pdf']}
            {...formik.getFieldProps('proofImage')}
            error={formik.touched.proofImage && formik.errors.proofImage ? formik.errors.proofImage : ''}
            fileName={formik.values.proofImage ? formik.values.proofImage.name : ''}
            help={
              <div>
                Supported files: <strong>PNG, JPG, PDF</strong>
              </div>
            }
            onChange={(event) => {
              formik.setFieldValue('proofImage', event.currentTarget.files[0]);
            }}
          />

          <Textarea
            label="Organization activities"
            error={formik.touched.activities && formik.errors.activities ? formik.errors.activities : ''}
            placeholder="Give us a brief description of your organization activities"
            {...formik.getFieldProps('activities')}
          />

          <NextButtonContainer>
            <Button submit width="100px" asComponent={BlueButton}>
              Next
            </Button>
          </NextButtonContainer>
        </Stack>

        <Text as="div" align="right"></Text>
      </form>
    </div>
  );
};

export default withRouter(RegisterNpoOrganization);
