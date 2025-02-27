const db = require("~/models");
export const addProductToCart = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let cartData = {};
            cartData.cart = {};
            cartData.errMessage = null;
            cartData.message = null;
            const { productVariantId, inventoryId } = data.body;
            const userId = data.user.id;
            let findInventory = await db.Inventory.findOne({
                where: {
                    id: inventoryId
                }
            });
            if (!findInventory) {
                cartData.errMessage = "Inventory not exist";
            } else {
                if (findInventory.stock < 1) {
                    cartData.errMessage = "Item quantity can't exceed the available stock";
                }
                else {
                    if (!productVariantId || !userId) {
                        cartData.errMessage = "Không xác định";
                    }
                    else {
                        const cartItemExist = await db.Cart.findOne({
                            where: {
                                productVariantId: productVariantId,
                                inventoryId: inventoryId,
                                userId: userId
                            },
                            raw: false
                        })
                        if (cartItemExist) {
                            cartItemExist.quantity = cartItemExist.quantity + 1;
                            await cartItemExist.save();
                            const carts = await db.Cart.findAll({
                                where: {
                                    userId: userId
                                },
                                include: [
                                    {
                                        model: db.ProductVariant,
                                        as: 'productVariant',
                                        attributes: ['name', 'price', 'marketPrice'],
                                        include: [
                                            { model: db.ProductImage, as: 'images', attributes: ['imageUrl'] },
                                        ]
                                    },
                                ],
                                raw: true,
                                nest: true
                            });
                            const uniqueCarts = {};

                            carts.forEach(cart => {
                                const cartId = cart.id;

                                // Nếu chưa gặp variantId này, thêm vào uniqueCarts
                                if (!uniqueCarts[cartId]) {
                                    uniqueCarts[cartId] = {
                                        ...cart,
                                        productVariant: {
                                            ...cart.productVariant,
                                            images: cart.productVariant.images
                                        }
                                    };
                                }
                            });
                            const result = Object.values(uniqueCarts);
                            cartData.cart = result;
                            cartData.message = "Thêm thành công";
                        }
                        else {
                            const cartItem = await db.Cart.create({
                                productVariantId: productVariantId,
                                inventoryId: inventoryId,
                                userId: userId
                            })
                            const carts = await db.Cart.findAll({
                                where: {
                                    userId: userId
                                },
                                include: [
                                    {
                                        model: db.ProductVariant,
                                        as: 'productVariant',
                                        attributes: ['name', 'price', 'marketPrice'],
                                        include: [
                                            { model: db.ProductImage, as: 'images', attributes: ['imageUrl'] },
                                        ]
                                    },
                                    {
                                        model: db.Inventory,
                                        as: 'inventory',
                                        attributes: ['stock'],
                                    },
                                ],
                                raw: true,
                                nest: true
                            });
                            const uniqueCarts = {};

                            carts.forEach(cart => {
                                const cartId = cart.id;

                                // Nếu chưa gặp variantId này, thêm vào uniqueCarts
                                if (!uniqueCarts[cartId]) {
                                    uniqueCarts[cartId] = {
                                        ...cart,
                                        productVariant: {
                                            ...cart.productVariant,
                                            images: cart.productVariant.images
                                        }
                                    };
                                }
                            });

                            const result = Object.values(uniqueCarts);
                            cartData.cart = result;
                            cartData.message = "Thêm thành công";
                        }
                    }
                }
            }
            resolve(cartData);
        } catch (error) {
            reject(error);
        }
    });

export const updateItemQuantity = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let cartData = {};
            cartData.cart = {};
            cartData.errMessage = null;
            cartData.success = false;
            cartData.message = null;
            const { cartId, quantity, delta } = data;
            const userCart = await db.Cart.findOne({
                where: {
                    id: cartId
                },
                include: [
                    {
                        model: db.Inventory,
                        as: 'inventory',
                        attributes: ['stock'],
                    },
                ],
                raw: false
            });
            if (!userCart) {
                cartData.errMessage = 'This item not exits in your cart';
            }
            else {
                let qty = userCart.quantity + delta;
                if (qty > userCart.inventory.stock) {
                    cartData.errMessage = "Item quantity can't exceed the available stock";
                } else {
                    if (qty <= 0) {
                        await db.Cart.destroy({
                            where: {
                                id: cartId
                            },
                        });
                    } else {
                        userCart.quantity += delta;
                        await userCart.save();
                    }
                    cartData.success = true;
                    cartData.message = "Update quantity sucessfully";
                }
            }
            resolve(cartData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteItem = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let cartData = {};
            cartData.errMessage = null;
            cartData.success = false;
            cartData.message = null;
            cartData.cartId = null;
            const { cartId } = data;
            const userCart = await db.Cart.findOne({
                where: {
                    id: cartId
                },
                raw: false
            });
            if (!userCart) {
                cartData.errMessage = 'This item not exits in your cart';
            }
            else {
                await db.Cart.destroy({
                    where: {
                        id: cartId
                    },
                });
                cartData.success = true;
                cartData.message = "Delete item successfully";
                cartData.cartId = cartId;
            }
            resolve(cartData);
        } catch (error) {
            reject(error);
        }
    });
