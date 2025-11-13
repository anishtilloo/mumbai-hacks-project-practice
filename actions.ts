// app/actions.ts
'use server';

import { Innertube } from 'youtubei.js';

export async function getVideoInfo(id: string) {
  const innertube = await Innertube.create();
  const videoInfo = await innertube.getInfo(id, { client: 'TV' });
  console.log(videoInfo);
}
