import helpers from 'helpers/index';
import { BlockStack, Box, Button, Divider, EmptyState, InlineStack, Link, Text, Thumbnail } from '@shopify/polaris';
import { useEffect, useState } from 'react';
import { useAuth } from 'AuthContext';
import 'media/css/shopping_cart.scss';
import { TypedShopping_cart_item, useGetShopingCart, useGetShoppingCartItem } from 'queries/shopping_cart.query';
import Lottie from 'lottie-react';
import empty_cart from 'media/lottie_files/empty_cart.json';
import __helpers from 'helpers/index';
import { useNavigate } from 'react-router-dom';

export default function ShoppingCartPopup({ show }: { show: boolean }) {
  const { user: account } = useAuth();
  const history = useNavigate();

  const { data: shoppingcartitemlist, isLoading: loading } = useGetShoppingCartItem();
  const { data: shoppingCartData } = useGetShopingCart();

  const [entities, setEntities] = useState<TypedShopping_cart_item[] | null>([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!shoppingcartitemlist) return;
    let { body, totalItems } = shoppingcartitemlist;
    setEntities(body);
    setTotalItems(totalItems);
  }, [shoppingcartitemlist]);

  const EmptyCart = () => (
    <Box padding="400">
      <EmptyState heading="Giỏ hàng trống trơn!" image={null}>
        <Lottie animationData={empty_cart} loop={true} />
        <p>Chưa có sản phẩm nào cả!</p>
        <p>Nhanh tay mua sắm và hưởng các ưu đãi, nhớ kiểm tra mã giảm giá.</p>
      </EmptyState>
    </Box>
  );

  return (
    <Box padding="400">
      {loading ? (
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            marginTop: '2rem',
          }}
        >
          Loading...
        </div>
      ) : helpers.isEmpty(entities) ? (
        <EmptyCart />
      ) : (
        <BlockStack gap="800">
          {entities?.map(({ id, product, product_variant, cart_price, cart_quantity }, index) => {
            return (
              <InlineStack gap="400" align="space-between" blockAlign="center" key={'shopping_cart_key_main_' + index}>
                <InlineStack align="start" blockAlign="center" gap="200">
                  <Thumbnail size="medium" source={helpers.getMediaLink(product?.product_thumbnail)} alt={''} />
                  <div style={{ maxWidth: '174px' }}>
                    <Text as="p" tone="subdued" fontWeight="bold">
                      <Link removeUnderline onClick={() => history(`/product/view/` + product.product_slug)}>
                        {product?.product_name}
                      </Link>
                    </Text>
                    {product_variant && (
                      <Text as="p" tone="subdued">
                        {product_variant.variant_name}
                      </Text>
                    )}
                  </div>
                </InlineStack>
                <Text as="h4" variant="headingLg">
                  {helpers.formatNumber(cart_price)}
                </Text>
              </InlineStack>
            );
          })}
          <Divider />
          <br />
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="p" variant="headingMd">
                Tổng sản phẩm
              </Text>
              <Text as="p" variant="headingMd">
                {shoppingCartData.total_quantity}
              </Text>
            </InlineStack>
            <InlineStack align="space-between" blockAlign="center">
              <Text as="p" variant="headingMd">
                Tổng Giá trị
              </Text>
              <Text as="p" variant="headingMd">
                {__helpers.formatNumber(shoppingCartData.total_value)} đ
              </Text>
            </InlineStack>
          </BlockStack>

          <Button size="large">Xem toàn bộ giỏ hàng</Button>
        </BlockStack>
      )}
    </Box>
  );
}
