# SBOMer

An user interface for SBOMer.


## Dev mode

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

## Local development using Helm chart

To run alongside the full system, setup by running the following commands:

``` bash
setup-local-dev.sh
```
to setup local minikube environment. (Required only once)


To build and input into minikube, run:
``` bash
run-helm-with-local-build.sh
```
and
```
kubectl port-forward svc/sbomer-release-ui-chart 8080:8080 -n sbomer-test
```
to access the UI at http://localhost:8080
