# highperformancesqlite.com Download Script

Downloads all videos from https://highperformancesqlite.com. I just don't like to be online while watching learning videos, so I can avoid to be interrupted.

> Highly recommended course for sqlite!

![Preview](https://github.com/user-attachments/assets/ed73fd9d-2f38-4a4f-9ad2-3c491c17d89f)

## Setup

- For execution you will need to install [bun.sh](https://bun.sh/). Not tested with node.

To install dependencies:

```bash
bun install
```

Get your session token:

1. Login https://highperformancesqlite.com/watch/introduction-to-this-course
2. Open the inspector
3. Open tab "Application"
4. Copy the value of your `high_performance_sqlite_session` cookie under `Cookies`
5.

```sh
cp .env.dist .env
```

6. Insert the cookie into `.env`

## Start download

```bash
bun run index.ts
```

It will take some time.

You will find all downloaded videos under `videos/`.

## Notes

- The downloaded videos are only prefixed by a number, but not grouped by sections as it is on the website.
- The test data files are not downloaded
- The Video transcript are not downloaded
