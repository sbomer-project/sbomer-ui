# SBOMer

An user interface for SBOMer.

## How to run

# Dev mode

1. Set the value of 'ui/src/config.js' according to the backend server you trying to connect to.

For example:

``` javascript
window._env_ = {
  API_URL: "http://localhost:8080",
};
```

2. Run the devmode:

``` bash
cd ui
npm install
npm run start:dev
```

# Local development using Docker Compose

Information found in [hack/local-dev/README.md](hack/local-dev/README.md)
