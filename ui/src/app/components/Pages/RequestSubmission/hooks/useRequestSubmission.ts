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

import { DefaultSbomerApi } from '@app/api/DefaultSbomerApi';
import { useCallback, useState } from 'react';
import {
  GenerationRequestsDTO,
  RequestFormState,
  SubmissionResult,
  TargetType,
  ValidationErrors,
} from '../types';

// ============================================================================
// Regex constants
// ============================================================================

const CONTAINER_IMAGE_REGEX = /^[a-z0-9.-]+\/[a-z0-9._/-]+:[a-z0-9._-]+$/i;
const RPM_REGEX = /^[a-zA-Z0-9._+-]+-[0-9][a-zA-Z0-9._]*-[a-zA-Z0-9._]+\.[a-zA-Z0-9_]+$/;
const SEMVER_REGEX = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;

// ============================================================================
// Initial state
// ============================================================================

const INITIAL_FORM_STATE: RequestFormState = {
  targetType: 'CONTAINER_IMAGE',
  targetIdentifier: '',
  handlerOptions: [],
  publishers: [],
};

// ============================================================================
// Hook
// ============================================================================

export function useRequestSubmission() {
  const [formState, setFormState] = useState<RequestFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // Target field actions
  // --------------------------------------------------------------------------

  const updateTargetType = useCallback((type: TargetType) => {
    setFormState((prev) => ({ ...prev, targetType: type, targetIdentifier: '' }));
    setErrors((prev) => ({ ...prev, targetIdentifier: undefined }));
  }, []);

  const updateTargetIdentifier = useCallback((identifier: string) => {
    setFormState((prev) => ({ ...prev, targetIdentifier: identifier }));
  }, []);

  // --------------------------------------------------------------------------
  // Handler option actions
  // --------------------------------------------------------------------------

  const addHandlerOption = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      handlerOptions: [...prev.handlerOptions, { key: '', value: '' }],
    }));
  }, []);

  const updateHandlerOption = useCallback((index: number, key: string, value: string) => {
    setFormState((prev) => {
      const handlerOptions = [...prev.handlerOptions];
      handlerOptions[index] = { key, value };
      return { ...prev, handlerOptions };
    });
  }, []);

  const removeHandlerOption = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      handlerOptions: prev.handlerOptions.filter((_, i) => i !== index),
    }));
  }, []);

  // --------------------------------------------------------------------------
  // Publisher actions
  // --------------------------------------------------------------------------

  const addPublisher = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      publishers: [...prev.publishers, { name: '', version: '', options: [] }],
    }));
  }, []);

  const updatePublisher = useCallback(
    (index: number, field: 'name' | 'version', value: string) => {
      setFormState((prev) => {
        const publishers = [...prev.publishers];
        publishers[index] = { ...publishers[index]!, [field]: value };
        return { ...prev, publishers };
      });
      setErrors((prev) => {
        const publisherErrors = { ...(prev.publishers ?? {}) };
        const entry = { ...(publisherErrors[index] ?? {}) };
        delete entry[field];
        publisherErrors[index] = entry;
        return { ...prev, publishers: publisherErrors };
      });
    },
    [],
  );

  const addPublisherOption = useCallback((publisherIndex: number) => {
    setFormState((prev) => {
      const publishers = [...prev.publishers];
      const publisher = publishers[publisherIndex];
      if (!publisher) return prev;
      publishers[publisherIndex] = {
        ...publisher,
        options: [...publisher.options, { key: '', value: '' }],
      };
      return { ...prev, publishers };
    });
  }, []);

  const updatePublisherOption = useCallback(
    (publisherIndex: number, optionIndex: number, key: string, value: string) => {
      setFormState((prev) => {
        const publishers = [...prev.publishers];
        const publisher = publishers[publisherIndex];
        if (!publisher) return prev;
        const options = [...publisher.options];
        options[optionIndex] = { key, value };
        publishers[publisherIndex] = { ...publisher, options };
        return { ...prev, publishers };
      });
    },
    [],
  );

  const removePublisherOption = useCallback((publisherIndex: number, optionIndex: number) => {
    setFormState((prev) => {
      const publishers = [...prev.publishers];
      const publisher = publishers[publisherIndex];
      if (!publisher) return prev;
      publishers[publisherIndex] = {
        ...publisher,
        options: publisher.options.filter((_, i) => i !== optionIndex),
      };
      return { ...prev, publishers };
    });
  }, []);

  const removePublisher = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      publishers: prev.publishers.filter((_, i) => i !== index),
    }));
  }, []);

  // --------------------------------------------------------------------------
  // Validation
  // --------------------------------------------------------------------------

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Target identifier
    if (!formState.targetIdentifier.trim()) {
      newErrors.targetIdentifier = 'Target identifier is required';
    } else if (formState.targetType === 'CONTAINER_IMAGE') {
      if (!CONTAINER_IMAGE_REGEX.test(formState.targetIdentifier)) {
        newErrors.targetIdentifier =
          'Invalid container image format. Expected: registry/namespace/image:tag';
      }
    } else if (formState.targetType === 'RPM') {
      if (!RPM_REGEX.test(formState.targetIdentifier)) {
        newErrors.targetIdentifier = 'Invalid RPM format. Expected: name-version-release.arch';
      }
    }

    // Publishers
    if (formState.publishers.length > 0) {
      const publisherErrors: Record<number, { name?: string; version?: string }> = {};
      formState.publishers.forEach((publisher, index) => {
        const entry: { name?: string; version?: string } = {};
        if (!publisher.name.trim()) {
          entry.name = 'Publisher name is required';
        }
        if (!publisher.version.trim()) {
          entry.version = 'Invalid version format. Expected semantic version (e.g., 1.0.0)';
        } else if (!SEMVER_REGEX.test(publisher.version)) {
          entry.version = 'Invalid version format. Expected semantic version (e.g., 1.0.0)';
        }
        if (Object.keys(entry).length > 0) {
          publisherErrors[index] = entry;
        }
      });
      if (Object.keys(publisherErrors).length > 0) {
        newErrors.publishers = publisherErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // --------------------------------------------------------------------------
  // Submit
  // --------------------------------------------------------------------------

  const submitRequest = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);
    setIsSuccess(false);

    try {
      // Build handler options record (skip blank keys)
      const handlerOptionsRecord: Record<string, unknown> = {};
      for (const opt of formState.handlerOptions) {
        if (opt.key.trim()) {
          handlerOptionsRecord[opt.key] = opt.value;
        }
      }

      // Build publishers
      const publishers = formState.publishers.map((pub) => {
        const optionsRecord: Record<string, unknown> = {};
        for (const opt of pub.options) {
          if (opt.key.trim()) {
            optionsRecord[opt.key] = opt.value;
          }
        }
        return {
          name: pub.name,
          version: pub.version,
          ...(Object.keys(optionsRecord).length > 0 ? { options: optionsRecord } : {}),
        };
      });

      const payload: GenerationRequestsDTO = {
        generationRequests: [
          {
            target: { type: formState.targetType, identifier: formState.targetIdentifier },
            ...(Object.keys(handlerOptionsRecord).length > 0
              ? { handlerProvidedOptions: handlerOptionsRecord }
              : {}),
          },
        ],
        ...(publishers.length > 0 ? { publishers } : {}),
      };

      const response = await DefaultSbomerApi.getInstance().submitGenerationRequest(payload);
      setSubmissionResult({ id: response.id });
      setIsSuccess(true);
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, validateForm]);

  // --------------------------------------------------------------------------
  // Reset / clear
  // --------------------------------------------------------------------------

  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setSubmissionResult(null);
    setSubmissionError(null);
  }, []);

  const clearError = useCallback(() => {
    setSubmissionError(null);
  }, []);

  return {
    formState,
    errors,
    isSubmitting,
    isSuccess,
    submissionResult,
    submissionError,
    updateTargetType,
    updateTargetIdentifier,
    addHandlerOption,
    updateHandlerOption,
    removeHandlerOption,
    addPublisher,
    updatePublisher,
    addPublisherOption,
    updatePublisherOption,
    removePublisherOption,
    removePublisher,
    validateForm,
    submitRequest,
    resetForm,
    clearError,
  };
}
