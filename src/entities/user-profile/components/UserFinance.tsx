import React from 'react';
import 'media/css/bankCardTemplate.scss';
import BankCard from 'components/bankCard';
import { lengthLessThan, notEmptyString, useField, useForm } from '@shopify/react-form';
import helpers from 'helpers/index';
import { useGetUserPayment, useUpdateUserPayment } from 'queries/user.query';
import { useAuth } from 'AuthContext';
import { BlockStack, Box, Card, ContextualSaveBar, Form, FormLayout, InlineGrid, TextField, Text, Select, FooterHelp } from '@shopify/polaris';
import QuickSearchBank from 'components/quickSearchBank';

export default function UserFinance() {
  const { user } = useAuth();
  const { data: entity, isLoading } = useGetUserPayment();
  const { mutateAsync: updateUserPayment, isPending } = useUpdateUserPayment();

  const useFields = {
    bank_name: useField<string>({
      value: entity?.bank_name ?? '',
      validates: [
        (inputValue) => {
          if (inputValue) {
            if (helpers.isUTF8(inputValue)) {
              return 'Không được dùng mã Unicode trong trường này!';
            }
            if (/^[a-zA-Z0-9_]+$/.exec(inputValue) === null) {
              return 'Chỉ sử dụng chữ cái và số';
            }
          }
        },
      ],
    }),

    bank_owner_display_name: useField<string>({
      value: entity?.bank_owner_display_name ?? '',
      validates: [
        lengthLessThan(46, 'Tên không nên dài hơn 46 ký tự'),
        notEmptyString('Trường này được yêu cầu phải điền.'),
        (inputValue) => {
          if (helpers.isUTF8(inputValue)) {
            return 'Không được dùng mã Unicode trong trường này!';
          }
        },
      ],
    }),

    bank_owner_number_account: useField<string>({
      value: entity?.bank_owner_number_account ?? '',
      validates: [
        (inputValue) => {
          if (inputValue && inputValue.length > 1) {
            if (helpers.isUTF8(inputValue)) {
              return 'Không được dùng mã Unicode trong trường này!';
            }
            if (/^[a-z0-9_\.]+$/.exec(inputValue) === null) {
              return 'Chỉ sử dụng chữ cái, số và dấu chấm';
            }
          }
        },
      ],
    }),
    bank_owner_card_number: useField<string>({
      value: entity?.bank_owner_card_number ?? '',
      validates: [
        lengthLessThan(17, 'Chỉ nên ít hơn 16 ký tự'),
        (inputValue) => {
          if (inputValue && !helpers.isNumeric(inputValue)) return 'Số thẻ chỉ nên là các chữ số từ 0 tới 9';
        },
      ],
    }),
  };

  const {
    fields,
    submit,
    submitting,
    dirty,
    reset: resetForm,
  } = useForm({
    fields: useFields,
    async onSubmit(values) {
      try {
        await updateUserPayment({
          user_id: String(user?.user_id),
          bank_name: values.bank_name,
          bank_owner_card_number: values.bank_owner_card_number,
          bank_owner_display_name: values.bank_owner_display_name,
          bank_owner_number_account: values.bank_owner_number_account,
        }).catch((e: any) => {
          if (e.params !== undefined) {
            if (e.params.field !== undefined) {
              useFields[e.params.field].setError(e.message);
            }
          }
        });
      } catch (e: any) {
        console.error(`Submit error`, e);
      }
      return { status: 'success', errors: [] };
    },
  });

  return (
    <>
      {dirty && (
        <ContextualSaveBar
          message="Thay đổi chưa được lưu"
          saveAction={{
            content: 'Cập nhật',
            onAction: () => submit(),
            loading: submitting,
          }}
          discardAction={{
            content: 'Xóa hết',
            onAction: () => resetForm(),
          }}
        />
      )}

      <Form onSubmit={submit}>
        <BlockStack gap={{ xs: '800', sm: '400' }}>
          <InlineGrid columns={{ xs: '1fr', md: '3fr 5fr' }} gap="400">
            <BlockStack gap="300" inlineAlign="center">
              <BankCard
                name_of_bank={fields.bank_name.value}
                card_number={fields.bank_owner_card_number.value}
                account_number={fields.bank_owner_number_account.value}
                name_on_card={fields.bank_owner_display_name.value}
                valid_date={new Date()}
              />
              <Text as="p" variant="bodySm">
                * Chúng tôi cần thông tin thanh toán của bạn để có thể thanh toán hoa hồng, chiết khấu, và các khoản khác.
              </Text>
            </BlockStack>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <FormLayout>
                  <QuickSearchBank current_bank_id={fields.bank_name.value} onClose={(bank_id) => fields.bank_name.onChange(bank_id)} />
                  <TextField autoFocus maxLength={46} autoComplete="off" label="Tên in trên thẻ" {...fields.bank_owner_display_name} />
                  <TextField
                    autoFocus
                    autoComplete="off"
                    label="Số tài khoản"
                    {...fields.bank_owner_number_account}
                    helpText={'Chấp nhận số hoặc chữ, nếu bạn không có số tài khoản, sử dụng số thẻ trường bên dưới.'}
                  />
                  <TextField autoFocus autoComplete="off" label="Số thẻ ATM (tùy chọn)" {...fields.bank_owner_card_number} />
                </FormLayout>
              </BlockStack>
            </Card>
          </InlineGrid>
        </BlockStack>
      </Form>
    </>
  );
}
