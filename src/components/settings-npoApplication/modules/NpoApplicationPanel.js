import React, { useState, useEffect } from 'react';
import { Button, InputField, Stack, Heading, Card, CardSection, Alert, Textarea } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import BadgeStatus from './BadgeStatus';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@api';
import useUser from '@components/session/modules/useUser';
import { STATUS } from '@constants/npoApplication';
import SaveChangesButton from '@components/buttons/SaveChangesButton';

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
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState(null);

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(null);
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

  const handleUpdate = async (values) => {
    setIsLoading(true);
    const { registrationNumber, activities } = values;
    try {
      await api.users.updateNPOVerification(registrationNumber, activities);
      displayAlert('Successfully resubmitted!', `Please wait up to 3 to 5 working days for approval.`, 'success');
    } catch (error) {
      console.error(error);
      formik.setSubmitting(false);
      displayAlert('Error', error.message, 'critical');
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      registrationNumber: application?.organization?.uen,
      activities: application?.organization?.activities,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  useEffect(() => {
    if (user) {
      api.users.getNPOVerification(user.userId).then((snapshot) => {
        if (snapshot.exists) {
          const app = snapshot.data();
          setApplication(app);
          if (app.status === 'accepted') {
            displayAlert(
              'Accepted',
              'Your application have been accepted by the administrator of GiftforGood',
              'success'
            );
          } else if (app.status === 'resubmission') {
            displayAlert(
              'Resubmission required',
              'Your application requires additional information. Please update your UEN if its wrong or tell us more about your organization',
              'warning'
            );
          } else {
            displayAlert('No further action required', 'No further action required from your end', 'info');
          }
        }
      });
    }
  }, [user]);

  return (
    <Container>
      <Card>
        <CardSection>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing="loose">
              <Heading>Your application</Heading>

              {showAlert ? (
                <Alert icon title={alertTitle} type={alertType}>
                  {alertDescription}
                </Alert>
              ) : null}

              <BadgeStatus status={application?.status} />

              <InputField
                disabled
                label="Organization you are from"
                name="organization"
                placeholder="Organization"
                value={application?.organization?.name}
              />

              <InputField
                disabled={application?.status !== STATUS.RESUBMISSION}
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
                disabled={application?.status !== STATUS.RESUBMISSION}
                label="Organization activities"
                error={formik.touched.activities && formik.errors.activities ? formik.errors.activities : ''}
                placeholder="Give us a brief description of your organization activities"
                {...formik.getFieldProps('activities')}
              />

              <Button
                asComponent={SaveChangesButton}
                submit
                fullWidth={true}
                disabled={formik.isSubmitting || !formik.dirty || application?.status !== STATUS.RESUBMISSION}
                loading={isLoading}
              >
                Save changes
              </Button>
            </Stack>
          </form>
        </CardSection>
      </Card>
    </Container>
  );
};

export default NpoApplicationPanel;
