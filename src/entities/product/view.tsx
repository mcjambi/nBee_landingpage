import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Divider,
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
import { useLocation, useParams } from 'react-router-dom';
import { CartDownIcon, CartSaleIcon } from '@shopify/polaris-icons';
import StarRating from 'components/starRating';
import 'media/css/product.scss';
import helpers from 'helpers/index';

type TypedProductSelected = {
  product_price?: number;
  product_quantity?: number;
  product_original_price?: number;
  product_id?: string;
  variant_id?: string;
};

export default function ViewProduct() {
  let { product_slug, product_variant_slug } = useParams();
  const { data: productData, isLoading, isError } = useGetProduct(product_slug);
  const { data: allMedia, mutate: getProductMedia } = useGetProductMedia();

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
        variant_id: null,
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
  const addToCartCallback = useCallback(() => {
    console.log(productDataForBuyer, 'productDataForBuyer <<<<');
    console.log(buyerSetQuantity, 'buyerSetQuantity <<<<');
  }, [productDataForBuyer, buyerSetQuantity]);

  // Mua luôn
  const buynowCallback = useCallback(() => {
    console.log(productDataForBuyer, 'productDataForBuyer <<<<');
    console.log(buyerSetQuantity, 'buyerSetQuantity <<<<');
  }, [productDataForBuyer, buyerSetQuantity]);

  const Found = () => {
    return (
      <Page>
        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <Box>
            <Image alt={''} source={__helpers.getMediaLink(productData?.product_thumbnail)} />
            <div className="product_image_slide">
              {allMedia?.map((el, index) => {
                return <Image source={__helpers.getMediaLink(el.media.media_filename)} alt="" className="product_slide_thumbnail" />;
              })}
            </div>
          </Box>
          <Box>
            <BlockStack gap="400">
              {productData?.product_to_category && <Text as="p">{productData?.product_to_category[0].product_category.category_name}</Text>}
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
              <br />
              <Divider />
              <br />
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
                          <InlineStack align="start" blockAlign="center" gap="400">
                            {filtedVariant?.map((variantData, index) => {
                              return (
                                <div
                                  className={`variant_option ${current_variant === variantData.id && 'active'} clickable`}
                                  key={index + '_map_for_variant'}
                                  onClick={() => setVariant(variantData.id)}
                                >
                                  <InlineStack align="start" blockAlign="center" gap="200">
                                    <Thumbnail size="small" source={__helpers.getMediaLink(variantData.variant_thumbnail)} alt={''} />
                                    <BlockStack align="start" inlineAlign="start" gap="100">
                                      <Text as="span" fontWeight="bold">
                                        {variantData.variant_name}
                                      </Text>
                                      <Text as="span" tone="subdued">
                                        {variantData.variant_price} đ
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
                                    <Thumbnail size="small" source={__helpers.getMediaLink(variantData.variant_thumbnail)} alt={''} />
                                    <BlockStack align="start" inlineAlign="start" gap="100">
                                      <Text as="span" fontWeight="bold">
                                        {variantData.variant_name}
                                      </Text>
                                      <Text as="span" tone="subdued">
                                        {variantData.variant_price} đ
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
              {productDataForBuyer && (
                <>
                  <InlineStack align="start" blockAlign="center" gap="600">
                    <Text as="span" variant="headingLg" fontWeight="regular" tone="magic">
                      {__helpers.formatNumber(productDataForBuyer.product_price)} đ
                    </Text>
                    {productDataForBuyer.product_original_price > 0 && (
                      <Text as="span" variant="headingMd" fontWeight="regular" tone="subdued">
                        <del>{__helpers.formatNumber(productDataForBuyer.product_original_price)} đ</del>
                      </Text>
                    )}
                  </InlineStack>
                  <TextField
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
                  <InlineGrid alignItems="center" columns={2} gap="400">
                    <Button onClick={addToCartCallback} icon={CartDownIcon}>
                      Thêm vào giỏ hàng
                    </Button>
                    <Button onClick={buynowCallback} icon={CartSaleIcon} variant="primary">
                      Mua ngay
                    </Button>
                  </InlineGrid>
                </>
              )}
            </BlockStack>
          </Box>
        </InlineGrid>
      </Page>
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
