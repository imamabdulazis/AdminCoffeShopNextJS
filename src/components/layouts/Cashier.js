import React from "react";
import PropTypes from "prop-types";
import CashierNavbar from "@components/modules/Navbars/CashierNavbar";
import Sidebar from "@components/modules/Sidebars/Sidebar";
import styled, { createGlobalStyle } from "styled-components";
import Header from "@components/modules/Headers/Header";
import CashierSidebar from "../modules/Sidebars/CashierSidebar";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'radnika_next';
    src: url('/static/MaisonNeue-Medium.woff2')
    format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  html{
    --red:#ff0000;
    --black:#393939;
    --grey:#3A3A3A;
    --gray:var(--grey);
    --lightGrey:#e1e1e1;
    --lightGray:var(--lightGray);
    --offWhite:#ededed;
    --maxWidth:1000px;
    --bs:'0 12px 24px 0 rgba(0,0,0,0.99)';
    box-sizing: border-box;
    font-size: 62.5%;
  }

  *, *:before, *:after{
    box-sizing: inherit;
  }

  body {
    font-family: 'radnika_next', --apple--apple-system, 
    BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,  
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 
    sans-serif;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
  }

  a {
    text-decoration: none;
    color:var(--black)
  }
  a:hover{
    text-decoration: underline;
  }

  button {
    font-family: 'radnika_next', --apple--apple-system, 
    BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,  
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
  }
`;

const InnerStyles = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 2rem;
`;

function Cashier({ children }) {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <CashierSidebar />
      <InnerStyles>{children}</InnerStyles>
    </div>
  );
}

Cashier.propTypes = {
  cool: PropTypes.string,
  children: PropTypes.any,
};

export default Cashier;
