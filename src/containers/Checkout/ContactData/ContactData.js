import React, { useState } from 'react';
import classes from './ContactData.module.css';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';
const ContactData = (props) => {
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your name',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your street',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'ZIP CODE',
      },
      value: '',
      validation: {
        required: true,
        minLength: 4,
        maxLength: 5,
      },
      valid: false,
      touched: false,
    },
    country: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Country',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your email',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: 'fastest', displayValue: 'Fastest' },
          { value: 'cheapest', displayValue: 'Cheapest' },
        ],
      },
      validation: {},
      valid: true,
      value: 'fastest',
      touched: false,
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangeHandler = (event, inputIdentifier) => {
    /* const updatedOrderForm = _.cloneDeep(orderForm);
    updatedOrderForm[inputIdentifier].value = event.target.value; //Works the same with lodash
    setState({ orderForm: updatedOrderForm }); */

    const updatedFormElement = updateObject(orderForm[inputIdentifier], {
      value: event.target.value,
      touched: true,
      valid: checkValidity(
        event.target.value,
        orderForm[inputIdentifier].validation
      ),
    });

    const updatedOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    setOrderForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const orderHandler = (event) => {
    event.preventDefault();
    const formData = {};

    for (let key in orderForm) {
      formData[key] = orderForm[key].value;
    }

    const orderData = {
      ingredients: props.ingredients,
      price: Number.parseFloat(props.price).toFixed(2),
      orderData: formData,
      userId: props.userId,
    };
    props.onOrderBurger(orderData, props.token);
  };

  const formElementsArray = [];
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key],
    });
  }
  let form = (
    <form>
      {formElementsArray.map((element, index) => {
        return (
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
        );
      })}
      <Button btnType="Success" clicked={orderHandler} disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (orderData, token) => {
      dispatch(orderActions.purchaseBurger(orderData, token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
