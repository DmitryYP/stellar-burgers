import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { selectUser } from '../../services/slices/user';
import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  selectOrderModalData,
  selectFeedLoading,
  clearCurrentOrder,
  clearOrderModal
} from '../../services/slices/feed';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearConstructor } from '../../services/slices/constructor';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bun, ingredients } = useSelector(
    (state) => state.burgerConstructor.burger
  );
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectFeedLoading);
  const orderModalData = useSelector(selectOrderModalData);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!bun || orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientsIds = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    if (orderModalData) {
      dispatch(clearConstructor());
      dispatch(clearCurrentOrder());
      dispatch(clearOrderModal());
    }
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
