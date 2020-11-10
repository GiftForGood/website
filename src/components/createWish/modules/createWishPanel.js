import React, { useEffect, useState, useContext } from 'react';
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
  Checkbox,
} from '@kiwicom/orbit-components/lib';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@api';
import RedButton from '../../buttons/RedButton';

import styled from 'styled-components';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

import { setTitle, setDescription, setAllCategories, setPostedDateTime, setSeasonalEvent } from '../actions';
import LivePreviewPanel from './livePreviewPanel';
import { useRouter } from 'next/router';

import { getExpireWishDate, getExpireWishDateFormat } from '@api/time';
import GooglePlacesAutoCompleteField from '../../inputfield/GooglePlacesAutoCompleteField';
import { logSuccessfullyCreatedWish } from '@utils/analytics';
import ExpirePostAlert from './ExpirePostAlert';
import WishContext from '../context';
import useUser from '@components/session/modules/useUser';
import { createdWish } from '@utils/algolia/insights';

import { remoteConfig } from '@utils/firebase';

const Container = styled.div`
  min-width: 300px;
  width: 100%;
`;

const CreateWishPanel = ({ wish, mode }) => {
  const router = useRouter();
  const { isDesktop } = useMediaQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editWish, setEditWish] = useState(null);

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useContext(WishContext);

  const [seasonal, setSeasonal] = useState(null);

  const user = useUser();

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const handleFormSubmission = async (values) => {
    if (mode === 'create') {
      handleCreateWish(values);
    } else if (mode === 'edit') {
      handleUpdateWish(values);
    }
  };

  const handleCreateWish = async (values) => {
    try {
      setShowAlert(false);
      setIsLoading(true);
      let title = values.title;
      let description = values.description;
      let categoryIds = values.categories.map((category) => category.id);
      let locations = [values.location];
      let isSeasonal = values.seasonal;
      let wishDoc;
      if (isSeasonal) {
        description += `\n\n${seasonal.hashtag}`;
        wishDoc = await api.wishes.create(
          title,
          description,
          categoryIds,
          locations,
          seasonal.key,
          seasonal.name,
          seasonal.imageUrl,
          seasonal.hashtag
        );
      } else {
        wishDoc = await api.wishes.create(title, description, categoryIds, locations);
      }
      let wishId = wishDoc.data().wishId;
      logSuccessfullyCreatedWish();
      createdWish(user, wishId);
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

  const handleUpdateWish = async (values) => {
    try {
      setShowAlert(false);
      setIsLoading(true);
      let id = wish.wishId;
      let title = values.title;
      let description = values.description;
      let categoryIds = values.categories.map((category) => category.id);
      let locations = [values.location];
      let isSeasonal = values.seasonal;
      let wishDoc;
      if (!editWish.seasonal && isSeasonal) {
        description += `\n\n${seasonal.hashtag}`;
        wishDoc = await api.wishes.update(
          id,
          title,
          description,
          categoryIds,
          locations,
          seasonal.key,
          seasonal.name,
          seasonal.imageUrl,
          seasonal.hashtag
        );
      } else if (editWish.seasonal && isSeasonal) {
        wishDoc = await api.wishes.update(
          id,
          title,
          description,
          categoryIds,
          locations,
          wish.event.key,
          wish.event.name,
          wish.event.imageUrl,
          wish.event.hashtag
        );
      } else {
        wishDoc = await api.wishes.update(id, title, description, categoryIds, locations);
      }
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
    seasonal: Yup.boolean().required('Required'),
  });

  const formik = useFormik({
    initialValues: editWish || {
      title: '',
      description: '',
      categories: [],
      location: '',
      seasonal: false,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
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

  // Used to update LivePreviewPanel
  useEffect(() => {
    if (formik) {
      dispatch(setTitle(formik.values.title));
      dispatch(setDescription(formik.values.description));
      dispatch(setAllCategories(formik.values.categories));
      dispatch(setPostedDateTime(wish ? wish.postedDateTime : Date.now()));
      dispatch(setSeasonalEvent(formik.values.seasonal ? seasonal : null));
    }
  }, [formik.values, seasonal]);

  // Used to fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch seasonal
  useEffect(() => {
    remoteConfig.fetchAndActivate().then(() => {
      const currentEventString = remoteConfig.getValue('currentEvent').asString();
      if (currentEventString) {
        const currentEvent = JSON.parse(currentEventString);
        setSeasonal(currentEvent);
      }
    });
  }, []);

  // Used to edit wishes
  useEffect(() => {
    if (wish) {
      let editWish = {
        title: wish.title,
        description: wish.description,
        categories: wish.categories,
        location: wish.locations[0].fullAddress,
        seasonal: wish.event ? true : false,
      };
      setEditWish(editWish);
      setSelectedCategories(wish.categories);
    }
  }, [wish]);

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
                      <TextLink type="secondary" href="/blog/how-to-write-better-wishes">
                        Click here to find out how you can write better
                      </TextLink>
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
                  value={wish && mode === 'edit' ? getExpireWishDateFormat(wish.expireDateTime) : getExpireWishDate()}
                  help={'Your wish will be automatically removed after this date.'}
                />

                <ExpirePostAlert />

                <GooglePlacesAutoCompleteField
                  label={'Centre Location'}
                  storeLocally={true}
                  help={'The most recently used address will be stored on device.'}
                  storageKey={'location_wish'}
                  onChange={(location) => {
                    formik.setFieldValue('location', location);
                  }}
                  error={formik.touched.location && formik.errors.location ? formik.errors.location : ''}
                  disabled={formik.isSubmitting}
                />

                {seasonal ? (
                  <Checkbox
                    label={seasonal.question}
                    info={seasonal.help}
                    onChange={formik.handleChange}
                    name="seasonal"
                    checked={formik.values.seasonal}
                  />
                ) : null}

                {isDesktop ? null : <LivePreviewPanel />}

                <Button fullWidth submit asComponent={RedButton} disabled={formik.isSubmitting} loading={isLoading}>
                  {mode === 'create' ? 'Post it' : 'Update'}
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
