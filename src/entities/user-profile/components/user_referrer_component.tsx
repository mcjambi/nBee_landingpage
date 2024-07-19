import { BlockStack, Box, Button, InlineStack, Link, SkeletonDisplayText, Text, TextField } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import 'media/css/user_avatar_group.scss';
import user_referrer_placeholder from 'media/lottie_files/user_referrer_placeholder.json';
import Lottie from 'lottie-react';
import { useAuth } from 'AuthContext';
import { TypedMyReferrers, useMyReferrers } from 'queries/user_referrer.query';
import __helpers from 'helpers/index';
import { useNotification } from 'NotificationContext';

function copyToClipboard(_content: string) {
  var inp = document.createElement('input');
  document.body.appendChild(inp);
  inp.value = _content;
  inp.select();
  document.execCommand('copy', false);
  inp.remove();
}

/** Hiển thị tóm tắt đội nhóm của một ai đó ... */
export default function UserReferrerComponent() {
  const { user: current_user_data } = useAuth();

  const {
    refetch: getReferrer,
    isLoading: loadingUserReferrer,
    data: referrerData,
  } = useMyReferrers({
    limit: 5,
  });

  useEffect(() => {
    getReferrer();
  }, []);

  const [totalItems, setTotalItems] = useState(0);
  const [referrerEntity, setReferrerEntity] = useState<TypedMyReferrers[] | null>(null);

  useEffect(() => {
    if (referrerData) {
      let { body, totalItems } = referrerData;
      setTotalItems(totalItems);
      setReferrerEntity(body);
    }
  }, [referrerData]);

  const referrer_link = process.env.REACT_APP_PUBLIC_URL + '/login?ref=' + current_user_data?.referrer_code;
  const { addNotification } = useNotification();
  const copyToClipboardCallback = useCallback((_string: string) => {
    //
    copyToClipboard(_string);
    addNotification('info', 'Đã copy mã giới thiệu');
  }, []);

  return (
    <>
      {loadingUserReferrer ? (
        <SkeletonDisplayText size="small" />
      ) : totalItems < 1 ? (
        <InlineStack blockAlign="center" gap={'100'} align="start">
          <Lottie className="user_referrer_placeholder" animationData={user_referrer_placeholder} loop />
          <BlockStack>
            <Text as="p" variant="headingMd">
              Bạn chưa mời ai
            </Text>
            <Text as="p">
              Bạn có thể sử dụng {current_user_data?.user_email ? `email ${current_user_data?.user_email} hoặc ` : ''}{' '}
              {current_user_data?.user_phonenumber ? ` số điện thoại ${current_user_data?.user_phonenumber}` : ''} để làm mã mời.
            </Text>
          </BlockStack>
        </InlineStack>
      ) : (
        <Box padding={'400'}>
          <TextField
            autoComplete="off"
            label="Link giới thiệu của bạn"
            readOnly
            value={referrer_link}
            suffix={
              <Link removeUnderline onClick={() => copyToClipboardCallback(referrer_link)}>
                COPY
              </Link>
            }
          />
          <br />
          <InlineStack blockAlign="center" gap={'200'} align="start">
            <UserAvatarGroup
              data={referrerEntity.map((element) => {
                return {
                  display_name: element.display_name,
                  user_avatar: __helpers.getMediaLink(element.user_avatar),
                };
              })}
              hasMore={totalItems - 5}
            />
            <Text as="p">Có {totalItems} tài khoản được giới thiệu bởi bạn.</Text>
            <Link url="/my_referrer">Xem tất cả</Link>
          </InlineStack>
        </Box>
      )}
    </>
  );
}

type TypedUserAvatarGroup = {
  display_name: string;
  user_avatar: string;
};

function UserAvatarGroup({ data, hasMore = 0 }: { data: TypedUserAvatarGroup[]; hasMore?: number }) {
  return (
    <div className="avatar-group">
      {data?.map((people, index) => {
        return (
          <div className="avatar" key={index + '_user_group_profile'}>
            <span className="avatar-name">{people.display_name}</span>
            <img src={people.user_avatar} alt="" />
          </div>
        );
      })}
      {hasMore > 0 && (
        <div className="avatar" key="people_get_more">
          <span className="has-more">+{hasMore}</span>
        </div>
      )}
    </div>
  );
}
