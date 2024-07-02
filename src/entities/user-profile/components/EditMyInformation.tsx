import {
  Box,
  Form,
  Card,
  Divider,
  FormLayout,
  InlineGrid,
  Select,
  Text,
  TextField,
  BlockStack,
  useBreakpoints,
  ContextualSaveBar,
} from '@shopify/polaris';

import { useCallback, useEffect, useState } from 'react';

import helpers from 'helpers';
import diachinh from 'config/diachinh.json';
import MultiJob from 'components/multiJob';
import { lengthLessThan, lengthMoreThan, useField, useForm } from '@shopify/react-form';

import { USER_CAPACITY_LIST } from 'constant';
import DateTimeInput from 'components/dateTimeInput';
import { useAuth } from 'AuthContext';
import { useAddUserToJob, useUpdateProfile } from 'queries/user.query';
import { useNotification } from 'NotificationContext';
import __ from 'languages/index';

/**
 *   Create upload Modal for Notification
 */
export default function EditMyInformation() {
  const { user: entity } = useAuth();
  const { addNotification } = useNotification();

  const { mutateAsync: addUserToJob } = useAddUserToJob();

  const { smUp } = useBreakpoints();

  const { mutateAsync: updateProfile, isSuccess: updateProfileSuccess } = useUpdateProfile();

  useEffect(() => {
    if (updateProfileSuccess) {
      addNotification('info', __('updated_successfully'));
    }
  }, [updateProfileSuccess]);

  const userJobCallback = useCallback(
    (userJobList: string[]) => {
      addUserToJob({
        user_id: entity?.user_id,
        job_id: userJobList ? userJobList.join(',') : null,
      });
    },
    [entity]
  );

  let allRoles = [];
  for (let roles of USER_CAPACITY_LIST) {
    allRoles.push({
      label: roles,
      value: roles,
    });
  }

  const useFields = {
    user_login: useField<string>({
      value: entity?.user_login || '',
      validates: [
        lengthLessThan(60, 'Không được dài hơn 60 ký tự.'),
        lengthMoreThan(6, 'Không được ngắn hơn 6 ký tự.'),
        (inputValue) => {
          if (inputValue.length > 1) {
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

    user_email: useField<string>({
      value: entity?.user_email ?? '',
      validates: [
        (inputValue) => {
          if (inputValue && !helpers.isEmail(inputValue)) {
            return 'Your email is not valid!';
          }
        },
      ],
    }),

    display_name: useField<string>({
      value: entity?.display_name || '',
      validates: [lengthLessThan(60, 'Tên của bạn quá dài!'), lengthMoreThan(2, 'Tên của bạn quá ngắn!')],
    }),

    bio: useField<string>({
      value: entity?.bio || '',
      validates: [lengthLessThan(250, 'Mô tả quá dài!')],
    }),

    user_address: useField<string>({
      value: entity?.user_address || '',
      validates: [lengthLessThan(250, 'Mô tả quá dài!')],
    }),

    user_birthday: useField<string>({
      value: entity?.user_birthday ?? '',
      validates: [],
    }),

    user_phonenumber: useField<string>({
      value: entity?.user_phonenumber || '',
      validates: [
        (inputValue) => {
          if (inputValue) {
            if (!new RegExp('^[0-9]+$', 'g').test(inputValue)) {
              return 'Định dạng số điện thoại không hợp lệ. Chỉ dùng số và dấu cách!';
            }
          }
        },
      ],
    }),

    user_title: useField<string>({
      value: entity?.user_title || '',
      validates: [],
    }),

    user_address_city: useField<string>({
      value: entity?.user_address_city ?? '',
      validates: [],
    }),

    user_address_district: useField<string>({
      value: entity?.user_address_district ?? '',
      validates: [],
    }),

    user_address_ward: useField<string>({
      value: entity?.user_address_ward ?? '',
      validates: [],
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
        await updateProfile({
          user_id: entity?.user_id,
          user_login: values.user_login,
          display_name: values.display_name,
          bio: values.bio,
          user_title: values.user_title,
          user_address: values.user_address,
          user_address_city: values.user_address_city,
          user_address_district: values.user_address_district,
          user_address_ward: values.user_address_ward,
          user_phonenumber: values.user_phonenumber,
          user_birthday: values.user_birthday ?? undefined,
        })
          .then((e) => {
            resetForm();
          })
          .catch((e: any) => {
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

  /**
   * DDiaj chir
   */

  const user_address_city_selectType = useFields.user_address_city;
  const user_address_district_selectType = useFields.user_address_district;
  const user_address_ward_selectType = useFields.user_address_ward;

  /**
   * Địa chính
   * Chọn tỉnh, thành phố ...
   */
  const [diachinhCity, setDiachinhCity] = useState<string | undefined>(undefined);
  const [diachinhDistrict, setDiachinhDistrict] = useState<string | undefined>(undefined);
  const [diachinhDistrictList, setDiachinhDistrictList] = useState(undefined);
  const [diachinhWards, setDiachinhWards] = useState<string | undefined>(undefined);
  const [diachinhWardsList, setDiachinhWardsList] = useState(undefined);

  // set default value
  useEffect(() => {
    setDiachinhCity(entity?.user_address_city || undefined);
    setDiachinhDistrict(entity?.user_address_district || undefined);
    setDiachinhWards(entity?.user_address_ward || undefined);
  }, [entity]);

  const diachinhCityCallback = useCallback((_value: string) => {
    setDiachinhCity(_value);
    user_address_city_selectType.onChange(_value);
  }, []);
  const [diachinhCityList, setDiachinhCityList] = useState(null);

  useEffect(() => {
    let citys = [{ label: 'Chọn Tỉnh/thành phố', value: '' }];
    for (let _city in diachinh) {
      let city = diachinh[_city];
      // @ts-ignore
      citys.push({ label: city.name, value: city.code });
    }
    setDiachinhCityList(citys);
  }, []);

  /**
   * Địa chính
   * Chọn Quận Huyện
   */
  const diachinhDistrictCallback = useCallback((_value: string) => {
    setDiachinhDistrict(_value);
    user_address_district_selectType.onChange(_value);
  }, []);

  useEffect(() => {
    if (!diachinhCity) {
      return;
    }

    // setDiachinhDistrict(undefined);
    setDiachinhDistrictList(undefined);
    // setDiachinhWards(undefined);
    setDiachinhWardsList(undefined);

    let quanhuyens = [{ label: 'Chọn Quận/ Huyện', value: '' }];
    for (let quanhuyen in diachinh[diachinhCity]?.['quan-huyen']) {
      let quanhuyendata = diachinh[diachinhCity]?.['quan-huyen']?.[quanhuyen];
      quanhuyens.push({
        label: quanhuyendata.name_with_type,
        value: quanhuyendata.code,
      });
    }
    setDiachinhDistrictList(quanhuyens);
  }, [diachinhCity]);

  /**
   * Địa chính
   * Chọn xã Phường ...
   */
  const diachinhWardsCallback = useCallback((_value: string) => {
    setDiachinhWards(_value);
    user_address_ward_selectType.onChange(_value);
  }, []);

  useEffect(() => {
    if (!diachinhCity || !diachinhDistrict) {
      setDiachinhWardsList(undefined);
      return;
    }
    if (typeof diachinh[diachinhCity]?.['quan-huyen']?.[diachinhDistrict] === 'undefined') {
      return;
    }

    let xathitrans = [{ label: 'Chọn Xã/ Thị trấn', value: '' }];
    for (let xathitran in diachinh[diachinhCity]?.['quan-huyen']?.[diachinhDistrict]?.['xa-phuong']) {
      // @ts-ignore
      let quanhuyendata = diachinh[diachinhCity]?.['quan-huyen']?.[diachinhDistrict]?.['xa-phuong']?.[xathitran];
      // let city = diachinh[_city];
      // @ts-ignore
      xathitrans.push({
        label: quanhuyendata.name_with_type,
        value: quanhuyendata.code,
      });
    }
    setDiachinhWardsList(xathitrans);
  }, [diachinhDistrict, diachinhCity]);

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
          <InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap="400">
            <Box as="section" paddingInlineStart={{ xs: '400', sm: '0' }} paddingInlineEnd={{ xs: '400', sm: '0' }}>
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Thông tin chung
                </Text>
                <Text as="p" variant="bodyMd">
                  Càng chi tiết càng tốt.
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <FormLayout>
                  <TextField
                    autoFocus
                    autoComplete="off"
                    label="User name"
                    helpText={<p>User name không được phép trùng lặp với bất kỳ một tài khoản nào!</p>}
                    {...fields.user_login}
                  />

                  <TextField
                    label="Tên hiển thị"
                    autoComplete="off"
                    {...fields.display_name}
                    connectedLeft={
                      <Select
                        value={useFields.user_title.value || undefined}
                        options={[
                          { value: '', label: 'Không set' },
                          { value: 'mr', label: 'Anh' },
                          { value: 'miss', label: 'Cô' },
                          { value: 'mrs', label: 'Chị' },

                          { value: 'madam', label: 'Quý bà' },
                          { value: 'sir', label: 'Quý ông' },
                        ]}
                        onChange={(e) => useFields.user_title.onChange(e)}
                        label={''}
                      />
                    }
                  />

                  <DateTimeInput
                    onDateChange={({ day, month, year }) => {
                      fields.user_birthday.onChange(`${year}-${month}-${day}`);
                    }}
                    label={'Sinh nhật'}
                    initialDate={fields.user_birthday.defaultValue}
                  />

                  <MultiJob onClose={userJobCallback} current_value={entity?.user_to_job} />

                  <TextField
                    maxLength={250}
                    max={250}
                    showCharacterCount={true}
                    autoComplete="off"
                    label="Giới thiệu ngắn"
                    {...fields.bio}
                    multiline={3}
                  />
                </FormLayout>
              </BlockStack>
            </Card>
          </InlineGrid>

          {smUp ? <Divider /> : null}
          <InlineGrid columns={{ xs: '1fr', md: '2fr 5fr' }} gap="400">
            <Box as="section" paddingInlineStart={{ xs: '400', sm: '0' }} paddingInlineEnd={{ xs: '400', sm: '0' }}>
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Thông tin liên hệ
                </Text>
                <Text as="p" variant="bodyMd">
                  Càng đầy đủ thông tin càng tốt
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <BlockStack gap="400">
                <FormLayout>
                  <TextField label="Số điện thoại" autoComplete="off" helpText="Ví dụ: 0906111111" {...fields.user_phonenumber} />

                  <TextField label="Email" autoComplete="off" helpText="Ví dụ: a@gmail.com" {...fields.user_email} />

                  <TextField label="Địa chỉ" autoComplete="off" {...fields.user_address} />

                  <FormLayout.Group condensed>
                    <Select key={'ahjfkdgf'} label="Tỉnh/Thành phố" options={diachinhCityList} value={diachinhCity} onChange={diachinhCityCallback} />
                    <Select
                      key={'ahjfdsfsgkdgf'}
                      label="Quận/ huyện"
                      options={diachinhDistrictList}
                      value={diachinhDistrict}
                      onChange={diachinhDistrictCallback}
                    />
                    <Select
                      key={'ahjfksdgsdgsw4dgf'}
                      label="Xã/Thị trấn"
                      options={diachinhWardsList}
                      value={diachinhWards}
                      onChange={diachinhWardsCallback}
                    />
                  </FormLayout.Group>
                </FormLayout>
              </BlockStack>
            </Card>
          </InlineGrid>
        </BlockStack>

        <br />
        <br />
      </Form>
    </>
  );
}
