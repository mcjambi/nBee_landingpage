import { BlockStack, InlineStack, Link, SkeletonDisplayText, Text } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import 'media/css/user_avatar_group.scss';
import user_referrer_placeholder from 'media/lottie_files/user_referrer_placeholder.json';
import Lottie from 'lottie-react';
import { useAuth } from 'AuthContext';
import { useGetReferrer } from 'queries/user_referrer.query';

/** Hiển thị tóm tắt đội nhóm của một ai đó ... */
export default function UserReferrerModule() {
  const { user: current_user_data } = useAuth();

  const {
    refetch: getReferrer,
    isLoading: loadingUserReferrer,
    data: referrerData,
  } = useGetReferrer({
    user_id: current_user_data?.user_id,
    limit: 5,
  });

  useEffect(() => {
    getReferrer();
  }, []);

  const [totalItems, setTotalItems] = useState(0);
  const [referrerEntity, setReferrerEntity] = useState({});

  useEffect(() => {
    if (referrerData) {
      let { body, totalItems } = referrerData;
      setTotalItems(totalItems);
      setReferrerEntity(body);
    }
  }, [referrerData]);
  a;

  return (
    <>
      <SkeletonDisplayText size="small" />
      <br />
      <InlineStack blockAlign="center" gap={'100'} align="start">
        <UserAvatarGroup
          data={[
            {
              display_name: 'Ch',
              user_avatar: '',
            },
            {
              display_name: 'TR',
              user_avatar: '',
            },
          ]}
        />
        <Text as="p">
          được giới thiệu bởi bạn, <Link url="/my_referrer">xem tất cả</Link>.
        </Text>
      </InlineStack>

      <br />
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
    </>
  );
}

type TypedUserAvatarGroup = {
  display_name: string;
  user_avatar: string;
};

function UserAvatarGroup({ data }: { data: TypedUserAvatarGroup[] }) {
  return (
    <div className="avatar-group">
      {data?.map((people) => {
        return (
          <div className="avatar">
            <span className="avatar-name">{people.display_name}</span>
            <img src={people.user_avatar} alt="" />
          </div>
        );
      })}
    </div>
  );
}
