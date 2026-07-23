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

import { act, renderHook } from '@testing-library/react';
import { useRequestSubmission } from '../hooks/useRequestSubmission';

jest.mock('@app/api/DefaultSbomerApi');

describe('useRequestSubmission', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // Target Identifier Validation
  // ──────────────────────────────────────────────────────────────────────────

  describe('Target Identifier Validation', () => {
    it('valid CONTAINER_IMAGE → errors.targetIdentifier undefined', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetIdentifier('quay.io/namespace/image:tag');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.targetIdentifier).toBeUndefined();
    });

    it("invalid CONTAINER_IMAGE ('invalid-format') → error contains 'Invalid container image format'", () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetIdentifier('invalid-format');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.targetIdentifier).toContain('Invalid container image format');
    });

    it("valid RPM ('bash-5.1.8-6.el9.x86_64') → errors.targetIdentifier undefined", () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetType('RPM');
      });
      act(() => {
        result.current.updateTargetIdentifier('bash-5.1.8-6.el9.x86_64');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.targetIdentifier).toBeUndefined();
    });

    it("invalid RPM ('invalid-rpm') → error contains 'Invalid RPM format'", () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetType('RPM');
      });
      act(() => {
        result.current.updateTargetIdentifier('invalid-rpm');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.targetIdentifier).toContain('Invalid RPM format');
    });

    it("empty identifier → error contains 'required'", () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.targetIdentifier).toContain('required');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Publisher Validation
  // ──────────────────────────────────────────────────────────────────────────

  describe('Publisher Validation', () => {
    it('valid name + semver version → errors.publishers undefined', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetIdentifier('quay.io/ns/img:latest');
        result.current.addPublisher();
      });
      act(() => {
        result.current.updatePublisher(0, 'name', 'my-publisher');
        result.current.updatePublisher(0, 'version', '1.0.0');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.publishers).toBeUndefined();
    });

    it('missing publisher name → errors.publishers[0].name defined', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetIdentifier('quay.io/ns/img:latest');
        result.current.addPublisher();
      });
      act(() => {
        result.current.updatePublisher(0, 'version', '1.0.0');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.publishers?.[0]?.name).toBeDefined();
    });

    it("invalid version ('invalid-version') → error contains 'semantic version'", () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetIdentifier('quay.io/ns/img:latest');
        result.current.addPublisher();
      });
      act(() => {
        result.current.updatePublisher(0, 'name', 'my-publisher');
        result.current.updatePublisher(0, 'version', 'invalid-version');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.publishers?.[0]?.version).toContain('semantic version');
    });

    it("pre-release semver ('1.0.0-alpha.1') → errors.publishers undefined", () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetIdentifier('quay.io/ns/img:latest');
        result.current.addPublisher();
      });
      act(() => {
        result.current.updatePublisher(0, 'name', 'my-publisher');
        result.current.updatePublisher(0, 'version', '1.0.0-alpha.1');
      });
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.publishers).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Form State Management
  // ──────────────────────────────────────────────────────────────────────────

  describe('Form State Management', () => {
    it('addHandlerOption → length 1', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addHandlerOption();
      });
      expect(result.current.formState.handlerOptions).toHaveLength(1);
    });

    it('updateHandlerOption → correct { key, value }', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addHandlerOption();
      });
      act(() => {
        result.current.updateHandlerOption(0, 'myKey', 'myValue');
      });
      expect(result.current.formState.handlerOptions[0]).toEqual({ key: 'myKey', value: 'myValue' });
    });

    it('removeHandlerOption → length 0', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addHandlerOption();
      });
      act(() => {
        result.current.removeHandlerOption(0);
      });
      expect(result.current.formState.handlerOptions).toHaveLength(0);
    });

    it('addPublisher → length 1', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addPublisher();
      });
      expect(result.current.formState.publishers).toHaveLength(1);
    });

    it('removePublisher → length 0', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addPublisher();
      });
      act(() => {
        result.current.removePublisher(0);
      });
      expect(result.current.formState.publishers).toHaveLength(0);
    });

    it('addPublisher + addPublisherOption → options length 1', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addPublisher();
      });
      act(() => {
        result.current.addPublisherOption(0);
      });
      expect(result.current.formState.publishers[0]?.options).toHaveLength(1);
    });

    it('updatePublisherOption → correct { key, value }', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addPublisher();
      });
      act(() => {
        result.current.addPublisherOption(0);
      });
      act(() => {
        result.current.updatePublisherOption(0, 0, 'optKey', 'optValue');
      });
      expect(result.current.formState.publishers[0]?.options[0]).toEqual({
        key: 'optKey',
        value: 'optValue',
      });
    });

    it('removePublisherOption → options length 0', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.addPublisher();
      });
      act(() => {
        result.current.addPublisherOption(0);
      });
      act(() => {
        result.current.removePublisherOption(0, 0);
      });
      expect(result.current.formState.publishers[0]?.options).toHaveLength(0);
    });

    it('resetForm → restores initial state, isSuccess=false, submissionResult=null', () => {
      const { result } = renderHook(() => useRequestSubmission());
      act(() => {
        result.current.updateTargetIdentifier('quay.io/ns/img:tag');
        result.current.addHandlerOption();
        result.current.addPublisher();
      });
      act(() => {
        result.current.resetForm();
      });
      expect(result.current.formState.targetType).toBe('CONTAINER_IMAGE');
      expect(result.current.formState.targetIdentifier).toBe('');
      expect(result.current.formState.handlerOptions).toHaveLength(0);
      expect(result.current.formState.publishers).toHaveLength(0);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.submissionResult).toBeNull();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Target Type Switching
  // ──────────────────────────────────────────────────────────────────────────

  describe('Target Type Switching', () => {
    it('trigger validation error, then switch type → errors.targetIdentifier undefined', () => {
      const { result } = renderHook(() => useRequestSubmission());
      // Trigger a validation error with an empty identifier
      act(() => {
        result.current.validateForm();
      });
      expect(result.current.errors.targetIdentifier).toBeDefined();
      // Switch target type — should clear the identifier error
      act(() => {
        result.current.updateTargetType('RPM');
      });
      expect(result.current.errors.targetIdentifier).toBeUndefined();
    });
  });
});
