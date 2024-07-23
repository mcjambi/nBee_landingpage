import { Helmet } from 'react-helmet-async';
import FloatingBanner from 'components/floatingBanner';
import { BlockStack, InlineGrid, Link, Thumbnail, Text, Box, Page, InlineStack, VideoThumbnail, MediaCard, Divider, Button } from '@shopify/polaris';
import { GiftCardFilledIcon } from '@shopify/polaris-icons';
import { useGetGame } from 'queries/game.query';
import RankingByWallet from './user-profile/components/ranking_by_wallet';
import '../../node_modules/react-modal-video/scss/modal-video.scss';
import ModalVideo from 'react-modal-video';
import { useState } from 'react';
export default function Homepage() {
  const {
    data: gameData,
    isLoading: gameLoading,
    isSuccess,
  } = useGetGame({
    limit: 4,
  });

  const [openVideo1, setOpenVideo1] = useState(false);
  const [openVideo2, setOpenVideo2] = useState(false);
  const [openVideo3, setOpenVideo3] = useState(false);

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>

      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={openVideo1}
        videoId="iLwFBJBsz9Y"
        onClose={() => setOpenVideo1(false)}
      />
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={openVideo2}
        videoId="-Pps2jHSSHw"
        onClose={() => setOpenVideo2(false)}
      />
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={openVideo3}
        videoId="RurxOHMxxPM"
        onClose={() => setOpenVideo3(false)}
      />

      {isSuccess && (
        <FloatingBanner openInFirstView={true} icon={GiftCardFilledIcon} title={'Thêm vận may của bạn'}>
          <BlockStack gap="400">
            {isSuccess &&
              gameData &&
              gameData.body.map((game) => {
                return (
                  <InlineGrid columns={['oneThird', 'twoThirds']} gap="100">
                    <div>
                      <Thumbnail source={game.game_thumbnail} alt={''} />
                    </div>
                    <div>
                      <Link url={'/game/' + game.game_slug} removeUnderline>
                        <Text as="h4" variant="headingMd">
                          {game.game_title}
                        </Text>
                      </Link>
                      <Text as="p" variant="bodyMd">
                        {game.game_excerpt}
                      </Text>
                    </div>
                  </InlineGrid>
                );
              })}
          </BlockStack>
        </FloatingBanner>
      )}

      <Box padding={'400'} id="hero_banner" paddingBlock={{ xs: '1000', md: '2400' }}>
        <div className="bg-overlay bg-overlay-5"></div>
        <Page>
          <InlineGrid columns={{ xs: 1, sm: 1, md: ['twoThirds', 'oneThird'] }} gap="400" alignItems="center">
            <BlockStack gap={'400'}>
              <Text as="h1" id="headline" fontWeight="bold">
                Đón đầu cuộc chơi <br />
                <span>Chiến thắng</span>
              </Text>
              <br />
              <Text as="p" id="sub-headline" tone="text-inverse-secondary">
                Bùng nổ 🎁 trong lễ ra mắt ứng dụng <br />
                ...và Kim cương là chìa khóa 😘
              </Text>

              <Text as="p" variant="headingSm" id="sub-sub-headline" tone="text-inverse-secondary">
                * Mỗi lượt giới thiệu thành viên thành công được +50 kim cương, chơi game điểm danh nhận +2 kim cương.
              </Text>
            </BlockStack>
            <RankingByWallet wallet_unit={'diamond'} />
          </InlineGrid>
        </Page>
      </Box>

      <Box background="bg-fill" paddingBlock={{ xs: '1000', md: '2400' }} paddingInline={'400'}>
        <Page>
          <InlineGrid columns={{ xs: 1, md: 2 }} gap="500">
            <BlockStack gap="400">
              <h2 style={{ fontSize: '3em', lineHeight: 1.1, fontWeight: 'bold' }}>
                We're a dynamic, innovative digital agency rooted in the vibrant heart of California
              </h2>
              <p>
                With a team of dedicated professionals and years of industry experience, we pride ourselves on delivering innovative and effective SEO
                solutions tailored to your unique needs.
              </p>
            </BlockStack>
            <div>
              <img src="https://mizzle.webestica.com/assets/images/about/21.jpg" alt="banner" />
            </div>
          </InlineGrid>
        </Page>
      </Box>

      <Divider />

      <Box background="bg-fill" paddingBlock={{ xs: '1000', md: '1200' }} paddingInline={'400'}>
        <Page>
          <h2 style={{ fontSize: '3em', lineHeight: 1.1, fontWeight: 'bold' }}>Người thật, việc thật, chất lượng thật</h2>
          <br />
          <br />
          <InlineGrid columns={{ xs: 1, md: 3 }} gap="400" alignItems="start">
            <div>
              <MediaCard
                portrait
                title="Turn your side-project into a business"
                description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
              >
                <VideoThumbnail
                  videoLength={80}
                  thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                  onClick={() => setOpenVideo1(true)}
                />
              </MediaCard>
            </div>
            <div>
              <MediaCard
                portrait
                title="Turn your side-project into a business"
                description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
              >
                <VideoThumbnail
                  videoLength={80}
                  thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                  onClick={() => setOpenVideo2(true)}
                />
              </MediaCard>
            </div>
            <div>
              <MediaCard
                portrait
                title="Turn your side-project into a business"
                description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
              >
                <VideoThumbnail
                  videoLength={80}
                  thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                  onClick={() => setOpenVideo3(true)}
                />
              </MediaCard>
            </div>
          </InlineGrid>
        </Page>
      </Box>

      <Box background="bg-fill" paddingBlock={{ xs: '1000', md: '1200' }} paddingInline={'400'}>
        <Page>
          <h2 style={{ fontSize: '3em', lineHeight: 1.1, fontWeight: 'bold' }}>Sản phẩm Best-Sells</h2>
          <br />
          <br />
          <InlineGrid columns={{ xs: 1, md: 4 }} gap="400">
            <Box color="text-inverse">
              <div
                style={{
                  minHeight: '400px',
                  padding: '15px',
                  background: 'url(https://freshcart.codescandy.com/assets/images/banner/banner-deal.jpg) no-repeat #000',
                  backgroundSize: 'cover',
                }}
              >
                <Text as="h2" variant="heading2xl">
                  100% Organic Coffee Beans.
                </Text>
                <br />
                <Text as="h3" variant="headingMd">
                  <a href="#a" style={{ color: '#fff' }}>
                    Xem tất cả
                  </a>
                </Text>
              </div>
            </Box>
            {Array(3)
              .fill('a')
              .map((el, index) => {
                return (
                  <Box background="bg-fill" padding={'400'}>
                    <BlockStack gap="200">
                      <img src="https://freshcart.codescandy.com/assets/images/products/product-img-6.jpg" alt="" />
                      <Text as="p" tone="subdued">
                        Dairy, Bread & Eggs
                      </Text>
                      <Text as="h3" variant="headingMd">
                        <Link removeUnderline>Britannia Cheese Slices</Link>
                      </Text>
                      <InlineStack align="space-between" blockAlign="center">
                        <Text as="span" variant="headingMd" fontWeight="bold" tone="magic-subdued">
                          20.000 đ
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          Đã bán 400k
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </Box>
                );
              })}
          </InlineGrid>
        </Page>
      </Box>

      <Divider />
      <InlineGrid columns={{ xs: 1, sm: 1, md: ['oneThird', 'twoThirds'] }} gap="400">
        <Box background="bg-fill" padding={'400'}>
          &copy; 2024 TNMALL
        </Box>
        <Box background="bg" padding={'400'}>
          CÔNG TY TNHH EBISU KAZE JAPAN, 65 ngách 32/15 An Dương, Tây Hồ, Hà Nội.
        </Box>
      </InlineGrid>
    </>
  );
}
