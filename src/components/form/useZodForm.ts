import { type UseFormProps, useForm } from 'react-hook-form';

import type { ZodType } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

type UseZodFormOptions<TSchema extends ZodType> = {
  schema: TSchema;
  defaultValuesStorage?: UseFormProps<TSchema['_input']>['defaultValues'];
} & Omit<UseFormProps<TSchema['_input']>, 'resolver'>;

export function useZodForm<TSchema extends ZodType>({
  defaultValuesStorage,
  ...props
}: UseZodFormOptions<TSchema>) {
  return useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema as any),
  });
}
