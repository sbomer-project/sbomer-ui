#!/usr/bin/env bash

# This script builds the UI application and creates a container image
# inside the Minikube environment so it can be used by Kubernetes.
#
# It is intended to be run from the root of the project.

set -e

PROFILE=sbomer
IMAGE_NAME=sbomer-ui
IMAGE_TAG=latest
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
TAR_FILE="sbomer-ui.tar"

echo "--- 1. Building UI Application ---"
bash ./hack/build.sh

echo "--- 2. Building Container Image ---"
podman build --format docker -t "$FULL_IMAGE" -f images/sbomer-ui/Containerfile .

echo "--- 3. Cleaning old image from Minikube ---"
# This ensures Minikube doesn't use a cached version of 'latest'
minikube -p "$PROFILE" image rm "$FULL_IMAGE" || true

echo "--- 4. Exporting and Loading image ---"
if [ -f "$TAR_FILE" ]; then rm "$TAR_FILE"; fi
podman save -o "$TAR_FILE" "$FULL_IMAGE"

echo "--- Loading sbomer-ui into Minikube ---"
# Force remove the old image from the cluster to clear the cache
minikube -p "$PROFILE" image rm "$FULL_IMAGE" || true

# This sends the fresh file to Minikube
minikube -p "$PROFILE" image load "$TAR_FILE"

rm "$TAR_FILE"
echo "Done! Image '$FULL_IMAGE' is fresh in cluster '$PROFILE'."

# Made with Bob
