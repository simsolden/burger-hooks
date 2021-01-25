import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  const sideDrawerClosedHandler = () => {
    setShowSideDrawer(false);
  };

  const sideDrawerOpenHandler = () => {
    setShowSideDrawer((prevState) => !prevState);
  };

  return (
    <Fragment>
      <Toolbar isAuth={props.isAuthenticated} open={sideDrawerOpenHandler} />
      <SideDrawer
        isAuth={props.isAuthenticated}
        show={showSideDrawer}
        closed={sideDrawerClosedHandler}
      />
      <main className={classes.Content}>{props.children}</main>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
