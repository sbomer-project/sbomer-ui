#!/usr/bin/env bash
set -e

PROFILE=sbomer
NAMESPACE=sbomer-test

echo "--- Building and loading UI into Minikube ---"
./hack/build-local-ui-into-minikube.sh

echo "--- Updating deployment to use local image ---"
kubectl set image deployment/sbomer-release-ui-chart ui-chart=localhost/sbomer-ui:latest -n $NAMESPACE

echo "--- Waiting for rollout to complete ---"
kubectl rollout status deployment/sbomer-release-ui-chart -n $NAMESPACE

echo "Done! UI redeployed in namespace $NAMESPACE"
