import React, { useState, useEffect, useContext } from 'react';
import RedButton from '../../buttons/RedButton';
import {
  Button,
  InputField,
  Stack,
  Tag,
  Card,
  CardSection,
  Textarea,
  Popover,
  ListChoice,
  Alert,
  InputGroup,
  Select,
  Radio,
  ChoiceGroup,
} from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { months } from '@constants/month';
import api from '@api';
import DragNDropInputField from './DragNDropInputField';
import moment from 'moment';
import LivePreviewDonation from './livePreviewDonation';
import { useDispatch } from 'react-redux';
import {
  setTitle,
  setDescription,
  setAllCategories,
  setCoverImage,
  setItemCondition,
  setValidFrom,
  setValidTo,
  resetToInitialState,
} from '../actions';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { toast } from 'react-toastify';
import ToastContainer from '../../toast/ToastContainer';
import { useRouter } from 'next/router';
import { getDay, getMonth, getYear } from '@api/time';
import { v4 as uuidv4 } from 'uuid';
import MrtDropdownField from '../../inputfield/MrtDropdownField';
import { logSuccessfullyCreatedDonation } from '@utils/analytics';
import DonationContext from '../context';

const Container = styled.div`
  min-width: 300px;
  width: 100%;
`;

const LeftPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const currentYear = moment().year();

const validateDate = (day, month, year) => {
  const date = `${day}-${month}-${year}`;
  const dateMoment = moment(date, 'DD-MM-YYYY');
  const today = moment();

  if (dateMoment.diff(today, 'days') < 0) {
    return false;
  }
  return true;
};

const validateDateRange = (fromDay, fromMonth, fromYear, toDay, toMonth, toYear) => {
  const fromDate = `${fromDay}-${fromMonth}-${fromYear}`;
  const toDate = `${toDay}-${toMonth}-${toYear}`;

  const fromDateMoment = moment(fromDate, 'DD-MM-YYYY');
  const toDateMoment = moment(toDate, 'DD-MM-YYYY');

  if (toDateMoment.diff(fromDateMoment, 'days') < 1) {
    return false;
  }
  return true;
};

const CreateDonationPanel = ({ mode, donation }) => {
  const { state, dispatch } = useContext(DonationContext);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { isDesktop } = useMediaQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [editDonation, setEditDonation] = useState(null);

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const [images, setImages] = useState(null);

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const fetchCategories = () => {
    api.categories.getAll().then((categoriesDocs) => {
      const categories = categoriesDocs.docs.map((categoryDoc) => categoryDoc.data());
      setCategories(categories);
    });
  };

  const handleFormSubmission = async (values) => {
    if (mode === 'create') {
      handleCreateDonation(values);
    } else if (mode === 'edit') {
      handleEditDonation(values);
    }
  };

  const handleCreateDonation = async (values) => {
    try {
      setShowAlert(false);
      setIsLoading(true);
      const {
        title,
        description,
        validFromDay,
        validFromMonth,
        validFromYear,
        validToDay,
        validToMonth,
        validToYear,
        dimensions,
        location,
        itemCondition,
        categories,
        selectedImages,
      } = values;
      const coverImage = selectedImages[0];
      const categoryIds = categories.map((category) => category.id);
      const donationDoc = await api.donations.create(
        title,
        description,
        categoryIds,
        validFromDay,
        validFromMonth,
        validFromYear,
        validToDay,
        validToMonth,
        validToYear,
        dimensions,
        [location],
        itemCondition,
        coverImage,
        selectedImages
      );
      const donationId = donationDoc.data().donationId;
      logSuccessfullyCreatedDonation();
      router.push(`/donations/${donationId}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      formik.setSubmitting(false);
      if (error.code === 'donation/invalid-current-user') {
        displayAlert('Invalid current user', error.message, 'critical');
      } else {
        displayAlert('Error', error.message, 'critical');
      }
    }
  };

  const handleEditDonation = async (values) => {
    try {
      setShowAlert(false);
      setIsLoading(true);
      const {
        title,
        description,
        validFromDay,
        validFromMonth,
        validFromYear,
        validToDay,
        validToMonth,
        validToYear,
        dimensions,
        location,
        itemCondition,
        categories,
        selectedImages,
      } = values;
      const id = donation.donationId;

      const categoryIds = categories.map((category) => category.id);
      const images = selectedImages.map((img) => {
        if (img.lastModified === undefined) {
          return img.preview;
        }
        return img;
      });
      const coverImage = images[0];
      const donationDoc = await api.donations.update(
        id,
        title,
        description,
        categoryIds,
        validFromDay,
        validFromMonth,
        validFromYear,
        validToDay,
        validToMonth,
        validToYear,
        dimensions,
        [location],
        itemCondition,
        coverImage,
        images
      );
      const donationId = donationDoc.data().donationId;
      router.push(`/donations/${donationId}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      formik.setSubmitting(false);
      if (error.code === 'donation/invalid-current-user') {
        displayAlert('Invalid current user', error.message, 'critical');
      } else {
        displayAlert('Error', error.message, 'critical');
      }
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Required')
      .min(1, 'A title must be provided')
      .max(140, 'Title too long and exceeds 140 character limit'),
    description: Yup.string().required('Required'),
    categories: Yup.array()
      .required('Required')
      .min(1, 'A category must be provided')
      .max(3, 'Only 3 selected categories allowed'),
    location: Yup.string().required('Required'),
    validFromDay: Yup.number()
      .min(1, 'Day must be in the range 1-31')
      .max(31, 'Day must be in the range 1-31')
      .positive('Day must be in the range 1-31')
      .integer('No decimal values allowed')
      .required('Required'),
    validFromMonth: Yup.string().required('Required'),
    validFromYear: Yup.number().min(currentYear, `Year must start from ${currentYear}`).required('Required'),
    validToDay: Yup.number()
      .min(1, 'Day must be in the range 1-31')
      .max(31, 'Day must be in the range 1-31')
      .positive('Day must be in the range 1-31')
      .integer('No decimal values allowed')
      .required('Required'),
    validToMonth: Yup.string().required('Required'),
    validToYear: Yup.number()
      .min(currentYear, `Year must start from ${currentYear}`)

      .required('Required'),
    dimensions: Yup.string().max(140, 'Dimensions too long and exceeds 140 character limit'),
    itemCondition: Yup.string().required('Required'),
    customValidFromValidation: Yup.boolean().test('Date Checker', 'Invalid Date', function (val) {
      const { validFromDay, validFromMonth, validFromYear } = this.parent;
      if (validFromDay === undefined || validFromMonth === undefined || validFromYear === undefined) {
        return true;
      }
      let combineDate = validFromDay + '-' + validFromMonth + '-' + validFromYear;
      let date = moment(combineDate, 'D-MM-YYYY', true);
      let valid = date.isValid();
      return valid;
    }),
    customValidToValidation: Yup.boolean().test('Date Checker', 'Invalid Date', function (val) {
      const { validToDay, validToMonth, validToYear } = this.parent;
      if (validToDay === undefined || validToMonth === undefined || validToYear === undefined) {
        return true;
      }
      let combineDate = validToDay + '-' + validToMonth + '-' + validToYear;
      let date = moment(combineDate, 'D-MM-YYYY', true);
      let valid = date.isValid();
      return valid;
    }),
    customValidFromValidationMoreThanZeroDayFromToday: Yup.boolean().test(
      'More Than 0 day from Today',
      `Date is before today's date`,
      function (val) {
        const { validFromDay, validFromMonth, validFromYear } = this.parent;
        if (validFromDay === undefined || validFromMonth === undefined || validFromYear === undefined) {
          return true;
        }
        if (mode === 'create') {
          let isValidDate = validateDate(validFromDay, validFromMonth, validFromYear);
          return isValidDate;
        }
        return true;
      }
    ),
    customValidToValidationMoreThanZeroDayFromToday: Yup.boolean().test(
      'More Than 0 day from Today',
      `Date is before today's date`,
      function (val) {
        const { validToDay, validToMonth, validToYear } = this.parent;
        if (validToDay === undefined || validToMonth === undefined || validToYear === undefined) {
          return true;
        }
        let isValidDate = validateDate(validToDay, validToMonth, validToYear);
        return isValidDate;
      }
    ),
    customValidateDateRange: Yup.boolean().test(
      'Valid Date Range',
      'The valid period needs to be at least 1 day',
      function (val) {
        const { validFromDay, validFromMonth, validFromYear, validToDay, validToMonth, validToYear } = this.parent;
        if (
          validFromDay === undefined ||
          validFromMonth === undefined ||
          validFromYear === undefined ||
          validToDay === undefined ||
          validToMonth === undefined ||
          validToYear === undefined
        ) {
          return true;
        }

        let isValidDateRange = validateDateRange(
          validFromDay,
          validFromMonth,
          validFromYear,
          validToDay,
          validToMonth,
          validToYear
        );
        return isValidDateRange;
      }
    ),
    selectedImages: Yup.array()
      .required('Required')
      .min(1, 'An image must be provided')
      .max(4, 'Only 4 selected images allowed'),
  });

  const formik = useFormik({
    initialValues: editDonation || {
      title: '',
      description: '',
      validFromDay: '',
      validFromMonth: '',
      validFromYear: '',
      validToDay: '',
      validToMonth: '',
      validToYear: '',
      dimensions: '',
      location: '',
      itemCondition: '',
      categories: [],
      selectedImages: [],
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formik) {
      dispatch(setTitle(formik.values.title));
      dispatch(setDescription(formik.values.description));
      dispatch(setAllCategories(formik.values.categories));
      dispatch(setCoverImage(formik.values.selectedImages[0]));
      dispatch(setItemCondition(formik.values.itemCondition));
      dispatch(
        setValidFrom(
          formik.values.validFromDay + '/' + formik.values.validFromMonth + '/' + formik.values.validFromYear
        )
      );
      dispatch(
        setValidTo(formik.values.validToDay + '/' + formik.values.validToMonth + '/' + formik.values.validToYear)
      );
    }
  }, [formik.values]);

  // Used to edit donation
  useEffect(() => {
    if (donation) {
      let editDonation = {
        title: donation.title,
        description: donation.description,
        validFromDay: getDay(donation.validPeriodFrom),
        validFromMonth: getMonth(donation.validPeriodFrom),
        validFromYear: getYear(donation.validPeriodFrom),
        validToDay: getDay(donation.validPeriodTo),
        validToMonth: getMonth(donation.validPeriodTo),
        validToYear: getYear(donation.validPeriodTo),
        dimensions: donation.dimensions,
        location: donation.locations[0].name,
        itemCondition: donation.itemCondition,
        categories: donation.categories,
        selectedImages: donation.imageUrls.map((imageUrl) => ({
          preview: imageUrl.raw,
          id: uuidv4(),
        })),
      };
      setEditDonation(editDonation);
      setSelectedCategories(donation.categories);
      setImages(donation.imageUrls.map((imageUrl) => imageUrl.raw));
    } else {
      dispatch(resetToInitialState);
    }
  }, [donation]);

  const onChoiceClicked = (category) => {
    // Allow only 3 categories
    if (!selectedCategories.includes(category) && selectedCategories.length <= 2) {
      setSelectedCategories([...selectedCategories, category]);
      formik.setFieldValue('categories', [...selectedCategories, category]);
    } else {
      const remainingSelectedCategories = selectedCategories.filter((selectedCat) => selectedCat !== category);
      setSelectedCategories(remainingSelectedCategories);
      formik.setFieldValue('categories', remainingSelectedCategories);
    }
  };

  const onTagRemoveClicked = (category) => {
    if (selectedCategories.includes(category)) {
      let updatedSelectedCategories = selectedCategories.filter((value) => {
        return value !== category;
      });
      setSelectedCategories(updatedSelectedCategories);
      formik.setFieldValue('categories', updatedSelectedCategories);
    }
  };

  const CategoryListChoices = () => {
    return (
      <div>
        {categories.map((category) => (
          <ListChoice
            title={category.name}
            key={category.id}
            onClick={() => onChoiceClicked(category)}
            selectable
            selected={selectedCategories.includes(category)}
          />
        ))}
      </div>
    );
  };

  const SelectedCategoryTags = () => {
    return (
      <>
        {selectedCategories.map((category) => (
          <Tag selected key={category.id} onRemove={() => onTagRemoveClicked(category)}>
            {category.name}
          </Tag>
        ))}
      </>
    );
  };

  return (
    <>
      <LeftPanelContainer>
        <DragNDropInputField
          initialImages={images}
          onChange={(selectedImages) => {
            formik.setFieldValue('selectedImages', selectedImages);
          }}
          error={formik.touched.selectedImages && formik.errors.selectedImages ? formik.errors.selectedImages : ''}
        />
        {isDesktop ? <LivePreviewDonation /> : null}
      </LeftPanelContainer>

      <Container>
        <Card>
          <CardSection expanded>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing="extraLoose">
                <InputField
                  disabled={formik.isSubmitting}
                  label="Title"
                  name="title"
                  placeholder="Title"
                  error={formik.touched.title && formik.errors.title ? formik.errors.title : ''}
                  {...formik.getFieldProps('title')}
                  help="Allow 140 characters only"
                />

                <Textarea
                  disabled={formik.isSubmitting}
                  rows={10}
                  label="Description"
                  name="description"
                  placeholder="Description"
                  error={formik.touched.description && formik.errors.description ? formik.errors.description : ''}
                  {...formik.getFieldProps('description')}
                />

                <Stack
                  direction="column"
                  mediumMobile={{
                    direction: 'column',
                  }}
                  largeMobile={{
                    direction: 'column',
                  }}
                  tablet={{
                    direction: 'row',
                  }}
                >
                  <InputGroup
                    flex={['0 0 60px', '1 1 100%', '0 0 90px']}
                    label="Valid From"
                    error={
                      formik.touched.validFromDay || formik.touched.validFromMonth || formik.touched.validFromYear
                        ? formik.errors.validFromDay ||
                          formik.errors.validFromMonth ||
                          formik.errors.validFromYear ||
                          formik.errors.customValidFromValidation ||
                          formik.errors.customValidFromValidationMoreThanZeroDayFromToday ||
                          formik.errors.customValidateDateRange
                        : ''
                    }
                    required
                  >
                    <InputField
                      placeholder="DD"
                      type="number"
                      inputMode="numeric"
                      {...formik.getFieldProps('validFromDay')}
                    />
                    <Select options={months} placeholder="Month" {...formik.getFieldProps('validFromMonth')} />
                    <InputField
                      placeholder="YYYY"
                      type="number"
                      inputMode="numeric"
                      {...formik.getFieldProps('validFromYear')}
                    />
                  </InputGroup>

                  <InputGroup
                    flex={['0 0 60px', '1 1 100%', '0 0 90px']}
                    label="To"
                    error={
                      formik.touched.validToDay || formik.touched.validToMonth || formik.touched.validToYear
                        ? formik.errors.validToDay ||
                          formik.errors.validToMonth ||
                          formik.errors.validToYear ||
                          formik.errors.customValidToValidation ||
                          formik.errors.customValidToValidationMoreThanZeroDayFromToday ||
                          formik.errors.customValidateDateRange
                        : ''
                    }
                    required
                  >
                    <InputField
                      placeholder="DD"
                      type="number"
                      inputMode="numeric"
                      {...formik.getFieldProps('validToDay')}
                    />
                    <Select options={months} placeholder="Month" {...formik.getFieldProps('validToMonth')} />
                    <InputField
                      placeholder="YYYY"
                      type="number"
                      inputMode="numeric"
                      {...formik.getFieldProps('validToYear')}
                    />
                  </InputGroup>
                </Stack>

                <InputField
                  disabled={formik.isSubmitting}
                  label="Dimensions"
                  name="dimensions"
                  help="Allow 140 characters only"
                  error={formik.touched.dimensions && formik.errors.dimensions ? formik.errors.dimensions : ''}
                  {...formik.getFieldProps('dimensions')}
                />

                <MrtDropdownField
                  label={'Nearest MRT/LRT to you'}
                  onSelectedStation={(location) => {
                    formik.setFieldValue('location', location);
                  }}
                  error={formik.touched.location && formik.errors.location ? formik.errors.location : ''}
                  disabled={formik.isSubmitting}
                  value={formik.values.location}
                />

                <ChoiceGroup
                  name="itemCondition"
                  label="Item Condition"
                  {...formik.getFieldProps('itemCondition')}
                  error={formik.touched.itemCondition && formik.errors.itemCondition ? formik.errors.itemCondition : ''}
                  onChange={(event) => {
                    formik.setFieldValue('itemCondition', event.target.value);
                  }}
                >
                  <Radio label="New" value={'New'} checked={'New' === formik.values.itemCondition} />
                  <Radio label="Used" value={'Used'} checked={'Used' === formik.values.itemCondition} />
                </ChoiceGroup>

                <Popover content={<CategoryListChoices />} noPadding preferredPosition="bottom" width="250px">
                  <InputField
                    disabled={formik.isSubmitting}
                    label="Categories"
                    name="categories"
                    error={formik.touched.categories && formik.errors.categories ? formik.errors.categories : ''}
                    tags={selectedCategories.length > 0 ? <SelectedCategoryTags /> : false}
                    help={
                      <div>
                        Select up to <strong>3</strong> categories
                      </div>
                    }
                  />
                </Popover>

                {isDesktop ? null : <LivePreviewDonation />}

                <Button fullWidth submit asComponent={RedButton} disabled={formik.isSubmitting} loading={isLoading}>
                  Post it
                </Button>
              </Stack>
            </form>

            {showAlert ? (
              <Alert icon title={alertTitle} type={alertType}>
                {alertDescription}
              </Alert>
            ) : null}
          </CardSection>
        </Card>

        <ToastContainer position="bottom-left" autoClose={4000} hideProgressBar={true} closeButton={false} />
      </Container>
    </>
  );
};

export default CreateDonationPanel;
