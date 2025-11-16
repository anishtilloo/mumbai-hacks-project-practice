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
import Marquee from '@/components/animating-wrappers/text-marquee';
import Link from 'next/link';

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
    <div className="bg-clay flex h-screen w-screen flex-col justify-between overflow-x-clip overflow-y-clip">
      {/* top bar */}
      <div className="page-px flex w-full justify-between pt-7">
        <div className="flex gap-x-10">
          <p className="p-text font-semibold">Slopscore.ai</p>
          <Link href={'https://slopscoreaidocs.vercel.app/docs'} target="_blank" className="">
            <p className="p-text font-medium text-black/50 transition-colors duration-200 ease-in-out hover:text-black">
              Docs
            </p>
          </Link>
          <Link href={'/'} className="">
            <p className="p-text font-medium text-black/50 transition-colors duration-200 ease-in-out hover:text-black">
              Own the extension
            </p>
          </Link>
        </div>
        <p className="p-text opacity-50">#testing_phase</p>
      </div>

      {/* content */}
      <div className="page-px flex h-full justify-between gap-x-20 pt-7 pb-10">
        <div className="flex w-[560px] shrink-0 flex-col justify-between">
          <div></div>
          <div></div>

          {/*  */}
          <p className="p-text max-w-[400px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, architecto ab?
          </p>

          {/*  */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="video_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-pixel max-w-[360px] text-[32px] leading-8 font-medium text-black">
                      So, which video do you wanna analyse?
                    </FormLabel>
                    <FormControl className="focus:ring-arancia border-arancia p-text placeholder:p-text mt-8 h-12 max-w-[440px] bg-white/80 font-semibold text-black placeholder:text-black/50 focus:ring-0">
                      <Input placeholder="https://youtube.com/..." {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-arancia hover:text-arancia border-arancia h-11 w-64 cursor-pointer border text-white hover:bg-white active:bg-black"
              >
                <p className="p-text font-semibold">Become Sherlock Holmes</p>
              </Button>
            </form>
          </Form>
        </div>

        <div className="hide-scrollbar h-full w-full overflow-y-scroll border border-white">
          <p className="font-mona text-sm text-black">{transcript}</p>
        </div>
      </div>

      {/* bottom marquee  */}
      <div className="h-40 overflow-x-clip">
        <Marquee
          direction={-1}
          startTriggerDesktop={0}
          endTriggerDesktop={0}
          startTriggerMobile={0}
          endTriggerMobile={0}
          speed={0.03}
        >
          <div className="ml-[calc(46px+5svw)] flex -translate-x-[50%] translate-y-16 items-center gap-x-[calc(46px+5svw)]">
            <p className="marquee-text">SLOPSCORE.ai</p>
            <p className="marquee-text">SLOPSCORE.ai</p>
            <p className="marquee-text">SLOPSCORE.ai</p>
            <p className="marquee-text">SLOPSCORE.ai</p>
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default RootPage;
