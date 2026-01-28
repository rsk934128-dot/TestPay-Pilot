'use server';

/**
 * @fileOverview A tool that interprets API response codes using an AI model.
 *
 * - interpretApiResponseCode - A function that interprets the API response code.
 * - InterpretApiResponseCodeInput - The input type for the interpretApiResponseCode function.
 * - InterpretApiResponseCodeOutput - The return type for the interpretApiResponseCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretApiResponseCodeInputSchema = z.object({
  responseCode: z.string().describe('The API response code to interpret.'),
  gatewayMessage: z.string().describe('The gateway message associated with the response code.'),
});
export type InterpretApiResponseCodeInput = z.infer<typeof InterpretApiResponseCodeInputSchema>;

const InterpretApiResponseCodeOutputSchema = z.object({
  interpretation: z.string().describe('A human-readable interpretation of the API response code and gateway message.'),
});
export type InterpretApiResponseCodeOutput = z.infer<typeof InterpretApiResponseCodeOutputSchema>;

export async function interpretApiResponseCode(input: InterpretApiResponseCodeInput): Promise<InterpretApiResponseCodeOutput> {
  return interpretApiResponseCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretApiResponseCodePrompt',
  input: {schema: InterpretApiResponseCodeInputSchema},
  output: {schema: InterpretApiResponseCodeOutputSchema},
  prompt: `You are an expert in interpreting API response codes from payment gateways like Stripe, SSLCommerz, and ShurjoPay.

You will be provided with an API response code and a gateway message. Your task is to provide a clear, human-readable interpretation. Structure your response in three parts using markdown:
1.  **Possible Cause:** A brief explanation of what this code and message likely mean in the context of a payment transaction.
2.  **Error Type:** Identify if it's more likely a user-side error (e.g., wrong card details, insufficient funds) or a system-side error (e.g., gateway configuration issue, network problem).
3.  **Suggested Fix:** Recommend a clear next step for the user or developer testing the system.

Response Code: {{{responseCode}}}
Gateway Message: {{{gatewayMessage}}}`,
});

const interpretApiResponseCodeFlow = ai.defineFlow(
  {
    name: 'interpretApiResponseCodeFlow',
    inputSchema: InterpretApiResponseCodeInputSchema,
    outputSchema: InterpretApiResponseCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
