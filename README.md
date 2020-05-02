## TOC-IRC
Letstoc.com

## Installation and usage

requires latest [Node.js](https://nodejs.org/) LTS version or more recent.
[Yarn package manager](https://yarnpkg.com/) is also recommended.  
If you want to install with npm, `--unsafe-perm` is required for a correct install.

## Development setup

Before submitting any change, make sure to:

- Read the [Contributing instructions](https://github.com/thelounge/thelounge/blob/master/.github/CONTRIBUTING.md#contributing)
- Run `yarn test` to execute linters and test suite
- Run `yarn build` if you change or add anything in `client/js` or `client/views`
- `yarn dev` can be used to start irc.imperialfamily.com with hot module reloading

## Fork/Custom edit of thelounge
-- main focus is to work with jbnc, simply enter username and password and go. always on connection via jbnc
## Demo
- https://irc.imperialfamily.com

## Install & Go:
 - git clone https://github.com/toc-irc/thelounge.git
 - cd /thelounge/
 - yarn install
 - cd /thelounge/client
 - put your favicon.ico in here
 - cd /thelounge/client/img
 - wget your .PNG and .SVG files of your org 
 - mv IMAGE-YOU-DOWNLOADED.png chat.png
 - mv IMAGE-YOU-DOWNLOADED.svg chat.svg
 - cp chat.png icon-alerted-black-transparent-bg-72x72px.png
- cp chat.png icon-alerted-grey-bg-192x192px.png
- cp chat.png logo-grey-bg-120x120px.png
- cp chat.png logo-grey-bg-152x152px.png
- cp chat.png logo-grey-bg-167x167px.png
- cp chat.png logo-grey-bg-180x180px.png
- cp chat.png logo-grey-bg-192x192px.png
- cp chat.png logo-grey-bg-512x512px.png

- cp chat.svg icon-black-transparent-bg.svg
- cp chat.svg logo-grey-bg.svg
- cp chat.svg logo-horizontal-transparent-bg-inverted.svg
- cp chat.svg logo-horizontal-transparent-bg.svg
- cp chat.svg logo-transparent-bg-inverted.svg
- cp chat.svg logo-transparent-bg.svg
- cp chat.svg logo-vertical-transparent-bg-inverted.svg
- cp chat.svg logo-vertical-transparent-bg.svg

# Change the name of your webclient's irc server from imperialfamily to yours. Please cat README.md to get the commands right
 - find /home/ircd/thelounge \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i 's/irc.imperialfamily.com/irc.yourorg.com/g'
 - find /home/ircd/thelounge \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i 's/https:\/\/imperialfamily.com/https:\/\/yourorgsite.com/g'
 - cd to thelounge
 - NODE_ENV=production yarn build
 - yarn start / yarn start & for daemon mode
