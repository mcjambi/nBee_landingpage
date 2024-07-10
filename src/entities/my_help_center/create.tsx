import { BlockStack, Form, Modal, Select, TextField } from '@shopify/polaris';
import React, { useEffect } from 'react';
import { useGetContactform, useCreateContactform } from 'queries/contactform.query';
import { lengthLessThan, lengthMoreThan, notEmpty, useField, useForm } from '@shopify/react-form';
import __ from 'languages/index';
import __helpers from 'helpers/index';

export default function CreateHelpModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const { mutateAsync: createEntity, isSuccess } = useCreateContactform();

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
        await createEntity({
          contactform_category: values.contactform_category,
          contactform_title: values.contactform_title,
          contactform_content: values.contactform_content,
        })
          .then((r) => {
            resetForm();
          })
          .catch((e) => {});
        return { status: 'success' };
      } catch (e: any) {
        console.error(`Submit error`, e);
      }
    },
  });

  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess]);

  return (
    <Modal open={show} title={'Tạo mới một yêu cầu'} onClose={onClose} primaryAction={{ content: __('save_button_label'), onAction: () => submit() }}>
      <Modal.Section>
        <Form onSubmit={() => submit()}>
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

            <TextField
              type="text"
              multiline={5}
              maxLength={550}
              label={__('contact_content_label')}
              {...fields.contactform_content}
              showCharacterCount
              autoComplete="off"
            />
          </BlockStack>
        </Form>
      </Modal.Section>
    </Modal>
  );
}
