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
  interpretation: z.string().describe('A human-readable interpretation of the API response code and gateway message, formatted in markdown.'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('The confidence level of the interpretation (High, Medium, or Low).'),
  explanationBasis: z.string().describe('A brief explanation of the basis for the interpretation.'),
});
export type InterpretApiResponseCodeOutput = z.infer<typeof InterpretApiResponseCodeOutputSchema>;

export async function interpretApiResponseCode(input: InterpretApiResponseCodeInput): Promise<InterpretApiResponseCodeOutput> {
  return interpretApiResponseCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretApiResponseCodePrompt',
  input: {schema: InterpretApiResponseCodeInputSchema},
  output: {schema: InterpretApiResponseCodeOutputSchema},
  prompt: `You are an expert in interpreting API response codes from payment gateways like Stripe, SSLCommerz, and ShurjoPay. Your model is Gemini.

You will be provided with an API response code and a gateway message. Your task is to provide a clear, human-readable interpretation, a confidence score, and the basis for your analysis.

For the 'interpretation' field, provide a markdown block with these exact sections:
- **Summary:** A single, concise sentence explaining the outcome.
- **Probable Cause:** A brief explanation of what this code and message likely mean.
- **Who should fix it?:** Identify if it's the User (customer), Merchant (developer), or Gateway (payment processor).
- **Recommended Action:** A clear, actionable next step for the identified party.

For the 'confidence' field, provide your confidence level: High, Medium, or Low.

For the 'explanationBasis' field, briefly explain what data points you used. For example: "Based on the standard banking error code '51' for insufficient funds and the clear gateway message."

---
INPUT:
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
