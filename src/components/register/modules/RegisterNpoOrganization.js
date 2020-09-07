import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import { Button, InputField, Textarea, Text, Heading, Alert, TextLink, Stack } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  setIsNpoDetails,
  setIsBackToLanding,
  setNpoOrganizationDetails,
  clearNpoOrganizationDetails,
} from '../actions';
import { getOrganization } from '../selectors';
import styled from 'styled-components';
import BlueButton from '../../buttons/BlueButton';
import { colors } from '@constants/colors';
import api from '@api';
import NpoOrganizationDropdownField from '../../inputfield/NpoOrganizationDropdownField';
import { newOrganizationGoogleFormPath } from '@constants/googleFormPaths';

const HeadingColor = styled.div`
  color: ${colors.npoBackground};
`;

const NextButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const RegisterNpoOrganization = () => {
  const dispatch = useDispatch();
  const [organizations, setOrganizations] = useState([]);
  const submittedForm = useSelector(getOrganization);

  useEffect(() => {
    getAllOrganizations();
  }, []);

  const handleBackToLandingOnClick = () => {
    dispatch(setIsBackToLanding());
    dispatch(clearNpoOrganizationDetails());
  };

  const handleFormSubmission = (values) => {
    dispatch(setNpoOrganizationDetails(values));
    dispatch(setIsNpoDetails());
  };

  const getAllOrganizations = () => {
    api.npoOrganization.getAll().then((snapshot) => {
      let parsedOrganizations = [];
      snapshot.forEach((doc) => {
        let obj = {
          label: doc.data().name,
          value: doc.data().name,
        };
        parsedOrganizations.push(obj);
      });
      setOrganizations(parsedOrganizations);
    });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    registrationNumber: Yup.string().required('Required'),
    activities: Yup.string()
      .min(1, 'Please fill in something about your organization')
      .max(2000, 'You have reached the limit of 2000 characters')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: submittedForm || {
      name: '',
      registrationNumber: '',
      activities: '',
    },
    enableReinitialize: true,
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
      <Alert
        icon
        title="Applying for a NPO account will subject to administrators approval. This approval can take up to 3 to 5 working days."
        spaceAfter="normal"
      />
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="loose">
          <Stack spacing="none">
            <NpoOrganizationDropdownField
              onSelected={(name) => {
                formik.setFieldValue('name', name);
              }}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
              label="Organization you are from"
              options={organizations}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? null : (
              <TextLink size="small" type="secondary" external href={newOrganizationGoogleFormPath}>
                Click here if your organization is not on the list.
              </TextLink>
            )}
          </Stack>

          <InputField
            label="Registration Number (UEN)"
            name="registrationNumber"
            placeholder="Registration Number"
            error={
              formik.touched.registrationNumber && formik.errors.registrationNumber
                ? formik.errors.registrationNumber
                : ''
            }
            {...formik.getFieldProps('registrationNumber')}
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
      </form>
    </div>
  );
};

export default withRouter(RegisterNpoOrganization);
