import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
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
} from '@kiwicom/orbit-components/lib';
import ProfileAvatar from '@components/imageContainers/ProfileAvatar';
import SaveChangesButton from '@components/buttons/SaveChangesButton';

// constants and utils
import * as Yup from 'yup';
import api from '@api';
import { MAXIMUM_FILE_SIZE_LIMIT } from '@constants/files';

// hooks
import { useFormik } from 'formik';
import useUser from '@components/session/modules/useUser';
import { useRouter } from 'next/router';

const Container = styled.div`
  width: 100%;

  ${media.tablet(css`
    width: 100%;
  `)};

  ${media.desktop(css`
    width: 50%;
  `)};
`;

const NpoEditProfilePanel = () => {
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
    const { name, contactNumber, profileImage } = values;
    try {
      const npoDoc = await api.users.updateNPO(name, contactNumber, profileImage);
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
    contactNumber: Yup.string()
      .required('Required')
      .matches(/^[6|8|9]\d{7}$/, 'Phone number is not valid'),
    profileImage: Yup.mixed(),
  });

  const formik = useFormik({
    initialValues: {
      name: user ? user.name : '',
      contactNumber: user ? user.contactNumber : '',
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

    if (file.size <= MAXIMUM_FILE_SIZE_LIMIT) {
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

                  <InputField
                    disabled={formik.isSubmitting}
                    {...formik.getFieldProps('contactNumber')}
                    label="Your Contact"
                    name="contactNumber"
                    placeholder="Your contact"
                    error={
                      formik.touched.contactNumber && formik.errors.contactNumber ? formik.errors.contactNumber : ''
                    }
                  />

                  <InputField
                    disabled
                    label="Your Email"
                    name="email"
                    placeholder="Your email"
                    value={user.email}
                    help={
                      <div>
                        Looking to change your email?{' '}
                        <TextLink external href="/contact">
                          Contact the administrators
                        </TextLink>
                      </div>
                    }
                  />
                  <InputField
                    disabled
                    label="Organization Name"
                    name="name"
                    placeholder="Your full name"
                    value={user.organization.name}
                  />

                  <InputField
                    disabled
                    label="Organization Address"
                    name="address"
                    placeholder="Address"
                    value={user.organization.address}
                  />

                  <InputField
                    disabled
                    label="Organization Contact"
                    name="contact"
                    placeholder="contact"
                    value={user.organization.contact}
                  />

                  <InputField
                    disabled
                    label="Organization Website"
                    name="website"
                    placeholder="website"
                    value={user.organization.website}
                  />

                  <div>
                    <Text size="small">
                      Looking to change the fields above?{' '}
                      <TextLink external href="/contact">
                        Contact the administrators
                      </TextLink>
                    </Text>
                  </div>

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

export default NpoEditProfilePanel;
