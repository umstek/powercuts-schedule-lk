# Power-cuts schedule fetching automation
Strictly for educational purposes only. 

## Running as CLI

1. `npm i -g zx`
2. `chmod +x ceb.mjs`
3. `./ceb.mjs --from 2022-02-03 --to 2022-02-05 --acctNo 9999999999`

## Experimental stack
Language: TypeScript (+JavaScript)
Code formatter: Prettier
Dependency Manager: pnpm
Transpiler/bundler: swc/spack
Hosting: CloudFlare workers
Frameworks: 
  Miniflare - (Cloudflare workers emulator)
  Hono - Edge/Workers web framework
  Telegraf - Telegram bot framework
VCS/Provider: Git/GitHub
