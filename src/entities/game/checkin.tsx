import React, { useCallback, useEffect, useMemo, useState } from 'react';
import 'media/css/checkin.scss';
import { useCheckJoin, useDoCheckin, useGetRankCheckin, useLetMeJoin, useMyCheckin } from 'queries/checkin.query';
import {
  Text,
  EmptyState,
  LegacyCard,
  Page,
  BlockStack,
  InlineGrid,
  Avatar,
  InlineStack,
  Button,
  Scrollable,
  Tabs,
  Icon,
  Box,
  useBreakpoints,
} from '@shopify/polaris';
import { useGetAGame } from 'queries/game.query';
import { useNotification } from 'NotificationContext';
import SkeletonPageLoading from 'components/skeletonPageLoading';
import { useAuth } from 'AuthContext';
import __helpers from 'helpers/index';
import dateandtime from 'date-and-time';
import { CheckIcon, XIcon, ClipboardCheckFilledIcon } from '@shopify/polaris-icons';
import rank_empty_placeholder from 'media/lottie_files/rank_empty_placeholder.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Module ...
 * @returns
 */

export default function CheckIn() {
  const { user } = useAuth();
  const history = useNavigate();
  /** Kiểm tra xem join hay chưa ... */
  const { addNotification } = useNotification();
  const { data: checkJoinData, refetch: reCheckJoin } = useCheckJoin();
  const { mutateAsync: getGameData, data: gameData, isSuccess, isError, isPending } = useGetAGame();
  const { mutateAsync: letMeJoin, isSuccess: joinSuccess } = useLetMeJoin();
  const [join, setJoin] = useState(false);

  const { mutateAsync: getMyCheckin, data: allMyCheckins } = useMyCheckin();
  const { mutateAsync: doCheckin, isPending: doCheckining, isSuccess: checkinSuccess } = useDoCheckin();
  const { mutateAsync: getRanks, data: rankDatas } = useGetRankCheckin();

  const getPrevious7Days = useMemo(() => {
    const today = new Date();
    const previous7Days = [];

    for (let i = 0; i < 7; i++) {
      // Tạo một đối tượng ngày mới và lùi lại số ngày tương ứng
      const previousDay = new Date(today);
      previousDay.setDate(today.getDate() - i);
      previous7Days.push(dateandtime.format(previousDay, 'YYYY-MM-DD'));
    }
    return previous7Days.reverse();
  }, []);

  useEffect(() => {
    setJoin(checkJoinData?.joined);
  }, [checkJoinData]);

  useEffect(() => {
    getGameData('checkin');
    getRanks();
  }, []);

  useEffect(() => {
    getRanks();
  }, [checkinSuccess]);

  const letMeJoinCallback = useCallback(() => {
    letMeJoin();
  }, []);

  useEffect(() => {
    if (joinSuccess) {
      addNotification('info', 'Đã tham gia, chúc mừng nha...');
      reCheckJoin();
    }
  }, [joinSuccess]);

  useEffect(() => {
    if (join) {
      getMyCheckin();
    }
  }, [join]);

  const doCheckinCallback = useCallback(async () => {
    try {
      await doCheckin();
      getMyCheckin();
    } catch (e) {
      addNotification('error', e?.message ?? 'something_went_wrong');
    }
  }, []);

  const NOTAreadyJoined = () => {
    return (
      <EmptyState fullWidth heading={null} action={{ content: 'Tham gia ngay', onAction: letMeJoinCallback }} image={null}>
        <Lottie animationData={rank_empty_placeholder} loop={false} />
        <Text as="h2" variant="headingLg">
          {gameData?.game_title}
        </Text>
        <Text alignment="center" as="p">
          Click vào nút tham gia ngay để bắt đầu cuộc chơi ...
        </Text>
      </EmptyState>
    );
  };

  const [allMyCheckin, setAllMyCheckin] = useState<string[]>([]);
  useEffect(() => {
    let x = [];
    if (allMyCheckins)
      for (let a of allMyCheckins) {
        x.push(a.createdAt);
      }
    setAllMyCheckin(x);
  }, [allMyCheckins]);

  let { mdUp } = useBreakpoints();

  const MainTemplate = useCallback(() => {
    return (
      <Box padding={'400'}>
        <BlockStack gap="400">
          <InlineStack align="start" blockAlign="center" gap="400">
            <Avatar source={user.user_avatar ?? null} size="lg" />
            <Text as="p">{user.display_name}</Text>
          </InlineStack>

          {mdUp && (
            <InlineStack gap="400" align="space-between" blockAlign="center">
              {getPrevious7Days.map((date, index) => {
                let isCheckedIn = allMyCheckin.some((u) => u === date);
                return (
                  <Box background={isCheckedIn ? 'bg-fill-info' : 'bg-fill-active'} padding={'400'} key={'checkin_list_' + index} borderRadius="full">
                    <div className={isCheckedIn ? 'checkin_success' : 'checkin_fail'}>
                      <BlockStack inlineAlign="center" align="center">
                        <Icon source={isCheckedIn ? CheckIcon : XIcon} />
                        <Text as="p" tone="subdued">
                          {dateandtime.format(new Date(date), 'DD/MM')}
                        </Text>
                      </BlockStack>
                    </div>
                  </Box>
                );
              })}
            </InlineStack>
          )}

          {__helpers.isEmpty(rankDatas) ? (
            <LegacyCard sectioned>
              <EmptyState heading="" image={null}>
                <Lottie animationData={rank_empty_placeholder} loop={false} />
                <p>Chưa có ai trong bảng xếp hạng</p>
                <p>Nhanh tay điểm danh và nằm trong danh sách đầu tiên</p>
              </EmptyState>
            </LegacyCard>
          ) : (
            <>
              <br />
              <br />
              <Text as="h3" alignment="center" tone="subdued" fontWeight="regular" variant="headingLg">
                BẢNG XẾP HẠNG
              </Text>
              <InlineStack align="center" gap="400" blockAlign="center">
                <Box width="450px" background="bg-fill" padding={'400'} borderRadius="400">
                  <BlockStack gap="400">
                    <BlockStack gap="400">
                      {rankDatas?.map((r, index) => {
                        return (
                          <div key={'XXX_' + index} className={`normal_user_rank ${r.user.user_id === user.user_id ? 'active' : ''}`}>
                            <InlineStack align="space-between" blockAlign="center">
                              <InlineStack align="start" blockAlign="center" gap="400">
                                <Avatar source={r.user?.user_avatar ?? null} size="lg" />
                                <BlockStack>
                                  <Text as="p" variant="headingMd">
                                    {r.user?.display_name ?? 'Chưa có tên'}
                                  </Text>
                                  <Text as="p" variant="bodyXs">
                                    {r.count ?? '1'} luợt điểm danh
                                  </Text>
                                </BlockStack>
                              </InlineStack>
                              <Text as="p" variant="heading2xl">
                                {index + 1}
                              </Text>
                            </InlineStack>
                          </div>
                        );
                      })}
                    </BlockStack>
                  </BlockStack>
                </Box>
              </InlineStack>
            </>
          )}
        </BlockStack>
      </Box>
    );
  }, [allMyCheckin, user, doCheckining, rankDatas, mdUp]);

  const isCheckedInToday = useCallback((): boolean => {
    let today = dateandtime.format(new Date(), 'YYYY-MM-DD');
    let is = allMyCheckin.some((u) => u === today);
    return is ? true : false;
  }, [allMyCheckin]);

  return (
    <>
      <Helmet>
        <title>Điểm danh nhận quà</title>
      </Helmet>
      {isPending ? (
        <SkeletonPageLoading />
      ) : (
        <Page
          title={gameData?.game_title}
          subtitle={gameData?.game_excerpt}
          backAction={{ content: 'Trang chủ', onAction: () => history('/') }}
          primaryAction={{
            content: 'Điểm danh',
            loading: doCheckining,
            icon: ClipboardCheckFilledIcon,
            disabled: isCheckedInToday(),
            onAction: doCheckinCallback,
          }}
        >
          {!join ? <NOTAreadyJoined /> : <MainTemplate />}
        </Page>
      )}
    </>
  );
}
