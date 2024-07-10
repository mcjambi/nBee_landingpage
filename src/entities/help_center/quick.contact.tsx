import { Banner, BlockStack, Button, Form, FormLayout, Select, TextField, Image } from '@shopify/polaris';
import { lengthLessThan, lengthMoreThan, notEmpty, useField, useForm } from '@shopify/react-form';
import axios from 'axios';
import __helpers from 'helpers/index';
import __ from 'languages/index';
import React, { useCallback, useState } from 'react';
const quickContactHelpBanner = require('media/images/quick-contact-help-banner.png');

export default function QuickContactForm() {
  const [showBanner, setShowBanner] = useState(false);
  const clearBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  const useFields = {
    contactform_category: useField<string>({
      value: 'general',
      validates: [],
    }),

    contactform_title: useField<string>({
      value: '',
      validates: [
        notEmpty(__('this_field_cannot_be_left_blank')),
        lengthLessThan(550, __('Cannot be longer than 255 characters')),
        lengthMoreThan(2, __('Cannot be shorter than 2 characters')),
      ],
    }),
    contactform_content: useField<string>({
      value: '',
      validates: [
        notEmpty(__('this_field_cannot_be_left_blank')),
        lengthLessThan(550, __('Cannot be longer than 550 characters')),
        lengthMoreThan(2, __('Cannot be shorter than 2 characters')),
      ],
    }),
    contactform_email: useField<string>({
      value: '',
      validates: [
        (inputVal) => {
          if (!__helpers.isEmail(inputVal)) return __('email_invalid');
        },
      ],
    }),
    contactform_name: useField<string>({
      value: '',
      validates: [
        notEmpty(__('this_field_cannot_be_left_blank')),
        lengthLessThan(150, __('Cannot be longer than 550 characters')),
        lengthMoreThan(2, __('Cannot be shorter than 2 characters')),
      ],
    }),
  };

  const {
    fields,
    submit,
    submitting,
    dirty,
    reset: resetForm,
    submitErrors,
    makeClean,
  } = useForm({
    fields: useFields,
    async onSubmit(values) {
      try {
        axios
          .post(
            process.env.REACT_APP_BACKEND_URL + '/contactform',
            {
              contactform_category: values.contactform_category,
              contactform_title: values.contactform_title,
              contactform_content: values.contactform_content,
              contactform_email: values.contactform_email,
              contactform_name: values.contactform_name,
            },
            {
              headers: {
                'X-Passport': (window as any).__passport,
                'X-Passport-Verified': (window as any).__passport_verified,
                'X-Passport-With-Key': (window as any).__passport_with_key,
              },
            }
          )
          .then((r) => {
            setShowBanner(true);
            resetForm();
          })
          .catch((e) => {});
        return { status: 'success' };
      } catch (e: any) {
        console.error(`Submit error`, e);
      }
    },
  });

  return (
    <>
      <div className="help-header">
        <Image alt={''} source={quickContactHelpBanner} />
        <h1>{__('quick-contact')}</h1>
      </div>

      <Form onSubmit={undefined}>
        {showBanner && (
          <Banner title={__('information_title')} onDismiss={clearBanner}>
            <p>{__('we_received_your_information_thank_you')}</p>
          </Banner>
        )}

        <br />

        <BlockStack gap="200">
          <Select
            label={__('contact_department_label')}
            options={[
              { label: __('contact_general_department'), value: 'general' },
              { label: __('contact_technical_department'), value: 'technical' },
              { label: __('contact_sale_department'), value: 'sale' },
              { label: __('contact_accounting_department'), value: 'accountant' },
              { label: __('contact_manager_department'), value: 'manager' },
            ]}
            onChange={(v) => fields.contactform_category.onChange(v)}
            value={String(fields.contactform_category.value)}
          />

          <TextField label={__('contact_title_input_label')} autoComplete="off" {...fields.contactform_title} />

          <FormLayout.Group>
            <TextField type="text" label={__('contact_name_label')} {...fields.contactform_name} autoComplete="off" />
            <TextField type="text" label={__('contact_email_label')} {...fields.contactform_email} autoComplete="off" />
          </FormLayout.Group>

          <TextField
            type="text"
            multiline={5}
            maxLength={550}
            label={__('contact_content_label')}
            {...fields.contactform_content}
            showCharacterCount
            autoComplete="off"
          />

          <Button variant="primary" loading={submitting} onClick={submit}>
            {__('send_your_contact_information')}
          </Button>
        </BlockStack>
      </Form>
    </>
  );
}
