# @devimasolutions/auth

## Installation

```bash
npm install @devimasolutions/deploy
```

## Usage

```bash
# create configuration files to easily access server
ds-deploy init

# install app and dependencies to the remote server
ds-deploy server:setup

# remove app and dependencies from the remote server
ds-deploy clean:server

# manually trigger a build on the remote server. The app is built from a git branch tracked by the server
ds-deploy deploy

# manually trigger a build on the remote server using local source code
ds-deploy deploy:local

# setup CI/CD for the server (Only github actions are currently available)
ds-deploy deploy:ci

# update env variables on the remote server using your .env.production file
ds-deploy deploy:env

# clean local folder from ds-deploy package configuration files
ds-deploy clean:local

# clean local folder, remove app and dependencies from the remote server
ds-deploy clean
```

## Common use case

TODO

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT License](https://gitlab.com/devima.solutions/auth/auth/-/blob/main/LICENCE.md)
