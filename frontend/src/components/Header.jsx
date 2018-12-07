import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';

const Header = () => (
  <div>
    <Navbar color="light" light expamd="md">
      <NavbarBrand href="/">ChainerRL Visualizer</NavbarBrand>
    </Navbar>
  </div>
);

export default Header;
