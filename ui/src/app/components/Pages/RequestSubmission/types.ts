///
/// JBoss, Home of Professional Open Source.
/// Copyright 2023 Red Hat, Inc., and individual contributors
/// as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
/// http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

// DTO types are owned by @app/types — import them from there, not here.
// This file contains only form-local types and UI constants.

export type TargetType = 'CONTAINER_IMAGE' | 'CUSTOM';

export interface RequestFormState {
  targetType: TargetType;
  customTargetType: string;
  targetIdentifier: string;
  handlerOptions: Array<{ uid: string; key: string; value: string }>;
  publishers: Array<{
    uid: string;
    name: string;
    version: string;
    options: Array<{ uid: string; key: string; value: string }>;
  }>;
}

export interface ValidationErrors {
  targetIdentifier?: string;
  customTargetType?: string;
  publishers?: Record<number, { name?: string; version?: string }>;
}

export const TARGET_TYPE_OPTIONS: ReadonlyArray<{
  value: TargetType;
  label: string;
  placeholder: string;
  example: string | undefined;
}> = [
  {
    value: 'CONTAINER_IMAGE',
    label: 'Container Image',
    placeholder: 'quay.io/namespace/image:tag',
    example: 'quay.io/pct-security/mequal:latest',
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
    placeholder: 'custom-identifier',
    example: undefined,
  },
];

// Keyed lookup so callers never need a non-null assertion on .find().
export const TARGET_TYPE_OPTIONS_BY_VALUE = Object.fromEntries(
  TARGET_TYPE_OPTIONS.map((o) => [o.value, o]),
) as Record<TargetType, (typeof TARGET_TYPE_OPTIONS)[number]>;
