import { z } from 'zod';

export const formSchema = z.object({
  video_link: z.string().min(2).max(100),
});
