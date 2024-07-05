import { BlockStack, InlineGrid, InlineStack, SkeletonBodyText, SkeletonThumbnail } from '@shopify/polaris';

export default function UserProfileLoading() {
  return (
    <BlockStack gap="400">
      <InlineGrid gap="400" columns={['oneThird', 'twoThirds']}>
        <SkeletonThumbnail />
        <BlockStack gap="200">
          <SkeletonBodyText lines={1} />
          <SkeletonBodyText lines={1} />
        </BlockStack>
      </InlineGrid>

      <div style={{ maxWidth: '350px' }}>
        <InlineStack wrap={true} gap={'400'}>
          <SkeletonBodyText lines={1} />
          <SkeletonBodyText lines={1} />
        </InlineStack>
      </div>
    </BlockStack>
  );
}
