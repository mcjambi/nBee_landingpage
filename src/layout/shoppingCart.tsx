import helpers from 'helpers/index';
import { BlockStack, Box, Button, Divider, EmptyState, InlineStack, Link, Text, TextField, Thumbnail } from '@shopify/polaris';
import { XIcon, PaymentIcon } from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from 'AuthContext';
import 'media/css/shopping_cart.scss';
import {
  TypedShopping_cart_item,
  useClearShoppingCart,
  useGetShopingCart,
  useGetShoppingCartItem,
  useUpdateShoppingCartItemQuantity,
} from 'queries/shopping_cart.query';
import Lottie from 'lottie-react';
import empty_cart from 'media/lottie_files/empty_cart.json';
import __helpers from 'helpers/index';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from 'components/deleteConfirm';

export default function ShoppingCartPopup({ show }: { show: boolean }) {
  const { user: account } = useAuth();
  const history = useNavigate();

  const { data: shoppingcartitemlist, isLoading: loading } = useGetShoppingCartItem();
  const { data: shoppingCartData } = useGetShopingCart();
  const { mutate: updateShoppingCart, isPending: updatingShoppingCart } = useUpdateShoppingCartItemQuantity();
  const { mutate: clearAllShoppingCart } = useClearShoppingCart();

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

  /** Người dùng set số lượng ... */
  type TypedQ = { id: string; cart_quantity: number };
  const [buyerSetQuantity, setBuyerSetQuantity] = useState<TypedQ[] | null>(null);

  const reduceRequest = useCallback((buyerSetQuantity) => {
    updateShoppingCart(buyerSetQuantity);
  }, []);

  const reduceRequestMemo = useMemo(() => {
    return helpers.debounce((buyerSetQuantity) => {
      reduceRequest(buyerSetQuantity);
    }, 1000);
  }, []);

  /** Nó đang chạy patch mất dạy, Đã fixed ... */
  const alreadyUpdate = useRef(null);
  useEffect(() => {
    if (buyerSetQuantity && alreadyUpdate.current) {
      reduceRequestMemo(buyerSetQuantity);
      alreadyUpdate.current = null;
    }
  }, [buyerSetQuantity, alreadyUpdate.current]);

  useEffect(() => {
    let r = [];
    for (let el of entities) {
      r.push({
        id: el.id,
        cart_quantity: el.cart_quantity,
      });
    }
    setBuyerSetQuantity(r);
  }, [entities]);

  const increaseMyQuantity = useCallback(
    (id: string) => {
      setBuyerSetQuantity((old) =>
        old.map((a) => {
          if (a.id === id) {
            a.cart_quantity = a.cart_quantity + 1;
          }
          return a;
        })
      );
      alreadyUpdate.current = true;
    },
    [alreadyUpdate]
  );
  const decreaseMyQuantity = useCallback(
    (id: string) => {
      setBuyerSetQuantity((old) =>
        old.map((a) => {
          if (a.id === id && a.cart_quantity > 0) {
            a.cart_quantity = a.cart_quantity - 1;
          }
          return a;
        })
      );
      alreadyUpdate.current = true;
    },
    [alreadyUpdate]
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={(e) => {
          if (e === true) {
            clearAllShoppingCart();
          }
          setShowDeleteModal(false);
        }}
        title={'Xóa trắng giỏ hàng'}
        content="Bạn chắc chắn chứ? Sau khi xóa trắng giỏ hàng, bạn không thể khôi phục được."
      />
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
          <>
            <div>
              {entities?.map(({ id, product, product_variant, cart_price, cart_quantity }, index) => {
                return (
                  <Box borderBlockEndWidth="0165" borderColor="border-disabled" paddingBlock={'400'} key={'shopping_cart_key_main_' + index}>
                    <InlineStack gap="400" align="space-between" blockAlign="center">
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

                          <TextField
                            size="slim"
                            align="center"
                            autoComplete="off"
                            label=""
                            labelHidden
                            value={`` + buyerSetQuantity[index]?.cart_quantity}
                            suffix={
                              <Button onClick={() => increaseMyQuantity(id)} variant="monochromePlain">
                                +
                              </Button>
                            }
                            prefix={
                              <Button onClick={() => decreaseMyQuantity(id)} variant="monochromePlain">
                                -
                              </Button>
                            }
                          />
                        </div>
                      </InlineStack>
                      <Text as="h4" variant="headingLg">
                        {helpers.formatNumber(cart_price)}
                      </Text>
                    </InlineStack>
                  </Box>
                );
              })}
              <br />
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
                <Text as="p" tone="subdued">
                  * Mã giảm giá hoặc hoa hồng (nếu có) sẽ được thêm ở trang thanh toán.
                </Text>
              </BlockStack>
              <br />
              <Divider />
              <br />
            </div>
            <br />
            <BlockStack gap="400">
              <Button icon={XIcon} fullWidth size="large" onClick={() => setShowDeleteModal(true)} tone="critical">
                Xóa trắng giỏ hàng
              </Button>
              <Button icon={PaymentIcon} fullWidth size="large" variant="primary">
                Thanh toán
              </Button>
            </BlockStack>
          </>
        )}
      </Box>
    </>
  );
}
