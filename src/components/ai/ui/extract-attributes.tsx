'use client';

import type { ExtractData } from '@/components/ai/actions/tool-schemas';

import { useEditorRef } from '@udecode/plate/react';
import { z } from 'zod';

import { useMyActions, useMyUIState } from '@/components/ai/utils/ai-hooks';
import { selectByText } from '@/components/editor/utils';
import { useZodForm } from '@/components/form/useZodForm';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/registry/default/potion-ui/button';
import { Input } from '@/registry/default/potion-ui/input';
import { Textarea } from '@/registry/default/potion-ui/textarea';

const getGenerateSuggestionsMessage = (
  values: { name: string; newValue: string; oldValue: string }[]
) => {
  const message = values
    .map(
      ({ name, newValue, oldValue }) => `[${name} - old value]
${oldValue}
[${name} - new value]
${newValue}`
    )
    .join('\n');

  return `I have modified attribute values you have extracted. Please generate suggestions I can apply to the document:
${message}`;
};

export const ExtractedAttributes = ({ attributes }: ExtractData) => {
  const { submitUserMessage } = useMyActions();
  const [, setMessages] = useMyUIState();
  const editor = useEditorRef();

  const defaultValues: any = {};

  attributes.forEach(({ name, value }) => {
    defaultValues[name] = value;
  });

  const form = useZodForm({
    defaultValues,
    schema: z.any(),
  });

  return (
    <div className="grid gap-4">
      <p>
        Below are the attributes extracted from the document. Please review and
        select or edit as needed.
      </p>
      <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(() => {
              // create.mutate(values);
            })}
          >
            {attributes.map((item) => (
              <FormField
                name={item.name}
                key={item.name}
                control={form.control}
                render={({ field }) => {
                  const inputs = {
                    // date: (
                    //   <DatePickerInput
                    //     {...field}
                    //     data-1p-ignore
                    //     onValueChange={(value) =>
                    //       form.setValue(item.name, value)
                    //     }
                    //     placeholder="Enter a date"
                    //   />
                    // ),
                    inputNumber: (
                      <Input
                        {...field}
                        placeholder="Enter a value"
                        data-1p-ignore
                        type="number"
                      />
                    ),
                    inputText: (
                      <Input
                        {...field}
                        placeholder="Enter a value"
                        data-1p-ignore
                      />
                    ),
                    textarea: (
                      <Textarea
                        {...field}
                        placeholder="Enter a value"
                        data-1p-ignore
                        rows={3}
                      />
                    ),
                  };

                  const isDirty = field.value !== defaultValues[item.name];

                  return (
                    <FormItem>
                      <div className="mb-1 flex h-5 items-center gap-1">
                        <FormLabel>{item.name}</FormLabel>
                        {isDirty && (
                          <Button
                            size="none"
                            variant="ghost"
                            className="p-2"
                            onClick={() => {
                              form.resetField(item.name);
                            }}
                          >
                            <Icons.reset className="size-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        {inputs[item.type] ?? (
                          <Input
                            {...field}
                            placeholder="Enter a value"
                            data-1p-ignore
                          />
                        )}
                      </FormControl>

                      <FormDescription
                        className="cursor-pointer"
                        onClick={() => {
                          selectByText(editor as any, item.quote);
                        }}
                      >
                        Source: {item.quote}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}

            <div className="mt-4 flex justify-end gap-4">
              {form.formState.isDirty && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    const dirtyFields = form.formState.dirtyFields;
                    const values = form.getValues();

                    const response = await submitUserMessage(
                      getGenerateSuggestionsMessage(
                        Object.entries(dirtyFields).map(([key]) => ({
                          name: key,
                          newValue: values[key],
                          oldValue: defaultValues[key],
                        }))
                      )
                    );
                    setMessages((currentMessages: any[]) => [
                      ...currentMessages,
                      response,
                    ]);
                  }}
                >
                  <Icons.ai className="size-4" />
                  Generate Document Suggestions
                </Button>
              )}
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// export const Destinations = ({ destinations }: { destinations: string[] }) => {
//   const { submitUserMessage } = useMyActions()
//   const [, setMessages] = useMyUIState()
//
//   return (
//     <div className="grid gap-4">
//       <p>
//         Here is a list of holiday destinations based on the books you have read.
//         Choose one to proceed to booking a flight.
//       </p>
//       <div className="flex flex-col sm:flex-row items-start gap-2">
//         {destinations.map(destination => (
//           <button
//             className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
//             key={destination}
//             onClick={async () => {
//               const response = await submitUserMessage(
//                 `I would like to fly to ${destination}, proceed to choose flights.`
//               )
//               setMessages((currentMessages: any[]) => [
//                 ...currentMessages,
//                 response
//               ])
//             }}
//           >
//             {destination}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }
