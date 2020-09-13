import React, { useState } from 'react';
import {
  Button,
  InputField,
  Stack,
  Heading,
  Card,
  CardSection,
  TextLink,
  InputFile,
  Alert,
  Text,
  Textarea,
} from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import BadgeStatus from './BadgeStatus';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@api';
import useUser from '@components/session/modules/useUser';

const Container = styled.div`
  width: 100%;

  ${media.tablet(css`
    width: 100%;
  `)};

  ${media.desktop(css`
    width: 50%;
  `)};
`;

const NpoApplicationPanel = () => {
  const user = useUser();
  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const validationSchema = Yup.object().shape({
    registrationNumber: Yup.string().required('Required'),
    activities: Yup.string()
      .min(1, 'Please fill in something about your organization')
      .max(2000, 'You have reached the limit of 2000 characters')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      registrationNumber: '',
      activities: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {},
  });

  return (
    <Container>
      <Card>
        <CardSection>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing="loose">
              <Heading>Your application</Heading>

              <BadgeStatus status={'pending'} />

              <InputField
                disabled
                label="Organization you are from"
                name="organization"
                placeholder="Organization"
                value={'abc'}
              />

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
            </Stack>
          </form>
        </CardSection>
      </Card>
    </Container>
  );
};

export default NpoApplicationPanel;
