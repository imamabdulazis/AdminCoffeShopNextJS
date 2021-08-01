import React, { useEffect, useState } from "react";
import { createPopper } from "@popperjs/core";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const UserDropdown = () => {
  const [imageState, setImageState] = useState('/img/user.png');
  const [userState,setUserState]=useState(null);
  //router
  const router = useRouter();
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const onLogout = (e) => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('@previlage')
    router.replace('/')
  }

  useEffect(() => {
    getDetailUser();
  }, [])

  // get user
  const getDetailUser = (id) => {
    fetch(`/api/v1/users/${window.localStorage.getItem('user_id')}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
      },
    }).then(res => res.json())
      .then((res) => {

        if (res.status == 200) {
          const data = res.data;
          setImageState(data.image_url);
          setUserState(data);
        } else if (res.status == 401) {
          unAutorize();
        } else {
          console.info(res)
          toast.error("Terjadi kesalahan data users, periksa kembali apakah berelasi dengan data lain")
        }
      }).catch(e => {
        toast.error("Internal Server Error")
        console.log(e);
      })
  }

  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="..."
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={imageState}
            />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
       <p
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
        >
          {userState!=null?userState.name:"Nama"}
        </p>
         <p
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
        >
        {userState!=null?userState.email:"Email"}
        </p>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={onLogout}
        >
          Log Out
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
