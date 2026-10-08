
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const CartContext = createContext();


export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState(() => {

    try {

      const savedCart =
        localStorage.getItem("cart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    } catch (error) {

      localStorage.removeItem("cart");

      return [];

    }

  });


  /*
    Save cart whenever it changes
  */

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);


  /*
    ADD TO CART

    product  = complete product object
    quantity = quantity selected by user
  */

  const addToCart = (
    product,
    quantity = 1
  ) => {

    setCartItems((currentItems) => {

      const existingItem =
        currentItems.find(
          (item) =>
            item.id === product.id
        );


      /*
        Product already exists
      */

      if (existingItem) {

        const newQuantity =
          existingItem.quantity +
          quantity;


        /*
          Don't exceed stock
        */

        const finalQuantity =
          Math.min(
            newQuantity,
            product.stock
          );


        return currentItems.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    finalQuantity
                }
              : item
        );

      }


      /*
        New product
      */

      return [

        ...currentItems,

        {
          ...product,
          quantity:
            Math.min(
              quantity,
              product.stock
            )
        }

      ];

    });

  };


  /*
    UPDATE QUANTITY
  */

  const updateQuantity = (
    productId,
    newQuantity
  ) => {

    setCartItems((currentItems) => {

      return currentItems
        .map((item) => {

          if (
            item.id !== productId
          ) {
            return item;
          }


          /*
            Don't allow quantity
            below 1
          */

          if (newQuantity < 1) {
            return item;
          }


          /*
            Don't exceed stock
          */

          const quantity =
            Math.min(
              newQuantity,
              item.stock
            );


          return {
            ...item,
            quantity
          };

        });

    });

  };


  /*
    REMOVE FROM CART
  */

  const removeFromCart = (
    productId
  ) => {

    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.id !== productId
      )
    );

  };


  /*
    INCREASE QUANTITY
  */

  const increaseQuantity = (
    productId
  ) => {

    setCartItems((currentItems) =>

      currentItems.map((item) => {

        if (
          item.id !== productId
        ) {
          return item;
        }


        const newQuantity =
          Math.min(
            item.quantity + 1,
            item.stock
          );


        return {
          ...item,
          quantity:
            newQuantity
        };

      })

    );

  };


  /*
    DECREASE QUANTITY
  */

  const decreaseQuantity = (
    productId
  ) => {

    setCartItems((currentItems) =>

      currentItems
        .map((item) => {

          if (
            item.id !== productId
          ) {
            return item;
          }


          return {
            ...item,
            quantity:
              item.quantity - 1
          };

        })

        .filter(
          (item) =>
            item.quantity > 0
        )

    );

  };


  /*
    CLEAR CART
  */

  const clearCart = () => {

    setCartItems([]);

  };


  /*
    NUMBER OF ITEMS
  */

  const cartItemCount =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  /*
    SUBTOTAL

    Uses product.price
  */

  const subtotal =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );


  /*
    DISCOUNT

    originalPrice - selling price
  */

  const discount =
    cartItems.reduce(
      (total, item) => {

        const itemDiscount =
          item.originalPrice
            ? item.originalPrice -
              item.price
            : 0;


        return (
          total +
          itemDiscount *
          item.quantity
        );

      },
      0
    );


  /*
    DELIVERY

    Free above ₹999
    Otherwise ₹49
  */

  const deliveryCharge =
    subtotal === 0
      ? 0
      : subtotal >= 999
        ? 0
        : 49;


  /*
    FINAL TOTAL
  */

  const total =
    subtotal +
    deliveryCharge;


  return (

    <CartContext.Provider
      value={{

        cartItems,

        addToCart,

        updateQuantity,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        cartItemCount,

        subtotal,

        discount,

        deliveryCharge,

        total

      }}
    >

      {children}

    </CartContext.Provider>

  );

}


export function useCart() {

  return useContext(CartContext);

}
