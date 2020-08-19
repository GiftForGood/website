import React, { useEffect, useState } from 'react';
import { Button, InputField, Stack, Heading, Card, CardSection, InputFile, Alert } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useUser from '../../../session/modules/useUser';
import ProfileAvatar from '../../../imageContainers/ProfileAvatar';
import api from '../../../../../utils/api';
import { useRouter } from 'next/router';
import SaveChangesButton from '../../../buttons/SaveChangesButton';

const Container = styled.div`
  width: 100%;

  ${media.tablet(css`
    width: 100%;
  `)};

  ${media.desktop(css`
    width: 50%;
  `)};
`;

const DonorEditProfilePanel = () => {
  const user = useUser();
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const handleFormSubmission = async (values) => {
    setIsLoading(true);
    setShowAlert(false);
    const { name, profileImage } = values;
    try {
      const donorDoc = await api.users.updateDonor(name, profileImage);
      setIsLoading(false);
      router.reload();
    } catch (error) {
      setIsLoading(true);
      formik.setSubmitting(false);
      displayAlert('Error', error.message, 'critical');
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    profileImage: Yup.mixed(),
  });

  const formik = useFormik({
    initialValues: {
      name: user ? user.name : '',
      profileImage: null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  const handleUploadProfileImage = (file) => {
    if (!file) {
      return;
    }

    if (file.size <= 25000000) {
      formik.setFieldValue('profileImage', file);
    } else {
      formik.setFieldError('profileImage', 'Unable to upload images that are more than 25mb');
    }
  };

  useEffect(() => {
    if (formik.values.profileImage) {
      const file = formik.values.profileImage;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [formik]);

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Card>
        <CardSection>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing="loose">
              <Heading>Edit Profile</Heading>

              <Stack>
                <Heading type="title2">Profile Picture</Heading>
                <ProfileAvatar imageUrl={profileImage || user.profileImageUrl.raw} height={100} width={100} />
                <InputFile
                  buttonLabel="Upload picture"
                  allowedFileTypes={['image/*']}
                  {...formik.getFieldProps('profileImage')}
                  error={formik.touched.profileImage && formik.errors.profileImage ? formik.errors.profileImage : ''}
                  fileName={formik.values.profileImage ? formik.values.profileImage.name : ''}
                  onChange={(event) => handleUploadProfileImage(event.currentTarget.files[0])}
                />
              </Stack>

              <Stack>
                <Heading type="title2">Public Profile</Heading>

                <Stack spacing="loose" spaceAfter="normal">
                  <InputField
                    disabled={formik.isSubmitting}
                    {...formik.getFieldProps('name')}
                    label="Your Name"
                    name="name"
                    placeholder="Your full name"
                    error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                  />

                  <Button
                    asComponent={SaveChangesButton}
                    submit
                    fullWidth={true}
                    disabled={formik.isSubmitting || !formik.dirty}
                    loading={isLoading}
                  >
                    Save changes
                  </Button>
                </Stack>
              </Stack>

              {showAlert ? (
                <Alert icon title={alertTitle} type={alertType}>
                  {alertDescription}
                </Alert>
              ) : null}
            </Stack>
          </form>
        </CardSection>
      </Card>
    </Container>
  );
};

export default DonorEditProfilePanel;
