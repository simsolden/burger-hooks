import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = (props) => {
  const [controls, setControls] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your email',
      },
      value: '',
      validation: {
        required: true,
        isEmail: true,
        minLength: 6,
        maxLength: 20,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password',
      },
      value: '',
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const { onSetAuthRedirectPath, buildingBurger, authRedirectPath } = props;

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    }
  }, [onSetAuthRedirectPath, buildingBurger, authRedirectPath]);

  const submitSignInHandler = (event) => {
    event.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, false);
  };

  const submitSignUpHandler = (event) => {
    event.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, true);
  };

  const inputChangeHandler = (event, controlsName) => {
    const updatedControls = updateObject(controls, {
      [controlsName]: updateObject(controls[controlsName], {
        value: event.target.value,
        touched: true,
        valid: checkValidity(
          event.target.value,
          controls[controlsName].validation
        ),
      }),
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedControls) {
      formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
    }

    setControls(updatedControls);
    setFormIsValid(formIsValid);
  };

  const formElementsArray = [];
  for (let key in controls) {
    formElementsArray.push({
      id: key,
      config: controls[key],
    });
  }
  let form = formElementsArray.map((element, index) => (
    <Input
      elementType={element.config.elementType}
      elementConfig={element.config.elementConfig}
      value={element.config.value}
      name={element.id}
      key={element.id + index}
      invalid={!element.config.valid}
      shouldValidate={element.config.validation}
      touched={element.config.touched}
      changed={(event) => inputChangeHandler(event, element.id)}
    />
  ));

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;

  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }

  let authRedirect = null;
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirect} />;
  }

  return (
    <div className={classes.Form}>
      {authRedirect}
      {errorMessage}
      <form>
        {form}

        <Button
          clicked={submitSignInHandler}
          btnType="Success"
          disabled={!formIsValid}
        >
          Log In
        </Button>
        <Button
          clicked={submitSignUpHandler}
          btnType="Success"
          disabled={!formIsValid}
        >
          Sign up
        </Button>
      </form>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirect: state.auth.authRedirectPath,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
