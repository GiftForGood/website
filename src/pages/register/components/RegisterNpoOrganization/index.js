import React from 'react';
import styled from 'styled-components';

// hoc
import { withRouter } from 'next/router';

// components
import { Button, InputField, Textarea, Text, Heading, Alert, TextLink, Stack } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';
import BlueButton from '@components/buttons/BlueButton';
import NpoOrganizationDropdownField from '@components/inputfield/NpoOrganizationDropdownField';

// hooks
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';

// constants and utils
import * as Yup from 'yup';
import { colors } from '@constants/colors';
import { newOrganizationGoogleFormPath } from '@constants/googleFormPaths';

// redux
import {
  // actions
  setIsNpoDetails,
  setIsBackToLanding,
  setNpoOrganizationDetails,
  clearNpoOrganizationDetails,
  // selectors
  getOrganization,
} from '../../redux';

const HeadingColor = styled.div`
  color: ${colors.primaryBlue.background};
`;

const NextButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const RegisterNpoOrganization = () => {
  const dispatch = useDispatch();
  const submittedForm = useSelector(getOrganization);

  const handleBackToLandingOnClick = () => {
    dispatch(setIsBackToLanding());
    dispatch(clearNpoOrganizationDetails());
  };

  const handleFormSubmission = (values) => {
    dispatch(setNpoOrganizationDetails(values));
    dispatch(setIsNpoDetails());
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
