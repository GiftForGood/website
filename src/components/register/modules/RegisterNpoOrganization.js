import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import {
  Button,
  InputGroup,
  InputField,
  Select,
  Stack,
  Textarea,
  Text,
  Heading,
  Alert,
  TextLink,
} from '@kiwicom/orbit-components/lib';
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
import { months } from '../../../../utils/constants/month';
import styled from 'styled-components';
import BlueButton from '../../buttons/BlueButton';
import { colors } from '../../../../utils/constants/colors';
import api from '../../../../utils/api';
import moment from 'moment';

const currentYear = moment().year();
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
    dateOfRegistrationDay: Yup.number()
      .min(1, 'Day must be in the range 1-31')
      .max(31, 'Day must be in the range 1-31')
      .positive('Day must be in the range 1-31')
      .integer('No decimal values allowed')
      .required('Required'),
    dateOfRegistrationMonth: Yup.string().required('Required'),
    dateOfRegistrationYear: Yup.number()
      .min(1900, `Year must be in the range 1900-${currentYear}`)
      .max(currentYear, `Year must be in the range 1900-${currentYear}`)
      .required('Required'),
    activities: Yup.string()
      .min(1, 'Please fill in something about your organization')
      .max(2000, 'You have reached the limit of 2000 characters')
      .required('Required'),
    customDateValidation: Yup.boolean().test('Date Checker', 'Invalid Date', function (val) {
      const { dateOfRegistrationDay, dateOfRegistrationMonth, dateOfRegistrationYear } = this.parent;
      if (
        dateOfRegistrationDay === undefined ||
        dateOfRegistrationMonth === undefined ||
        dateOfRegistrationYear === undefined
      ) {
        return true;
      }
      let combineDate = dateOfRegistrationDay + '-' + dateOfRegistrationMonth + '-' + dateOfRegistrationYear;
      var date = moment(combineDate, 'D-MM-YYYY', true);
      let valid = date.isValid();
      return valid;
    }),
  });

  const formik = useFormik({
    initialValues: submittedForm || {
      name: '',
      registrationNumber: '',
      dateOfRegistrationDay: '',
      dateOfRegistrationMonth: '',
      dateOfRegistrationYear: '',
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
            <Select
              label="Organization you are from"
              name="name"
              options={organizations}
              placeholder="Organization"
              {...formik.getFieldProps('name')}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
            />
            {formik.touched.name && formik.errors.name ? null : (
              <TextLink size="small" type="secondary">
                Email us at support.giftforgood@gmail.com if your organization is not on the list.
              </TextLink>
            )}
          </Stack>

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
                  formik.errors.dateOfRegistrationYear ||
                  formik.errors.customDateValidation
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
