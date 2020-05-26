import React from 'react';
import { Button, InputField, Stack, Heading, Card, CardSection, TextLink } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useUser from '../../../session/modules/useUser';
import ProfileAvatar from '../../../imageContainers/ProfileAvatar';

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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    mobileNumber: Yup.string()
      .required('Required')
      .matches(/^[6|8|9]\d{7}$/, 'Phone number is not valid'),
  });

  const formik = useFormik({
    initialValues: {
      name: user ? user.name : '',
      contactNumber: user ? user.contactNumber : '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // handleFormSubmission(values);
    },
  });

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Card>
        <CardSection>
          <Stack spacing="loose">
            <Heading>Edit Profile</Heading>

            <Stack>
              <Heading type="title2">Profile Picture</Heading>
              <ProfileAvatar imageUrl={user.profileImageUrl} height={100} width={100} />
              <Button size="small">Upload picture</Button>
            </Stack>

            <Stack>
              <Heading type="title2">Public Profile</Heading>
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing="loose" spaceAfter="normal">
                  <InputField
                    disabled={formik.isSubmitting}
                    label="Your Name"
                    name="name"
                    placeholder="Your full name"
                    error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                    {...formik.getFieldProps('name')}
                  />

                  <InputField
                    disabled={formik.isSubmitting}
                    label="Your Contact"
                    name="contactNumber"
                    placeholder="Your contact"
                    error={
                      formik.touched.contactNumber && formik.errors.contactNumber ? formik.errors.contactNumber : ''
                    }
                    {...formik.getFieldProps('contactNumber')}
                  />

                  <InputField
                    disabled
                    label="Your Email"
                    name="email"
                    placeholder="Your email"
                    value={user.email}
                    help={
                      <div>
                        Looking to change your email? <TextLink>Contact the administrators</TextLink>
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

                  <Button submit fullWidth={true} disabled={formik.isSubmitting || !formik.dirty}>
                    Save changes
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </CardSection>
      </Card>
    </Container>
  );
};

export default NpoEditProfilePanel;
