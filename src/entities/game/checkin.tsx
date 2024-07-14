import React, { useCallback, useEffect, useState } from 'react';
import 'media/css/checkin.scss';
import { useCheckJoin, useLetMeJoin } from 'queries/checkin.query';
import { Text, EmptyState, LegacyCard, Page } from '@shopify/polaris';
import { useGetAGame } from 'queries/game.query';
import { useNotification } from 'NotificationContext';

export default function CheckIn() {
  /** Kiểm tra xem join hay chưa ... */
  const { addNotification } = useNotification();
  const { data: checkJoinData } = useCheckJoin();
  const { mutateAsync: getGameData, data: gameData, isSuccess, isError } = useGetAGame();
  const { mutateAsync: letMeJoin, isSuccess: joinSuccess } = useLetMeJoin();
  const [join, setJoin] = useState(false);

  useEffect(() => {
    setJoin(checkJoinData?.joined);
  }, [checkJoinData]);

  useEffect(() => {
    getGameData('checkin');
  }, []);

  const letMeJoinCallback = useCallback(() => {
    letMeJoin();
  }, []);

  useEffect(() => {
    if (joinSuccess) {
      addNotification('info', 'Đã tham gia, chúc mừng nha...');
    }
  }, [joinSuccess]);

  return (
    <Page>
      {!join && (
        <LegacyCard sectioned>
          <EmptyState
            fullWidth
            heading={gameData?.game_title}
            action={{ content: 'Tham gia ngay', onAction: letMeJoinCallback }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <div>
              <Text alignment="start" as="p">
                Click vào nút tham gia ngay để bắt đầu cuộc chơi ...
              </Text>
            </div>
          </EmptyState>
        </LegacyCard>
      )}
    </Page>
  );
}
