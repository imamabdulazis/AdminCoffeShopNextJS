import React, { useState } from "react";
import Link from 'next/link';
import NavStyles from "@styles/NavStyles";

function CashierNavbar() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <NavStyles>
      <Link href="/products">Product</Link>
      <Link href="/sell">Sell</Link>
      <Link href="/orders">Orders</Link>
      <Link href="/account">Account</Link>
      <Link href="/account">Account</Link>
      <Link href="/account">Account</Link>
      <Link href="/account">Account</Link>
    </NavStyles>
  );
}

export default CashierNavbar;
