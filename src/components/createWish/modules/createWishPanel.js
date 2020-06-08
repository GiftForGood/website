import React, { useEffect, useState } from 'react';
import {
  Button,
  InputField,
  Stack,
  Heading,
  Tag,
  Card,
  CardSection,
  Textarea,
  Popover,
  ListChoice,
  TextLink,
  Alert,
  Tooltip,
} from '@kiwicom/orbit-components/lib';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../../../utils/api';
import RedButton from '../../buttons/RedButton';

import styled from 'styled-components';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

import { setTitle, setDescription, setAllCategories } from '../actions';
import LivePreviewPanel from './livePreviewPanel';
import { useRouter } from 'next/router';

import { getExpireWishDate } from '../../../../utils/api/time';
import GooglePlacesAutoCompleteField from '../../inputfield/GooglePlacesAutoCompleteField';

const Container = styled.div`
  min-width: 300px;
  width: 100%;
`;

const CreateWishPanel = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDesktop } = useMediaQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const handleFormSubmission = async (values) => {
    try {
      setShowAlert(false);
      setIsLoading(true);
      let title = values.title;
      let description = values.description;
      let categoryIds = values.categories.map((category) => category.id);
      let locations = [values.location];
      const wishDoc = await api.wishes.create(title, description, categoryIds, locations);
      let wishId = wishDoc.data().wishId;
      router.push(`/wishes/${wishId}`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      formik.setSubmitting(false);
      if (error.code === 'wish/invalid-current-user') {
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
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      categories: [],
      location: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  const fetchCategories = () => {
    api.categories.getAll().then((categoriesDocs) => {
      let categories = [];
      categoriesDocs.forEach((categoryDoc) => {
        categories.push(categoryDoc.data());
      });
      setCategories(categories);
    });
  };

  useEffect(() => {
    if (formik) {
      dispatch(setTitle(formik.values.title));
      dispatch(setDescription(formik.values.description));
      dispatch(setAllCategories(formik.values.categories));
    }
  }, [formik, dispatch]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const onChoiceClicked = (category) => {
    // Allow only 3 categories
    if (!selectedCategories.includes(category) && selectedCategories.length <= 2) {
      setSelectedCategories([...selectedCategories, category]);
      formik.setFieldValue('categories', [...selectedCategories, category]);
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
          <ListChoice title={category.name} key={category.id} onClick={() => onChoiceClicked(category)} />
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
      <Container>
        <Card>
          <CardSection expanded>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing="extraLoose">
                <Heading>Create a wish</Heading>
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
                  help={
                    <div>
                      <TextLink type="secondary">Click here to find out how you can write better</TextLink>
                    </div>
                  }
                />

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

                <InputField
                  disabled={true}
                  label="Expire at"
                  name="expireAt"
                  placeholder="Expire at"
                  value={getExpireWishDate()}
                  help={'Your wish will be automatically removed after this date.'}
                />

                <GooglePlacesAutoCompleteField
                  label={'Centre Location'}
                  formik={formik}
                  storeLocally={true}
                  help={'The most recently used address will be stored on device.'}
                  storageKey={'location_wish'}
                />

                {isDesktop ? null : <LivePreviewPanel />}

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
      </Container>
    </>
  );
};

export default CreateWishPanel;
