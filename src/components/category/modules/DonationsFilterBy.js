import React from 'react';
import { Button, InputField, Stack, Separator } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getLocations } from '@api/common/location';

const DonationsFilterBy = ({ onLatLngUpdated }) => {
  const validationSchema = Yup.object().shape({
    postalCode: Yup.string().matches(/\d{6}/, 'Invalid postal code'),
  });

  const formik = useFormik({
    initialValues: {
      postalCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmitPostalCode(values);
    },
  });

  const handleSubmitPostalCode = async (values) => {
    try {
      const { postalCode } = values;
      if (postalCode.trim().length > 0) {
        const postalCodeArray = [postalCode];
        const locations = await getLocations(postalCodeArray);
        if (locations.length > 0) {
          const latLng = `${locations[0].latitude},${locations[0].longitude}`;
          onLatLngUpdated(latLng);
        } else {
          onLatLngUpdated('');
        }
      } else {
        onLatLngUpdated('');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <BlackText style={{ marginBottom: '10px' }} size="large">
        Filter By
      </BlackText>
      <Separator />
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <InputField
            placeholder="postal code"
            label="Nearest - Furthest"
            error={formik.touched.postalCode && formik.errors.postalCode ? formik.errors.postalCode : ''}
            {...formik.getFieldProps('postalCode')}
          />
          <Button onClick={formik.handleSubmit}>Go</Button>
        </Stack>
      </form>
    </div>
  );
};

export default DonationsFilterBy;
