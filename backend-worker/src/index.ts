import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const isValidurl = (value: string) => {
  if(!value.startsWith('https://news.ycombinator.com/')) return false
  try {
    new URL(value);
    return true;
  } catch (err) {
    return false;
  }
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', zValidator('query', z.object({ threadUrl: z.string().refine(isValidurl) })),async (c) => {

  const { threadUrl } = c.req.valid('query');
  const url = new URL(threadUrl).toString();

  const response = await fetch(url);

  const rawHtml = await response.text();
  const comments = rawHtml.match(/<div class="commtext c00">(.*?)<\/div>/g);

  if(!comments) return c.text('No comments found')

  const commentsAsText = comments.map((comment) => comment.replace(/<div class="commtext c00">|<\/div>/g, "")).slice(0, 5);

  const resp = await c.env.AI.run("@cf/mistral/mistral-7b-instruct-v0.1", {
    prompt: `Summarize the set of comments from a forum (Hacker News, platform where devs share their thoughts), give me the context of the news: ${commentsAsText.join("\n")} and be concise in your response`,
  }) as { response: string};

  return c.json({ response: resp.response });
})

export default app