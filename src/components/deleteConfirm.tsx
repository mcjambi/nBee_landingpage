import { Modal, Text } from '@shopify/polaris';
import helpers from 'helpers/index';
import { useCallback, useEffect, useState } from 'react';

export default function DeleteConfirmModal({
  show,
  onClose,
  title,
  content = 'Bạn chắc chắn chứ? Hành động này không thể khôi phục.',
  ...args
}: {
  show: boolean;
  onClose: (resultInBoolean: boolean) => void;
  title: string;
  content?: string;
  args?: any;
}) {
  const [showS, setShowS] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowS(show);
  }, [show]);

  const closeOnly = useCallback(() => {
    setShowS(false);
    onClose?.call(this, false, args);
  }, []);

  const closeAndAgree = useCallback(async () => {
    setLoading(true);
    await helpers.sleep(1000); // fake loading ...
    onClose?.call(this, true, args);
    await helpers.sleep(1000); // fake loading ...
    setLoading(false);
    // setShowS(false);
  }, []);

  return (
    <Modal
      activator={null}
      open={showS}
      onClose={closeOnly}
      title={title}
      primaryAction={{
        content: 'Xóa bỏ',
        onAction: closeAndAgree,
        loading: loading,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: closeOnly,
        },
      ]}
    >
      <Modal.Section>
        <Text as="p">{content}</Text>
      </Modal.Section>
    </Modal>
  );
}
