import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Divider,
  ExceptionList,
  Image,
  InlineGrid,
  InlineStack,
  Link,
  Page,
  Text,
  TextField,
  Thumbnail,
} from '@shopify/polaris';
import __helpers from 'helpers/index';
import Template404 from 'layout/404';
import { ProductVariant, useGetProduct, useGetProductMedia } from 'queries/product.query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CartDownIcon, InfoIcon, DeliveryFilledIcon, CategoriesIcon, NoteIcon } from '@shopify/polaris-icons';
import StarRating from 'components/starRating';
import 'media/css/product.scss';
import { useAddToShoppingCart } from 'queries/shopping_cart.query';
import Parser from 'html-react-parser';
import CommentCourse from 'entities/edu_center/comment';
import { useNotification } from 'NotificationContext';

type TypedProductSelected = {
  product_price?: number;
  product_quantity?: number;
  product_original_price?: number;
  product_id?: string;
  variant_id?: string;
};

export default function ViewProduct() {
  const history = useNavigate();
  const { addNotification } = useNotification();
  let { product_slug, product_variant_slug } = useParams();
  const { data: productData, mutate: refetchProductData, isError } = useGetProduct();
  const { data: allMedia, mutate: getProductMedia } = useGetProductMedia();

  useEffect(() => {
    refetchProductData(product_slug);
  }, [product_slug]);

  /** Người dùng set số lượng ... */
  const [buyerSetQuantity, setBuyerSetQuantity] = useState<number>(1);
  const increaseMyQuantity = useCallback(() => {
    setBuyerSetQuantity((old) => old + 1);
  }, []);
  const decreaseMyQuantity = useCallback(() => {
    setBuyerSetQuantity((old) => {
      if (old < 2) return 1;
      else return old - 1;
    });
  }, []);

  /** Mode hiển thị ... */
  const [mode, setMode] = useState('normal');

  /** Set hiển thị cái box mua lên, vì có thể sản phẩm không có variant, thì mua luôn ... */

  const [productDataForBuyer, setProductDataForBuyer] = useState<TypedProductSelected>(null);
  useEffect(() => {
    if (!productData) return;
    getProductMedia(productData.product_id);
    if (productData.product_has_variants === 0) {
      setProductDataForBuyer({
        product_price: productData.product_price,
        product_quantity: 1,
        product_original_price: productData.product_original_price,
        product_id: productData.product_id,
        variant_id: undefined,
      });
    } else {
      setProductDataForBuyer(null);
    }

    if (productData.product_variant_group.length === 2) {
      setMode('multi_variants');
    } else if (productData.product_variant_group.length === 1) {
      setMode('single_variant');
    }
  }, [productData]);

  /** Chọn một variant  */
  const [current_variant, setCurrent_variant] = useState(null);
  const setVariant = useCallback(
    (variant_id: string) => {
      if (!productData) return;
      //
      let currentVariant = productData.product_variant.filter((el) => el.id === variant_id);
      if (!currentVariant || __helpers.isEmpty(currentVariant)) return;

      setCurrent_variant(variant_id);
      setProductDataForBuyer({
        product_price: currentVariant.pop().variant_price,
        product_quantity: 1,
        product_original_price: 0,
        product_id: productData.product_id,
        variant_id: variant_id,
      });
    },
    [productData]
  );

  // nếu là mode multi variant ...
  const [firstVariantSelected, setFirstVariantSelected] = useState<string>(null);

  const [filtedVariant, setFiltedVariant] = useState<ProductVariant[] | null>(null);
  useEffect(() => {
    setFiltedVariant(null);
    if (!firstVariantSelected) return;
    if (!productData) return;
    if (!productData.product_variant || __helpers.isEmpty(productData.product_variant)) return;

    const results = productData.product_variant.filter((variant) => variant.variant_name.includes(firstVariantSelected));
    setFiltedVariant(results);
  }, [firstVariantSelected, productData]);

  /** set setFirstVariantSelected cho lần vào đầu tiên, để đỡ phải click */
  useEffect(() => {
    if (!productData) return;
    if (!productData.product_variant_group) return;
    if (productData.product_variant_group.length < 1) return;
    let f = productData.product_variant_group[0].variant_group_value.split(',');
    setFirstVariantSelected(f[0]);
  }, [productData]);

  useEffect(() => {
    if (!current_variant) return;
    window.history.replaceState(null, 'Product View', `/product/view/${product_slug}/${current_variant}`);
  }, [current_variant]);

  useEffect(() => {
    if (product_variant_slug) {
      setCurrent_variant(product_variant_slug);
      setVariant(product_variant_slug);
    }
  }, [product_variant_slug, productData]);

  // thêm vào giỏ hàng ...
  const { mutateAsync: addToShoppingCart } = useAddToShoppingCart();
  const [addingShoppingCart, setAddingShoppingCart] = useState(false);
  const addToCartCallback = useCallback(async () => {
    setAddingShoppingCart(true);
    try {
      await addToShoppingCart({
        product_id: productDataForBuyer?.product_id,
        variant_id: productDataForBuyer?.variant_id,
        cart_quantity: buyerSetQuantity,
      });
      addNotification('info', 'product_added_to_cart_successfully');
    } catch (e) {}
    await __helpers.sleep(1500);
    setAddingShoppingCart(false);
  }, [productDataForBuyer, buyerSetQuantity]);

  // Mua luôn
  const buynowCallback = useCallback(() => {
    console.log(productDataForBuyer, 'productDataForBuyer <<<<');
    console.log(buyerSetQuantity, 'buyerSetQuantity <<<<');
  }, [productDataForBuyer, buyerSetQuantity]);

  const Found = () => {
    return (
      <>
        <Page fullWidth title="" backAction={{ content: 'back to list', onAction: () => history('/product') }}>
          <Box padding={{ xs: '400', md: '0' }}>
            <InlineGrid columns={{ xs: 1, md: ['oneThird', 'twoThirds'] }} gap="400" alignItems="start">
              <Box>
                <Image
                  alt={''}
                  source={__helpers.getMediaLink(
                    productData?.product_thumbnail_to_media ? productData?.product_thumbnail_to_media.media_thumbnail['300x200'] : undefined
                  )}
                />
                <div className="product_image_slide">
                  <InlineStack gap="200" align="start" blockAlign="center">
                    {allMedia?.map((el, index) => {
                      return (
                        <Link url="" key={'product_slide_image_link_key'}>
                          <Image
                            source={
                              el.media.media_thumbnail ? __helpers.getMediaLink(el.media.media_thumbnail['256x169']) : 'https://placehold.co/256x169'
                            }
                            alt=""
                            className="product_slide_thumbnail"
                          />
                        </Link>
                      );
                    })}
                  </InlineStack>
                </div>
              </Box>
              <InlineGrid columns={{ xs: 1, md: ['twoThirds', 'oneThird'] }} gap="400" alignItems="start">
                <Box paddingInline={{ xs: '0', md: '2000' }}>
                  <BlockStack gap="400" align="start">
                    {productData?.product_to_category && (
                      <p>
                        <Button icon={CategoriesIcon} textAlign="start" variant="monochromePlain">
                          {productData?.product_to_category[0].product_category.category_name}
                        </Button>
                      </p>
                    )}
                    <Text as="h1" variant="heading2xl">
                      {productData?.product_name}
                    </Text>
                    <InlineStack align="start" blockAlign="center" gap="400">
                      <StarRating num={4} />
                      <Text as="span" tone="subdued">
                        32 đánh giá
                      </Text>
                    </InlineStack>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {productData?.product_excerpt}
                    </Text>

                    <div>
                      {productData?.product_has_variants ? (
                        <Text as="span" variant="headingLg" fontWeight="regular" tone="magic">
                          Từ{' '}
                          {productData?.product_price_range
                            .split('-')
                            .map((el) => __helpers.formatNumber(Number(el)))
                            .join(' -> ')}{' '}
                          <sup>đ</sup>
                        </Text>
                      ) : (
                        <InlineStack align="start" blockAlign="center" gap="600">
                          <Text as="span" variant="headingLg" fontWeight="regular" tone="magic">
                            {__helpers.formatNumber(productData?.product_price)} đ
                          </Text>
                          {productData?.product_original_price > 0 && (
                            <Text as="span" variant="headingMd" fontWeight="regular" tone="subdued">
                              <del>{__helpers.formatNumber(productData?.product_original_price)} đ</del>
                            </Text>
                          )}
                        </InlineStack>
                      )}
                    </div>
                    {productData?.product_has_variants === 1 && (
                      <>
                        <BlockStack gap="400">
                          <Text as="h4" variant="headingMd">
                            Chọn một tùy chọn
                          </Text>

                          {mode === 'multi_variants' ? (
                            <>
                              <Text as="p">{productData?.product_variant_group[0]?.variant_group_name}</Text>
                              <ButtonGroup>
                                {productData?.product_variant_group[0].variant_group_value
                                  .split(',')
                                  .map((el) => el.trim())
                                  .map((el, index) => {
                                    return (
                                      <Button pressed={firstVariantSelected === el} onClick={() => setFirstVariantSelected(el)}>
                                        {el}
                                      </Button>
                                    );
                                  })}
                              </ButtonGroup>
                              <br />

                              <div className="product_variant_option_variant">
                                <Text as="p">{productData?.product_variant_group[1]?.variant_group_name}</Text>
                                <br />
                                <InlineStack align="start" blockAlign="center" gap="400">
                                  {filtedVariant?.map((variantData, index) => {
                                    return (
                                      <div
                                        className={`variant_option ${current_variant === variantData.id && 'active'} clickable`}
                                        key={index + '_map_for_variant'}
                                        onClick={() => setVariant(variantData.id)}
                                      >
                                        <InlineStack align="start" blockAlign="center" gap="200">
                                          <Thumbnail
                                            size="small"
                                            source={__helpers.getMediaLink(
                                              variantData.variant_thumbnail_to_media
                                                ? variantData.variant_thumbnail_to_media.media_thumbnail['128x128']
                                                : undefined
                                            )}
                                            alt={''}
                                          />
                                          <BlockStack align="start" inlineAlign="start" gap="100">
                                            <Text as="span" fontWeight="bold">
                                              {variantData.variant_name}
                                            </Text>
                                            <Text as="span" tone="subdued" fontWeight="bold">
                                              {__helpers.formatNumber(variantData.variant_price)} đ
                                            </Text>
                                          </BlockStack>
                                        </InlineStack>
                                      </div>
                                    );
                                  })}
                                </InlineStack>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="product_variant_option_variant">
                                <InlineStack align="start" blockAlign="center" gap="400">
                                  {productData?.product_variant?.map((variantData, index) => {
                                    return (
                                      <div
                                        className={`variant_option ${current_variant === variantData.id && 'active'} clickable`}
                                        key={index + '_map_for_variant'}
                                        onClick={() => setVariant(variantData.id)}
                                      >
                                        <InlineStack align="start" blockAlign="center" gap="200">
                                          <Thumbnail
                                            size="small"
                                            source={__helpers.getMediaLink(
                                              variantData.variant_thumbnail_to_media
                                                ? variantData.variant_thumbnail_to_media.media_thumbnail['128x128']
                                                : undefined
                                            )}
                                            alt={''}
                                          />
                                          <BlockStack align="start" inlineAlign="start" gap="100">
                                            <Text as="span" fontWeight="bold">
                                              {variantData.variant_name}
                                            </Text>
                                            <Text as="span" tone="subdued" fontWeight="bold">
                                              {__helpers.formatNumber(variantData.variant_price)} đ
                                            </Text>
                                          </BlockStack>
                                        </InlineStack>
                                      </div>
                                    );
                                  })}
                                </InlineStack>
                              </div>
                            </>
                          )}
                        </BlockStack>

                        <br />
                        <Divider />
                        <br />
                      </>
                    )}
                  </BlockStack>
                </Box>

                <div id="add_to_cart_button_group">
                  <BlockStack gap="400">
                    <Text as="p" variant="heading2xl" fontWeight="regular">
                      {__helpers.formatNumber(productDataForBuyer?.product_price ?? 0)} <sup>đ</sup>
                    </Text>

                    <ExceptionList
                      items={[
                        {
                          icon: InfoIcon,
                          description: 'Phí vận chuyển có thể áp dụng trong trang thanh toán, được vận chuyển từ các kho gần bạn nhất.',
                        },
                      ]}
                    />
                    <Text as="p" tone="success">
                      Nhận hàng từ 2 tới 5 ngày. Sau ngày này, bạn sẽ nhận được mã vouncher 10.000 đ cho các đơn hàng tiếp theo.
                    </Text>
                    <br />
                    <Divider />
                    <br />
                    <Text as="p" variant="headingLg" fontWeight="regular" tone="success">
                      Có sẵn hàng
                    </Text>

                    <TextField
                      disabled={!productDataForBuyer}
                      id="cart_quantity_selected"
                      align="center"
                      autoComplete="off"
                      label=""
                      labelHidden
                      value={'' + buyerSetQuantity}
                      suffix={
                        <Button onClick={() => increaseMyQuantity()} variant="monochromePlain">
                          +
                        </Button>
                      }
                      prefix={
                        <Button onClick={() => decreaseMyQuantity()} variant="monochromePlain">
                          -
                        </Button>
                      }
                    />
                    <Button
                      size="large"
                      id="add_to_cart_main_button"
                      disabled={!productDataForBuyer}
                      variant="primary"
                      loading={addingShoppingCart}
                      onClick={addToCartCallback}
                      icon={CartDownIcon}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </BlockStack>
                </div>
                {/** END RIGHT COLUMN */}
              </InlineGrid>
            </InlineGrid>
            <Divider />
            <br />
            <Text as="h2" variant="headingLg">
              Mô tả
            </Text>
            <br />
            <div className="product_content ck-content">{Parser(productData?.product_description ?? ' ')}</div>
          </Box>
        </Page>
        <Page>
          <br />
          <Divider />
          <br />
          <Box padding={'400'}>
            <Text as="h2" variant="headingLg">
              Đánh giá
            </Text>
            <br />
            <CommentCourse heading="" />
          </Box>
        </Page>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>{productData?.product_name}</title>
      </Helmet>
      {isError ? <Template404 /> : <Found />}
    </>
  );
}
