import React, { useState } from "react";
import styled from "styled-components";

const SidebarItems = [
  {
    name: "Dashboard",
  },
  {
    name: "Page 1",
  },
  {
    name: "Page 2",
  },
  {
    name: "Page 3",
  },
];

const SidebarParent = styled.div`
  background: #d4d4d4;
  width: 400px;
  height: 100vh;
  position: absolute;
  right: 0;
`;

const SidebarItem = styled.div`
  padding: 16px 24px;
  transition: all 0.25s ease-in-out;
  //Change the background color if 'active' prop is received
  background: ${(props) => (props.active ? "#b15b00" : "")};
  margin: 0px 12px;
  border-radius: 4px;

  p {
    color: white;
    font-weight: bold;
    text-decoration: none;
  }

  &:hover {
    cursor: pointer;
  }

  &:hover:not(:first-child) {
    background: #c34a36;
  }
`;

function CashierSidebar({ defaultActive }) {
  //If no active prop is passed, use `1` instead
  const [activeIndex, setActiveIndex] = useState(defaultActive || 1);
  return (
    <>
      <SidebarParent>
        <SidebarItem>
          <p>ORDER MINUM</p>
        </SidebarItem>
        {SidebarItems.map((item, index) => {
          return (
            <SidebarItem key={item.name} active={index === activeIndex}>
              <p>{item.name}</p>
            </SidebarItem>
          );
        })}
      </SidebarParent>
    </>
  );
}

export default CashierSidebar;
