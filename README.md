## Installation and usage

requires latest [Node.js](https://nodejs.org/) LTS version or more recent.
[Yarn package manager](https://yarnpkg.com/) is also recommended.  
If you want to install with npm, `--unsafe-perm` is required for a correct install.

### Running stable releases

Please refer to the [install and upgrade documentation on our website](https://thelounge.chat/docs/install-and-upgrade) for all available installation methods.

### Running from source

The following commands install and run the development version of irc.imperialfamily.com:

```sh
git clone https://github.com/thelounge/thelounge.git
cd thelounge
yarn install
NODE_ENV=production yarn build
yarn start
```

When installed like this, `thelounge` executable is not created. Use `node index <command>` to run commands.

⚠️ While it is the most recent codebase, this is not production-ready! Run at
your own risk. It is also not recommended to run this as root.

## Development setup

Simply follow the instructions to run irc.imperialfamily.com from source above, on your own
fork.

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
 - cd /thelounge/client/img
 - wget your .PNG and .SVG files of your org (or just 1 of each)
 - ls -a 
 - cp img.png's to the logos
 - cp img.svg to the svg logos
 - find /home/ircd/thelounge \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i 's/irc.imperialfamily.com/irc.yourorg.com/g'
 - find /home/ircd/thelounge \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i 's/https:\/\/imperialfamily.com/https:\/\/yourorgsite.com/g'
 - cd to thelounge
 - NODE_ENV=production yarn build
 - yarn start / yarn start & for daemon mode
