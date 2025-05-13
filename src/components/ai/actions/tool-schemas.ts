import type { streamUI } from 'ai/rsc';

import { z } from 'zod';

export type answerByDocument = z.infer<
  (typeof toolSchemas)['answerByDocument']['parameters']
>;

export type ExtractData = z.infer<
  (typeof toolSchemas)['extractData']['parameters']
>;

export type GenerateSuggestionsData = z.infer<
  (typeof toolSchemas)['generateSuggestions']['parameters']
>;

export const toolSchemas = {
  answerByDocument: {
    description: 'Answer the question according to the document',
    parameters: z.object({
      answer: z
        .string()
        .describe('The answer given in the context of the document.'),
      source: z.string().describe('The exact quote (unmodified) from document'),
    }),
  },
  extractData: {
    description: `Extract data from the document.`,
    parameters: z.object({
      attributes: z
        .array(
          z.object({
            name: z
              .string()
              .describe(
                'The name of the attribute that the user wants to extract from the document'
              ),
            quote: z
              .string()
              .describe('The exact quote (unmodified) from document'),
            type: z
              .enum(['inputText', 'textarea', 'inputNumber', 'date'])
              .describe(
                'The type of the attribute that the user wants to extract from the document. date format is "yyyy-mm-dd"'
              ),
            value: z.string().describe('The value of the attribute'),
          })
        )
        .describe(
          `An array specifying which attributes the user wants to extract, with each attribute potentially having multiple suggested values for selection.`
        ),
      // suggestedAttributes: z
      //   .array(z.string())
      //   .min(3)
      //   .max(10)
      //   .describe(
      //     'A list of 10 suggested attributes for possible extraction in the next prompt'
      //   )
    }),
  },
  generateSuggestions: {
    description: 'Suggest edits in the document',
    parameters: z.object({
      replaceSuggestions: z
        .array(
          z.object({
            newValue: z
              .string()
              .describe('The new value to replace the old value with'),
            oldValue: z
              .string()
              // .min(1)
              .describe(
                'The exact value (unmodified) from document to replace'
              ),
            // type: z
            //   .enum(['replace', 'insertAfter', 'insertBefore'])
            //   .describe(
            //     'The type of the attribute that the user wants to extract from the document. date format is "yyyy-mm-dd"'
            //   )
          })
        )
        // .min(1)
        .describe(
          'A list of suggestions for the user to review and apply to the document using find & replace editor tool'
        ),
    }),
  },
} satisfies Parameters<typeof streamUI>[0]['tools'];

export type ToolName = keyof typeof toolSchemas;
