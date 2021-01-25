import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from '../../axios-orders';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index'; //index could me omitted since it is called index and only index in folder

const BurgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  const [ingredients, totalPrice, error, isAuthenticated] = useSelector(
    (state) => {
      return [
        state.burgerBuilder.ingredients,
        state.burgerBuilder.totalPrice,
        state.burgerBuilder.error,
        state.auth.token !== null,
      ];
    }
  );

  const dispatch = useDispatch();

  const onInitIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onRemoveIngredient = (ingType) =>
    dispatch(actions.removeIngredient(ingType));
  const onAddIngredient = (ingType) => dispatch(actions.addIngredient(ingType));
  const onSetAuthRedirectPath = (path) =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => onInitIngredients(), [onInitIngredients]);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.values(ingredients).reduce((acc, el) => acc + el);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onInitPurchase();
    props.history.push('/checkout');
  };

  const disabledInfo = { ...ingredients };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  let orderSummary = null;

  let burger = error ? <p>Error loading burgers ingredients</p> : <Spinner />;
  if (ingredients) {
    burger = (
      <Fragment>
        <Burger ingredients={ingredients} />
        <BuildControls
          ingredientAdded={onAddIngredient}
          ingredientRemoved={onRemoveIngredient}
          disabled={disabledInfo}
          purchasable={updatePurchaseState(ingredients)}
          price={totalPrice}
          isAuth={isAuthenticated}
          order={purchaseHandler}
        />
      </Fragment>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ingredients}
        modalClosed={purchaseCancelHandler}
        modalContinue={purchaseContinueHandler}
        totalPrice={totalPrice}
      />
    );
  }

  return (
    <Fragment>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Fragment>
  );
};

export default withErrorHandler(BurgerBuilder, axios);
