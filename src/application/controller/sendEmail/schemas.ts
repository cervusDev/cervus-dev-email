import z from 'zod';

export const sendEmailControllerSchemaRequest = z.object({
  text: z.string(),
  subject: z.string(),
  attachments: z
    .array(z.instanceof(File))
    .max(1, 'Máximo de 1 anexo')
    .optional(),
});

export type SendEmailControllerSchemaRequest = z.infer<
  typeof sendEmailControllerSchemaRequest
>;
