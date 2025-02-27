import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrors, removeItemFromCart, increaseItemQuantity, decreaseItemQuantity, getAllItems } from "../../redux/slices/cartSlice";
import { ReactComponent as CartIcon } from "../../Image/icons/cart.svg";
import { ReactComponent as PriceIcon } from "../../Image/icons/price.svg";
import { ReactComponent as DeleteIcon } from "../../Image/icons/delete.svg";
import { ReactComponent as DeliveryIcon } from "../../Image/icons/delivery.svg";
import { ReactComponent as PaymentIcon } from "../../Image/icons/payment.svg";
import { ReactComponent as EditIcon } from "../../Image/icons/edit.svg";
import { ReactComponent as AddressIcon } from "../../Image/icons/address.svg";
import Loader from "../../component/layouts/Loader/Loader";
import MetaData from "../../component/layouts/MetaData/MetaData";
import Iconify from '../../component/iconify';
import { IconButton, Typography, RadioGroup, Radio, FormControlLabel, Grid, Stack } from '@mui/material';
import { fCurrency } from '../../utils/formatNumber';

import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import FormProvider, { RHFTextField, RHFAutocomplete } from "../../component/hook-form";
export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, allItems, error, fee: { discount, subTotal, shipping, total, saveMoney } } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [clickOrder, setClickOrder] = useState(false);
  const [receiveAtStore, setReceiveAtStore] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [payment, setPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllItems());
  }, [dispatch, error]);

  const OrderInfoSchema = Yup.object().shape({
    isReceiveAtStore: Yup.boolean().required(),
    name: Yup.string()
      .required("Họ tên không được để trống")
      .min(3, "Họ tên phải có ít nhất 3 ký tự")
      .max(50, "Họ tên không được vượt quá 50 ký tự"),
    phone: Yup.string()
      .required("Số điện thoại không được để trống")
      .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Số điện thoại phải ở dạng 0xxxxxxxxx hoặc 0xx-xxx-xxxx (x từ 0 đến 9)"),
    email: Yup.string().required("Email is required").email("Email must be a valid email address"),

    street: Yup.string().when('isReceiveAtStore', {
      is: false,
      then: () => Yup.string().required('Địa chỉ cụ thể không được để trống'),
      otherwise: () => Yup.string().notRequired(),
    }),
    ward: Yup.string().when('isReceiveAtStore', {
      is: false,
      then: () => Yup.string().required('Phường/Xã không được để trống'),
      otherwise: () => Yup.string().notRequired(),
    }),
    district: Yup.string().when('isReceiveAtStore', {
      is: false,
      then: () => Yup.string().required('Quận/Huyện không được để trống'),
      otherwise: () => Yup.string().notRequired(),
    }),
    province: Yup.string().when('isReceiveAtStore', {
      is: false,
      then: () => Yup.string().required('Tỉnh/Thành phố không được để trống'),
      otherwise: () => Yup.string().notRequired(),
    }),
    // store: Yup.string().required("Cửa hàng không được để trống")
    store: Yup.string().when('isReceiveAtStore', {
      is: true,
      then: () => Yup.string().required('Cửa hàng không được để trống'),
      otherwise: () => Yup.string().notRequired(),
    }),
  });
  const defaultValues = {
    isReceiveAtStore: false,
    name: user?.userName || "",
    phone: "",
    email: user?.email || "",
    street: "",
    ward: "",
    district: "",
    province: "",
    store: "",
  };

  const methods = useForm({
    resolver: yupResolver(OrderInfoSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (receiveAtStore === false) {
        const tmp = data.street.concat(", ", data.ward, ", ", data.district, ", ", data.province)
        setShippingAddress(tmp);
        setPhoneNumber(data.phone);
        setPayment(true);
        if (paymentMethod === 'vnpay') {
          console.log(paymentMethod)
        }
      } else {
        setStoreLocation(true);
      }
      const formData = new FormData();
    } catch (error) {
      toast.error(error.response.data.message);
      reset();
    }
  });


  const handleDeleteCart = (cartId) => {
    dispatch(removeItemFromCart(cartId));
    toast.success("Delete item successfully");
  };

  const handleIncreaseQuantity = (cartId, quantity) => {
    dispatch(increaseItemQuantity({ cartId, quantity }))
  };

  const handleDecreaseQuantity = (cartId, quantity) => {
    dispatch(decreaseItemQuantity({ cartId, quantity }))
  };

  const receiveOpts = [
    {
      value: 'store',
    },
    {
      value: 'delivery',
    }
  ];

  const paymentOpts = [
    {
      value: 'vnpay',
      name: 'Thanh toán qua VnPay'
    },
    {
      value: 'paypal',
      name: 'Thanh toán qua Paypal'
    },
    {
      value: 'momo',
      name: 'Thanh toán qua Momo'
    },
    {
      value: 'zalopay',
      name: 'Thanh toán qua ZaloPay'
    },
    {
      value: 'credit_card',
      name: 'Thanh toán bằng thẻ ATM'
    }
  ];

  const handleChangeReceiveMethod = (_, value) => {
    if (value === 'store') {
      setReceiveAtStore(true);
      setValue('isReceiveAtStore', true);
    } else {
      setReceiveAtStore(false);
      setValue('isReceiveAtStore', false);
    }
  };

  const handleChangePaymentMethod = (_, value) => {
    setPaymentMethod(value);
  };
  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div>
            <MetaData title="Thanh toán - Di Động Việt" />
            <main className="flex w-full flex-col items-center justify-start py-1" style={{ minHeight: '600px' }}>
              <div className="container w-full" style={{ opacity: 1 }}>
                <div className="container bg-white px-2 antialiased md:hidden">
                  <Link to="/">
                    <p className="mt-2 text-sm font-medium text-ddv">&#60; Tiếp tục mua hàng</p>
                  </Link>
                  <div className="mt-2 flex">
                    <CartIcon />
                    <p className="px-3 text-20 font-bold">Giỏ hàng ({allItems.length} sản phẩm)</p>
                  </div>
                  {
                    allItems ?
                      (
                        <div>
                          {
                            allItems.map((e, index) => {
                              const { id, quantity, productVariant } = e;
                              return (
                                <div className="grid grid-cols-4 items-center gap-4 py-2 md:hidden" key={index}>
                                  <div className="col-span-1 flex w-full items-start justify-center">
                                    <div style={{ width: '100%', height: '100%' }}>
                                      <img src={productVariant?.images?.imageUrl} width="61" height="64" alt="di động việt" style={{ height: '64px', objectFit: 'contain' }}>
                                      </img>
                                    </div>
                                  </div>
                                  <div className="col-span-3 w-full flex-col items-start justify-start">
                                    <p className="text-14 ">{productVariant?.name}</p>
                                    <p className="text-left text-14 font-medium text-ddv">
                                      {fCurrency(productVariant?.price)}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center justify-start">
                                        <IconButton size="small" color="inherit" disabled={quantity <= 1}
                                          onClick={() => handleDecreaseQuantity(id, quantity)}
                                        >
                                          <Iconify icon="eva:minus-fill" width={16} />
                                        </IconButton>
                                        <Typography variant="body2" component="span" sx={{ width: 15, textAlign: 'center', display: 'inline-block' }}>
                                          {quantity}
                                        </Typography>
                                        <IconButton size="small" color="inherit" disabled={quantity >= parseInt(productVariant?.stock)}
                                          onClick={() => handleIncreaseQuantity(id, quantity)}
                                        >
                                          <Iconify icon="eva:plus-fill" width={16} />
                                        </IconButton>
                                      </div>
                                      <button className="text-center" type="button"
                                        onClick={() => handleDeleteCart(id)}
                                      >
                                        <DeleteIcon />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          }
                          <div className="m-2 flex pt-4 ">
                            <DeliveryIcon />
                            <p className="px-3 text-20 font-bold">Hình thức giao hàng</p>
                          </div>
                          <div className="form-check m-2">
                            <div className="flex"></div>
                            <div className="my-3 grid grid-cols-1 gap-4">
                              <div className="col-span-1"></div>
                              <div className="col-span-1"></div>
                              <div className="col-span-1"></div>
                            </div>
                            <div className="md:hidden">
                              <div className="flex">
                                <PaymentIcon />
                                <p className="px-3 pb-3 text-20 font-bold">Chọn hình thức thanh toán</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-start pt-3">
                              <PriceIcon />
                              <p className="px-3 text-24 font-bold">Tạm tính</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <p className="text-sm">Tiền hàng</p>
                              <p className="text-sm font-bold">42.440.000 đ</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <p className="text-sm">Phí vận chuyển</p>
                              <p className="text-sm font-bold">0 đ</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <p className="text-sm">Khuyến mãi</p>
                              <p className="text-sm font-bold">-0 đ</p>
                            </div>
                            <div className="flex w-full items-center justify-between py-2"></div>
                            <div className="line-ngang my-3 w-full"></div>
                            <div className="flex items-center justify-between py-2">
                              <p className="text-sm">Tổng cộng</p>
                              <p className="text-sm font-bold text-ddv">42.440.000 đ</p>
                            </div>
                            <div className="flex w-full items-center justify-between pb-6">
                              <button className="border-1 flex items-center justify-center rounded border-ddv bg-white py-2" style={{ width: "47%" }}>
                                <p className="text-14 font-medium text-ddv">Tiếp tục mua hàng</p>
                              </button>
                              <button className="border-1 relative flex items-center justify-center rounded border-ddv bg-ddv py-2" style={{ width: "47%" }}>
                                <p className="text-14 font-medium text-white">Thanh toán</p>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex w-full flex-col items-center justify-center bg-white pb-6">
                          <img alt="di động việt" src="https://didongviet.vn/images/pc/noresults.png"></img>
                          <p className="text-center text-16">Không có sản phẩm nào</p>
                          <button className="border-1 my-2 flex w-full items-center justify-center rounded bg-ddv py-2" style={{ width: '250px' }}>
                            <p className="text-14 font-bold text-white">Về trang chủ</p>
                          </button>
                          <p className="text-center text-sm text-black">
                            Khi cần trợ giúp, vui lòng gọi
                            <span className="font-bold text-link underline">
                              <a href="tel:18006018"> 1800.6018 </a>
                            </span>
                            (7:30 - 22:00)
                          </p>
                        </div>
                      )}
                </div>


                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <div className="container antialiased max-md:hidden">
                    <Link to="/">
                      <p className="mt-4 text-sm font-medium text-ddv">&#60; Tiếp tục mua hàng</p>
                    </Link>
                    {
                      allItems ? (
                        <div className="grid grid-cols-3 items-start justify-start gap-4">
                          {
                            clickOrder ?
                              (
                                <div className="col-span-2 my-3 flex-col">
                                  <div className="flex-col rounded-lg bg-white py-3 px-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex">
                                        <CartIcon />
                                        <p className="px-3 text-24 font-bold">Giỏ hàng ({allItems.length} sản phẩm)</p>
                                      </div>
                                      <button className="flex items-center" onClick={() => setClickOrder(false)}>
                                        <p className="pr-2 text-12 text-linkkhac">Chỉnh sửa</p>
                                        <EditIcon />
                                      </button>
                                    </div>
                                    {
                                      allItems.map((e, index) => {
                                        const { id, quantity, productVariant } = e;
                                        return (
                                          <div className="my-4 flex items-center justify-start" key={index}>
                                            <div>
                                              <img src={productVariant?.images?.imageUrl} width="61" height="64" alt="di động việt" style={{ height: '64px', objectFit: 'contain' }}></img>
                                            </div>
                                            <div className="flex-col items-center justify-start">
                                              <p className="px-3 text-14">{productVariant?.name}</p>
                                              <div className="flex items-center justify-start">
                                                <p className="px-3 text-14 font-bold text-ddv">{productVariant?.price}</p>
                                                <p className="px-3 text-14 font-medium">SL: {quantity}</p>
                                              </div>
                                            </div>
                                            <div></div>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>
                                  {!payment &&
                                    <div className="my-3 flex-col rounded-lg bg-white py-3 px-4">
                                      <div className="flex">
                                        <DeliveryIcon />
                                        <p className="px-3 text-24 font-bold">Hình thức giao hàng</p>
                                      </div>
                                      <div className="form-check m-2 my-4">
                                        <div className="flex">
                                          <RadioGroup onChange={handleChangeReceiveMethod} defaultValue="delivery">
                                            <Grid container spacing={2}>
                                              {receiveOpts.map((method) => {
                                                const { value } = method;
                                                return (
                                                  <div key={value}>
                                                    <FormControlLabel
                                                      value={value}
                                                      control={<Radio />}
                                                      label={value === "delivery" ? 'Giao hàng tiêu chuẩn' : 'Nhận tại cửa hàng'}
                                                      sx={{ flexGrow: 1, py: 3 }}
                                                    />
                                                  </div>
                                                );
                                              })}
                                            </Grid>
                                          </RadioGroup>

                                        </div>
                                        <div className="my-3 grid grid-cols-2 gap-4">
                                          <div className="col-span-1">
                                            <RHFTextField name="name" label="Họ tên người nhận" />
                                          </div>
                                          <div className="col-span-1">
                                            <RHFTextField name="phone" label="Số điện thoại người nhận" />
                                          </div>
                                        </div>
                                        <div className="my-3 grid grid-cols-1 gap-4">
                                          <div className="col-span-1">
                                            <RHFTextField name="email" label="Email người nhận" />
                                          </div>
                                        </div>
                                        {!receiveAtStore &&
                                          <div className="my-3 grid w-full grid-cols-1 gap-4">
                                            <div className="col-span-1">
                                              <RHFTextField name="province" label="Tỉnh thành" />
                                            </div>
                                            <div className="col-span-1">
                                              <RHFTextField name="district" label="Quận huyện" />
                                            </div>
                                            <div className="col-span-1">
                                              <RHFTextField name="ward" label="Phường xã" />
                                            </div>
                                            <div className="col-span-3">
                                              <RHFTextField name="street" label="Địa chỉ" />
                                            </div>
                                          </div>
                                        }
                                        {/* <div className="my-3 grid w-full grid-cols-1 gap-4">
                                        <div className="col-span-1">
                                          <RHFTextField name="province" label="Tỉnh thành" />
                                        </div>
                                        <div className="col-span-1">
                                          <RHFTextField name="district" label="Quận huyện" />
                                        </div>
                                        <div className="col-span-1">
                                          <RHFTextField name="ward" label="Phường xã" />
                                        </div>
                                        <div className="col-span-3">
                                          <RHFTextField name="street" label="Địa chỉ" />
                                        </div>
                                      </div> */}
                                        {receiveAtStore &&
                                          <RHFTextField name="store" label="Chọn cửa hàng" />
                                        }
                                      </div>

                                    </div>
                                  }
                                  {payment &&
                                    <div className="my-3 flex-col rounded-lg bg-white py-3 px-4 max-md:hidden">
                                      <div className="flex">
                                        <PaymentIcon />
                                        <p className="px-3 pb-3 text-24 font-bold">Chọn hình thức thanh toán</p>
                                      </div>
                                      <RadioGroup onChange={handleChangePaymentMethod} defaultValue="paypal">
                                        <Stack>
                                          {paymentOpts.map((method) => {
                                            const { value, name } = method;
                                            return (
                                              <div key={value}>
                                                <FormControlLabel
                                                  value={value}
                                                  control={<Radio />}
                                                  label={name}
                                                  sx={{ flexGrow: 1 }}
                                                />
                                              </div>
                                            );
                                          })}
                                        </Stack>
                                      </RadioGroup>

                                    </div>
                                  }
                                </div>
                              ) : (
                                <div className="col-span-2 my-3 flex-col rounded-lg bg-white py-3 px-4">
                                  <div className="flex">
                                    <CartIcon />
                                    <p className="px-3 text-24 font-bold">Giỏ hàng ({allItems.length} sản phẩm)</p>
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <div className="w-full">
                                      <div className="grid grid-cols-7">
                                        <div className="col-span-3 px-2 py-2  text-left text-sm font-medium text-gray-900">Tên sản phẩm</div>
                                        <div className="col-span-1 px-2 py-2 text-right text-sm font-medium text-gray-900">Đơn giá</div>
                                        <div className="col-span-1 px-2 py-2 text-right text-sm font-medium text-gray-900">Số lượng</div>
                                        <div className="col-span-1 px-2 py-2 text-right text-sm font-medium text-gray-900">Thành tiền</div>
                                        <div className="col-span-1 px-2 py-2 text-right text-sm font-medium text-gray-900">Thao tác</div>
                                      </div>
                                      <div className="h-px w-full bg-border"></div>
                                      {
                                        allItems.map((e, index) => {
                                          const { id, quantity, productVariant } = e;
                                          return (
                                            <div className="grid w-full grid-cols-7 items-center max-md:hidden" key={index}>
                                              <div className="col-span-3 flex w-full flex-col items-center justify-start  overflow-hidden  px-2 py-2 text-sm text-gray-900">
                                                <div className="flex w-full items-center justify-start">
                                                  <div style={{ width: '20%' }}>
                                                    <img src={productVariant?.images?.imageUrl} width="61" height="64" alt="di động việt" style={{ height: '64px', objectFit: 'contain' }}></img>
                                                  </div>
                                                  <div style={{ width: '79%' }}>
                                                    <p className="px-3 text-left text-14">{productVariant?.name}</p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="whitespace-nowrap px-2 py-4 text-right text-sm font-bold text-gray-900">
                                                {fCurrency(productVariant?.price)}
                                                {/* {price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} */}
                                              </div>
                                              <div className="whitespace-nowrap px-2 py-4 text-right text-sm font-light text-gray-900">
                                                <div className="flex items-end justify-end">
                                                  <IconButton size="small" color="inherit" disabled={quantity <= 1}
                                                    onClick={() => handleDecreaseQuantity(id, quantity)}
                                                  >
                                                    <Iconify icon="eva:minus-fill" width={16} />
                                                  </IconButton>
                                                  <Typography variant="body2" component="span" sx={{ width: 15, textAlign: 'center', display: 'inline-block' }}>
                                                    {quantity}
                                                  </Typography>
                                                  <IconButton size="small" color="inherit" disabled={quantity >= parseInt(productVariant?.stock)}
                                                    onClick={() => handleIncreaseQuantity(id, quantity)}
                                                  >
                                                    <Iconify icon="eva:plus-fill" width={16} />
                                                  </IconButton>
                                                </div>

                                              </div>
                                              <div className="whitespace-nowrap px-2 py-4 text-right text-sm font-medium text-ddv">
                                                <p className="text-right text-14">{fCurrency(productVariant.price * quantity)}</p>
                                              </div>
                                              <div className="flex  justify-end whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900">
                                                <button className="text-center" type="button"
                                                  onClick={() => handleDeleteCart(id)}
                                                >
                                                  <DeleteIcon />
                                                </button>
                                              </div>
                                            </div>
                                          )
                                        })
                                      }
                                    </div>
                                  </div>
                                </div>
                              )}
                          <div className="col-span-1">
                            {clickOrder && !receiveAtStore && shippingAddress &&
                              <div className="my-3 w-full flex-col rounded-lg bg-white py-3 px-4">
                                <div className="flex items-center justify-start">
                                  <AddressIcon />
                                  <p className="px-3 text-24 font-bold">Địa chỉ giao hàng</p>
                                </div>
                                <p className="py-2 text-sm">{shippingAddress}</p>
                                <div className="flex w-full items-center justify-between">
                                  <p className="text-sm ">
                                    Điện thoại: {phoneNumber}
                                  </p>
                                  <button className="flex items-center" onClick={() => { setShippingAddress(""); setPayment(false); }}>
                                    <p className="pr-2 text-12 text-linkkhac">Chỉnh sửa</p>
                                    <EditIcon />
                                  </button>
                                </div>
                              </div>
                            }
                            {/* <div className="my-3 w-full flex-col rounded-lg bg-white py-3 px-4">
                              <div className="flex items-center justify-start">
                                <AddressIcon />
                                <p className="px-3 text-24 font-bold">Địa chỉ giao hàng</p>
                              </div>
                              <p className="py-2 text-sm">Vaicalon</p>
                            </div> */}
                            <div className="my-3 w-full flex-col rounded-lg bg-white py-3 px-4">
                              <div className="flex items-center justify-start">
                                <PriceIcon />

                                <p className="px-3 text-24 font-bold">Tạm tính</p>
                              </div>
                              {clickOrder && (
                                <div>
                                  <div className="flex items-center justify-between py-2">
                                    <p className="text-sm">Tiền hàng:</p>
                                    <p className="text-sm font-bold">{fCurrency(subTotal)}</p>
                                  </div>
                                  <div className="flex items-center justify-between py-2"><p className="text-sm">Phí vận chuyển:</p><p className="text-sm font-bold">0 đ</p></div>
                                </div>
                              )}
                              {clickOrder && !receiveAtStore && shippingAddress &&
                                <div className="flex items-center justify-between py-2">
                                  <p className="text-sm">Khuyến mãi:</p>
                                  <p className="text-sm font-bold">-0 đ</p>
                                </div>
                              }
                              <div className="line-ngang my-3 w-full"></div>
                              <div className="flex items-center justify-between py-2">
                                <p className="text-sm">Tổng cộng:</p>
                                <p className="text-sm font-bold text-ddv">{fCurrency(total)}</p>
                              </div>
                              {!clickOrder &&
                                <button className="border-1 relative flex w-full items-center justify-center rounded bg-ddv py-2" onClick={() => setClickOrder(true)}>
                                  <p className="text-14 font-bold text-white">Đặt hàng ({allItems.length})</p>
                                </button>
                              }
                              {clickOrder &&
                                <LoadingButton
                                  fullWidth
                                  className="border-1 relative flex w-full items-center justify-center rounded bg-ddv py-2"
                                  // color="inherit"
                                  size="large"
                                  type="submit"
                                  variant="contained"
                                  loading={isSubmitting}
                                >
                                  Thanh toán
                                </LoadingButton>
                              }
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="my-2 flex w-full flex-col items-center justify-center rounded bg-white">
                          <div className="flex w-full flex-col items-center justify-center pb-6">
                            <img alt="di động việt" src="https://didongviet.vn/images/pc/noresults.png"></img>
                            <p className="text-center text-16">Không có sản phẩm nào</p>
                            <button className="border-1 my-2 flex w-full items-center justify-center rounded bg-ddv py-2" style={{ width: '250px' }}>
                              <p className="text-14 font-bold text-white">Về trang chủ</p>
                            </button>
                            <p className="text-center text-sm text-black">
                              Khi cần trợ giúp, vui lòng gọi
                              <span className="font-bold text-link underline">
                                <a href="tel:18006018"> 1800.6018 </a>
                              </span>
                              (7:30 - 22:00)
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </FormProvider>
              </div >
            </main >
          </div >
        )
      }
    </>
  );
};
