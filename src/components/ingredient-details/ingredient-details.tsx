import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  isIngredientsLoading,
  selectIngredients
} from '../../services/slices/ingredients';
import { useParams } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const loading = useSelector(isIngredientsLoading);
  useEffect(() => {
    if (ingredients.length === 0 && !loading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, loading]);
  const ingredientData = ingredients.find(
    (ingredients) => ingredients._id === id
  );

  if (loading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
