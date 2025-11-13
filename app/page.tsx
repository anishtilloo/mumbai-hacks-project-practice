'use client';

// global imports
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// local import
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formSchema } from '@/schemas';

const RootPage = () => {
  const [transcript, setTranscript] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      video_link: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted:', values);

    try {
      const response = await fetch('/api/video-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_link: values.video_link }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        return;
      }

      const result = await response.json();

      console.log('showing result');

      console.log('=== CLEANED TRANSCRIPT ===');
      console.log(result.data.fullTranscript);
      console.log('\n=== VIDEO INFO ===');
      console.log('Title:', result.data.title);
      console.log('Author:', result.data.author);
      console.log('Video ID:', result.data.videoId);
      setTranscript(result.data.aiResponse);
    } catch (error) {
      console.error('Failed to fetch transcript:', error);
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col justify-between bg-black px-16 py-10">
      <div className="flex w-full justify-between">
        <p className="font-mona text-md font-semibold text-white">Slopscore.ai</p>
        <p className="font-mona text-md font-semibold text-white/50">Testing phase</p>
      </div>
      <div className="flex justify-between gap-x-20">
        <div className="h-[720px] w-[560px] shrink-0 rounded-xl bg-neutral-950 p-10">
          <p className="font-mona text-sm text-white">Paste link here</p>
          <p className="font-mona mt-4 text-sm text-white/50">
            The link of the video you want to analyse
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="video_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mona mt-20 text-white">Link</FormLabel>
                    <FormControl className="mt-4 text-white ring-white placeholder:text-white/50">
                      <Input placeholder="https://youtube.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-5 cursor-pointer bg-white active:bg-black">
                Submit
              </Button>
            </form>
          </Form>
        </div>

        <div className="max-h-[720px] w-full overflow-y-scroll border border-white">
          <p className="font-mona text-sm text-white">{transcript}</p>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default RootPage;
