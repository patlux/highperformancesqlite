import TurndownService from 'turndown'
import he from 'he'
import { $ } from 'bun'
import fs from 'fs'

const fetchInit: RequestInit = {
  headers: {
    cookie: `high_performance_sqlite_session=${process.env.SESSION_TOKEN}`,
    Referer: 'https://highperformancesqlite.com/',
  },
  method: 'GET',
}

const response = await fetch(
  'https://highperformancesqlite.com/watch/busy-timeout',
  fetchInit,
)
const html = await response.text()

const tt = new TurndownService()

const markdown = tt.turndown(html)

function findAllMarkdownLinks(text: string): string[] {
  const markdownLinkRegex =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|<(https?:\/\/[^\s>]+)>|https?:\/\/[^\s]+/g
  const matches = []
  let match

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    if (match[2]) {
      matches.push(match[2]) // For links of the form [text](http://example.com)
    } else if (match[3]) {
      matches.push(match[3]) // For links of the form <http://example.com>
    } else {
      matches.push(match[0]) // For plain URLs http://example.com
    }
  }

  return matches
}

const allLinks = findAllMarkdownLinks(markdown)
const watchLinks = allLinks.filter((link) => link.includes('/watch'))

function findVimeoLink(html: string): string[] {
  const vimeoRegex =
    /https:\/\/player\.vimeo\.com\/play\/[a-zA-Z0-9-]+\/hls\.m3u8\?[^"]+/g
  const matches = html.match(vimeoRegex)
  return matches || []
}

function findAllLinks(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g
  const matches = text.match(urlRegex)
  return matches || []
}

for (const link of watchLinks) {
  const parts = link.split('/')
  const slug = parts[parts.length - 1]

  console.log(`--- "${slug}" ---`)

  try {
    if (fs.existsSync(`${slug}.mp4`)) {
      console.log(`${slug}.mp4 exists already. Skipping.`)
      continue
    }

    const response = await fetch(link, fetchInit)
    const html = await response.text()
    let vimeoLink = he.decode(findVimeoLink(html)[0])
    vimeoLink = vimeoLink.slice(0, vimeoLink.indexOf('"'))

    console.log(`Start downloading "${slug}"...`)
    // await spawn(['ffmpeg', '-i', vimeoLink, '-c', 'copy', '-bsf:a', 'aac_adtstoasc', `${slug}.mp4`])
    await $`ffmpeg -i "${vimeoLink}" -c copy -bsf:a aac_adtstoasc ${slug}.mp4`.quiet()
    console.log(`Finished "${slug}".`)
  } catch (error: unknown) {
    console.error(`Failed to download "${slug}": "${error}"`)
  }
}
