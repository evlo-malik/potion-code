import type { AI } from '@/components/ai/actions/actions';

import { openai } from '@ai-sdk/openai';
import { createStreamableValue, getMutableAIState, streamUI } from 'ai/rsc';

import { getSystemMessage } from '@/components/ai/actions/getSystemMessage';
import { toolSchemas } from '@/components/ai/actions/tool-schemas';
import { BotCard, BotMessage, SpinnerMessage } from '@/components/ai/message';
import { GenerateSuggestions } from '@/components/ai/ui/generate-suggestions';
import { Skeleton } from '@/components/ui/skeleton';
import { nid } from '@/lib/nid';

import { ExtractedAttributes } from '../ui/extract-attributes';
import { TraceSource } from '../ui/trace-source';

import 'server-only';

export async function submitUserMessage(content: string) {
  'use server';

  // await rateLimit();

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nid(),
        content: `${aiState.get().interactions?.join('\n\n')}\n\n${content}`,
        role: 'user',
      },
    ],
  });

  const history = aiState.get().messages.map((message: any) => ({
    content: message.content,
    role: message.role,
  }));

  let textStream: ReturnType<typeof createStreamableValue<string>> | undefined;
  let textNode: React.ReactNode | undefined;

  const result = await streamUI({
    initial: <SpinnerMessage />,
    messages: [...history],
    model: openai('gpt-4o-mini'),
    system: getSystemMessage(),
    temperature: 0,
    tools: {
      // TODO: multiple documents
      answerByDocument: {
        ...toolSchemas.answerByDocument,
        generate: function* (args) {
          yield (
            <BotCard>
              <Skeleton />
            </BotCard>
          );

          const toolCallId = nid();

          aiState.done({
            ...aiState.get(),
            interactions: [],
            messages: [
              ...aiState.get().messages,
              {
                id: nid(),
                content: [
                  {
                    // `I've extracted key information from the document. Review the details below and let me know if you need further actions.`
                    args,
                    toolCallId,
                    toolName: 'extractData',
                    type: 'tool-call',
                  },
                ],
                role: 'assistant',
              },
              {
                id: nid(),
                content: [
                  {
                    result: args,
                    toolCallId,
                    toolName: 'extractData',
                    type: 'tool-result',
                  },
                ],
                role: 'tool',
              },
            ],
          });

          return (
            <BotCard>
              <TraceSource {...args} />
            </BotCard>
          );
        },
      },
      extractData: {
        ...toolSchemas.extractData,
        generate: function* (args) {
          yield (
            <BotCard>
              <Skeleton />
            </BotCard>
          );

          const toolCallId = nid();

          aiState.done({
            ...aiState.get(),
            interactions: [],
            messages: [
              ...aiState.get().messages,
              {
                id: nid(),
                content: [
                  {
                    // `I've extracted key information from the document. Review the details below and let me know if you need further actions.`
                    args,
                    toolCallId,
                    toolName: 'extractData',
                    type: 'tool-call',
                  },
                ],
                role: 'assistant',
              },
              {
                id: nid(),
                content: [
                  {
                    result: args,
                    toolCallId,
                    toolName: 'extractData',
                    type: 'tool-result',
                  },
                ],
                role: 'tool',
              },
            ],
          });

          return (
            <BotCard>
              <ExtractedAttributes {...args} />
            </BotCard>
          );
        },
      },
      generateSuggestions: {
        ...toolSchemas.generateSuggestions,
        generate: function* (args) {
          yield (
            <BotCard>
              <Skeleton />
            </BotCard>
          );

          const toolCallId = nid();

          aiState.done({
            ...aiState.get(),
            interactions: [],
            messages: [
              ...aiState.get().messages,
              {
                id: nid(),
                content: [
                  {
                    // content: `I've generated document suggestions. Review the details below and let me know if you need further actions.`,
                    args,
                    toolCallId,
                    toolName: 'generateSuggestions',
                    type: 'tool-call',
                  },
                ],
                role: 'assistant',
              },
              {
                id: nid(),
                content: [
                  {
                    result: args,
                    toolCallId,
                    toolName: 'generateSuggestions',
                    type: 'tool-result',
                  },
                ],
                role: 'tool',
              },
            ],
          });

          return (
            <BotCard>
              <GenerateSuggestions {...args} />
            </BotCard>
          );
        },
      },
    },
    text: ({ content, delta, done }) => {
      if (!textStream) {
        textStream = createStreamableValue('');
        textNode = <BotMessage content={textStream.value} />;
      }
      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nid(),
              content,
              role: 'assistant',
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
  });

  return {
    id: nid(),
    display: result.value,
  };
}

// void (async () => {
//   try {
//     const result = await experimental_streamText({
//       model: openaiProvider('gpt-4-turbo'),
//       temperature: 0,
//       tools,
//       system: getSystemMessage({ document: mockDocument }),
//       messages: [...history]
//     })
//
//     spinnerStream.done(null)
//
//     let textContent = ''
//
//     for await (const delta of result.fullStream) {
//       const { type } = delta
//
//       if (type === 'text-delta') {
//         const { textDelta } = delta
//
//         textContent += textDelta
//         messageStream.update(<BotMessage content={textContent} />)
//
//         aiState.update({
//           ...aiState.get(),
//           messages: [
//             ...aiState.get().messages,
//             {
//               id: nid(),
//               role: 'assistant',
//               content: textContent
//             }
//           ]
//         })
//       } else if (type === 'tool-call') {
//         const { toolName, args } = delta
//
//         if (toolName === 'extractData') {
//           uiStream.update(
//             <BotCard>
//               <ExtractedAttributes {...args} />
//             </BotCard>
//           )
//
//           aiState.done({
//             ...aiState.get(),
//             interactions: [],
//             messages: [
//               ...aiState.get().messages,
//               {
//                 id: nid(),
//                 role: 'assistant',
//                 content: `I've extracted key information from the document. Review the details below and let me know if you need further actions.`,
//                 display: {
//                   name: 'extractData',
//                   props: args
//                 }
//               }
//             ]
//           })
//         }
// else if (toolName === 'showFlights') {
//   aiState.done({
//     ...aiState.get(),
//     interactions: [],
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nid(),
//         role: 'assistant',
//         content:
//           "Here's a list of flights for you. Choose one and we can proceed to pick a seat.",
//         display: {
//           name: 'showFlights',
//           props: {
//             summary: args
//           }
//         }
//       }
//     ]
//   })
//
//   uiStream.update(
//     <BotCard>
//       <ListFlights summary={args} />
//     </BotCard>
//   )
// } else if (toolName === 'showSeatPicker') {
//   aiState.done({
//     ...aiState.get(),
//     interactions: [],
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nid(),
//         role: 'assistant',
//         content:
//           "Here's a list of available seats for you to choose from. Select one to proceed to payment.",
//         display: {
//           name: 'showSeatPicker',
//           props: {
//             summary: args
//           }
//         }
//       }
//     ]
//   })
//
//   uiStream.update(
//     <BotCard>
//       <SelectSeats summary={args} />
//     </BotCard>
//   )
// } else if (toolName === 'showHotels') {
//   aiState.done({
//     ...aiState.get(),
//     interactions: [],
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nid(),
//         role: 'assistant',
//         content:
//           "Here's a list of hotels for you to choose from. Select one to proceed to payment.",
//         display: {
//           name: 'showHotels',
//           props: {}
//         }
//       }
//     ]
//   })
//
//   uiStream.update(
//     <BotCard>
//       <ListHotels />
//     </BotCard>
//   )
// } else if (toolName === 'checkoutBooking') {
//   aiState.done({
//     ...aiState.get(),
//     interactions: []
//   })
//
//   uiStream.update(
//     <BotCard>
//       <PurchaseTickets />
//     </BotCard>
//   )
// } else if (toolName === 'showBoardingPass') {
//   aiState.done({
//     ...aiState.get(),
//     interactions: [],
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nid(),
//         role: 'assistant',
//         content:
//           "Here's your boarding pass. Please have it ready for your flight.",
//         display: {
//           name: 'showBoardingPass',
//           props: {
//             summary: args
//           }
//         }
//       }
//     ]
//   })
//
//   uiStream.update(
//     <BotCard>
//       <BoardingPass summary={args} />
//     </BotCard>
//   )
// } else if (toolName === 'showFlightStatus') {
//   aiState.update({
//     ...aiState.get(),
//     interactions: [],
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nid(),
//         role: 'assistant',
//         content: `The flight status of ${args.flightCode} is as follows:
//       Departing: ${args.departingCity} at ${args.departingTime} from ${args.departingAirport} (${args.departingAirportCode})
//       `
//       }
//     ],
//     display: {
//       name: 'showFlights',
//       props: {
//         summary: args
//       }
//     }
//   })
//
//   uiStream.update(
//     <BotCard>
//       <FlightStatus summary={args} />
//     </BotCard>
//   )
// }
//   }
// }
//
//     uiStream.done()
//     textStream.done()
//     messageStream.done()
//   } catch (e) {
//     const error = new Error(
//       e
//       // 'The AI got rate limited, please try again later.'
//     )
//     uiStream.error(error)
//     textStream.error(error)
//     messageStream.error(error)
//     aiState.done(() => {})
//   }
// })()
