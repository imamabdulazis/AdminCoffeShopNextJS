import React, { useContext, useEffect, useState } from "react";
import Admin from "@components/layouts/Admin";
import Image from "next/image";
// import moment from 'moment';
import { toast } from "react-toastify";
import { useAddCart } from "../../src/hooks/useCartContext";
import formatCurrency from "../../src/utils/formater";
import { useRouter } from "next/router";

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.id === item.id);
  if (i > -1) array[i] = item;
  else array.push(item);
}

export default function Kasir() {
  const router = useRouter();

  const { dispatch } = useAddCart();

  const [productState, setProductState] = useState([]);
  const [loading, setloading] = useState(false);

  const [temDrink, settemDrink] = useState([]);
  const [total, settotal] = useState(0);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      getProduct();
    } else {
      router.replace("/admin/login");
    }
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem("@previlage") === "admin") {
      router.replace("/admin/dashboard");
    }
  }, []);

  const AddCart = (el) => {
    // upsert(temDrink, { id: el.id, quantity: 1 });
    var objIndex = temDrink.findIndex((e) => e.id == el.id);
    var temTotal = total;
    console.info(objIndex);

    if (objIndex == -1) {
      temTotal += el.price;
      settotal(parseInt(temTotal));
      console.log(`IMUNNN :${temTotal}`);
      temDrink.push({
        id: el.id,
        image_url: el.image_url,
        name: el.name,
        quantity: 1,
        price: el.price,
        category: el.category.name,
      });
    } else {
      temDrink[objIndex].quantity += 1;
      temTotal = temDrink[objIndex].price * temDrink[objIndex].quantity;
      settotal(temTotal);
      console.log(total);
    }
    // console.info(temDrink);

    dispatch({
      type: "ADD_CART",
      drinks: temDrink,
      user: window.localStorage.getItem("user_id"),
      payment: "asdfsdfdsf",
    });
  };

  const getProduct = () => {
    setloading(true);
    fetch("/api/v1/drink", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          const data = res.data;
          setProductState(data);
          setloading(false);
        } else if (res.status == 401) {
          unAutorize();
          setloading(false);
        } else {
          setloading(false);
          toast.error(
            "Terjadi kesalahan data Minuman,  periksa kembali apakah berelasi dengan data lain"
          );
        }
      })
      .catch((e) => {
        setloading(false);
        toast.error("Internal Server Error");
        console.log(e);
      });
  };

  const addPutOrder = () => {
    dispatchDialog({
      type: "OPEN",
    });
  };

  const handleClose = () => {
    dispatchDialog({
      type: "CLOSE",
    });
  };

  return (
    <div className="flex flex-wrap mt-12">
      <>
        {loading ? (
          <div></div>
        ) : (
          <div className="container mx-auto">
            <div className="flex flex-wrap -mx-4">
              {productState.map((el) => (
                <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
                  <a
                    onClick={el.stock == 0 ? () => {} : () => AddCart(el)}
                    className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden"
                  >
                    <div className="relative pb-48 overflow-hidden">
                      <Image
                        className="absolute inset-0 h-full w-full object-cover"
                        layout="fill"
                        objectFit="contain"
                        src={el.image_url}
                        alt=""
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                        {el.category.name}
                      </span>
                      <h2 className="mt-2 mb-2  font-bold">{el.name}</h2>
                      {/* <p className="text-sm">{el.description}</p> */}
                      <div className="mt-3 flex items-center">
                        <span className="text-sm font-semibold">Rp</span>&nbsp;
                        <span className="font-bold text-xl">
                          {formatCurrency(el.price)}
                        </span>
                        &nbsp;<span className="text-sm font-semibold">,-</span>
                      </div>
                    </div>
                    <div className="p-4 border-t border-b text-gray-700">
                      <h3>{el.stock}</h3>
                    </div>
                    {el.stock == 0 ? (
                      <button
                        onClick={() => {}}
                        className="bg-red-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                      >
                        Habis
                      </button>
                    ) : (
                      <button
                        onClick={() => {}}
                        className="bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                      >
                        + Tambah
                      </button>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    </div>
  );
}

Kasir.layout = Admin;
