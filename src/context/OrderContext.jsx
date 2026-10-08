import {
  createContext,
  useContext,
  useState
} from "react";

const OrderContext = createContext();


function getSavedOrders() {
  try {
    const savedOrders =
      localStorage.getItem("orders");

    return savedOrders
      ? JSON.parse(savedOrders)
      : [];

  } catch (error) {

    localStorage.removeItem("orders");

    return [];
  }
}


export function OrderProvider({ children }) {

  const [orders, setOrders] =
    useState(getSavedOrders);


  const createOrder = ({
    items,
    address,
    paymentMethod,
    subtotal,
    deliveryCharge,
    total
  }) => {

    const newOrder = {

      id: `ORD-${Date.now()}`,

      orderDate:
        new Date().toISOString(),

      status: "PLACED",

      items,

      address,

      paymentMethod,

      subtotal,

      deliveryCharge,

      total
    };


    const updatedOrders = [
      newOrder,
      ...orders
    ];


    setOrders(updatedOrders);


    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );


    return newOrder;
  };


  const getOrderById = (orderId) => {

    return orders.find(
      (order) => order.id === orderId
    );
  };


  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}


export function useOrders() {
  return useContext(OrderContext);
}
