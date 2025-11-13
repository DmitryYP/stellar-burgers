import { ChangeEvent, useState } from 'react';

export type TFormValues = Record<string, string>;

export const useForm = <T extends TFormValues>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  return { values, handleChange, reset };
};
