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

import { AppLayout } from '@app/components/Pages/AppLayout/AppLayout';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import {
  Button,
  ButtonSet,
  ClickableTile,
  Form,
  FormGroup,
  FormItem,
  Heading,
  InlineLoading,
  InlineNotification,
  RadioButton,
  RadioButtonGroup,
  Stack,
  TextInput,
  Tile,
} from '@carbon/react';
import { Add, TrashCan } from '@carbon/icons-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestSubmission } from './hooks/useRequestSubmission';
import { TARGET_TYPE_OPTIONS, TargetType } from './types';

// ── Reusable option row (key / value + remove button) ──────────────────────

interface OptionRowProps {
  id: string;
  optionKey: string;
  optionValue: string;
  onKeyChange: (v: string) => void;
  onValueChange: (v: string) => void;
  onRemove: () => void;
  disabled: boolean;
}

function OptionRow({ id, optionKey, optionValue, onKeyChange, onValueChange, onRemove, disabled }: OptionRowProps) {
  return (
    <Stack orientation="horizontal" gap={5}>
      <TextInput
        id={`${id}-key`}
        labelText="Key"
        placeholder="option-name"
        value={optionKey}
        onChange={(e) => onKeyChange(e.target.value)}
        disabled={disabled}
      />
      <TextInput
        id={`${id}-value`}
        labelText="Value"
        placeholder="option-value"
        value={optionValue}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
      />
      <FormItem>
        <Button
          kind="ghost"
          size="sm"
          renderIcon={TrashCan}
          iconDescription="Remove"
          hasIconOnly
          onClick={onRemove}
          disabled={disabled}
        />
      </FormItem>
    </Stack>
  );
}

// ── Page component ──────────────────────────────────────────────────────────

export function RequestSubmissionPage() {
  useDocumentTitle('SBOMer | Submit Request');

  const {
    formState,
    errors,
    isSubmitting,
    isSuccess,
    submissionResult,
    submissionError,
    updateTargetType,
    updateCustomTargetType,
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
    submitRequest,
    resetForm,
    clearError,
  } = useRequestSubmission();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitRequest();
  };

  const selectedTargetOption = TARGET_TYPE_OPTIONS.find((o) => o.value === formState.targetType)!;

  return (
    <AppLayout>
      <Stack gap={7}>

        {/* ── Page heading ───────────────────────────────────────── */}
        <Heading>Trigger an SBOM Generation</Heading>

        {/* ── Success notification ───────────────────────────────── */}
        {isSuccess && submissionResult && (
          <Stack gap={3}>
            <InlineNotification
              kind="success"
              title="Request submitted successfully"
              subtitle="Your request has been queued for processing. Click below to view the event."
              onCloseButtonClick={resetForm}
              hideCloseButton={false}
            />
            <ClickableTile onClick={() => navigate(`/events/${submissionResult.id}`)}>
              <Stack gap={2}>
                <p>Event ID</p>
                <Heading>{submissionResult.id}</Heading>
              </Stack>
            </ClickableTile>
          </Stack>
        )}

        {/* ── Error notification ─────────────────────────────────── */}
        {submissionError && (
          <InlineNotification
            kind="error"
            title="Submission failed"
            subtitle={submissionError}
            onCloseButtonClick={clearError}
          />
        )}

        {/* ── Form ───────────────────────────────────────────────── */}
        <Form onSubmit={handleSubmit}>
          <Stack gap={7}>

            {/* ── Target Configuration ───────────────────────────── */}
            <Stack gap={5}>
              <Heading>Target Configuration</Heading>
              <FormGroup legendText="Target Type">
                <RadioButtonGroup
                  name="targetType"
                  valueSelected={formState.targetType}
                  onChange={(v) => updateTargetType(v as TargetType)}
                  orientation="vertical"
                >
                  {TARGET_TYPE_OPTIONS.map((targetOption) => (
                    <RadioButton
                      key={targetOption.value}
                      labelText={targetOption.label}
                      value={targetOption.value}
                      id={`target-type-${targetOption.value}`}
                    />
                  ))}
                </RadioButtonGroup>
              </FormGroup>
              {formState.targetType === 'CUSTOM' && (
                <TextInput
                  id="custom-target-type"
                  labelText="Target Type"
                  placeholder="e.g. MAVEN, DOMINO, RPM"
                  value={formState.customTargetType}
                  onChange={(e) => updateCustomTargetType(e.target.value)}
                  invalid={!!errors.customTargetType}
                  invalidText={errors.customTargetType}
                  required
                  disabled={isSubmitting}
                />
              )}
              <TextInput
                id="target-identifier"
                labelText="Target Identifier"
                placeholder={selectedTargetOption.placeholder}
                helperText={selectedTargetOption.example ? `Example: ${selectedTargetOption.example}` : undefined}
                value={formState.targetIdentifier}
                onChange={(e) => updateTargetIdentifier(e.target.value)}
                invalid={!!errors.targetIdentifier}
                invalidText={errors.targetIdentifier}
                required
                disabled={isSubmitting}
              />
            </Stack>

            {/* ── Handler Options ────────────────────────────────── */}
            <Stack gap={5}>
              <Heading>Handler Options (Optional)</Heading>
              {formState.handlerOptions.map((handlerOption, handlerOptionIndex) => (
                <Tile key={handlerOptionIndex}>
                  <OptionRow
                    id={`handler-option-${handlerOptionIndex}`}
                    optionKey={handlerOption.key}
                    optionValue={handlerOption.value}
                    onKeyChange={(v) => updateHandlerOption(handlerOptionIndex, v, handlerOption.value)}
                    onValueChange={(v) => updateHandlerOption(handlerOptionIndex, handlerOption.key, v)}
                    onRemove={() => removeHandlerOption(handlerOptionIndex)}
                    disabled={isSubmitting}
                  />
                </Tile>
              ))}
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Add}
                onClick={addHandlerOption}
                disabled={isSubmitting}
              >
                Add Option
              </Button>
            </Stack>

            {/* ── Publishers ─────────────────────────────────────── */}
            <Stack gap={5}>
              <Heading>Publishers (Optional)</Heading>
              {formState.publishers.map((publisher, publisherIndex) => (
                <Tile key={publisherIndex}>
                  <Stack gap={5}>

                    {/* Publisher header */}
                    <Stack orientation="horizontal" gap={3}>
                      <Heading>Publisher {publisherIndex + 1}</Heading>
                      <Button
                        kind="ghost"
                        size="sm"
                        renderIcon={TrashCan}
                        iconDescription="Remove publisher"
                        hasIconOnly
                        onClick={() => removePublisher(publisherIndex)}
                        disabled={isSubmitting}
                      />
                    </Stack>

                    {/* Name + Version side by side */}
                    <Stack orientation="horizontal" gap={5}>
                      <TextInput
                        id={`publisher-name-${publisherIndex}`}
                        labelText="Name"
                        placeholder="dependency-check-publisher"
                        value={publisher.name}
                        onChange={(e) => updatePublisher(publisherIndex, 'name', e.target.value)}
                        invalid={!!errors.publishers?.[publisherIndex]?.name}
                        invalidText={errors.publishers?.[publisherIndex]?.name}
                        required
                        disabled={isSubmitting}
                      />
                      <TextInput
                        id={`publisher-version-${publisherIndex}`}
                        labelText="Version"
                        placeholder="1.0.0"
                        value={publisher.version}
                        onChange={(e) => updatePublisher(publisherIndex, 'version', e.target.value)}
                        invalid={!!errors.publishers?.[publisherIndex]?.version}
                        invalidText={errors.publishers?.[publisherIndex]?.version}
                        required
                        disabled={isSubmitting}
                      />
                    </Stack>

                    {/* Publisher Options */}
                    <Stack gap={5}>
                      <Heading>Publisher Options</Heading>
                      {publisher.options.map((pubOption, pubOptionIndex) => (
                        <Tile key={pubOptionIndex}>
                          <OptionRow
                            id={`publisher-${publisherIndex}-option-${pubOptionIndex}`}
                            optionKey={pubOption.key}
                            optionValue={pubOption.value}
                            onKeyChange={(v) => updatePublisherOption(publisherIndex, pubOptionIndex, v, pubOption.value)}
                            onValueChange={(v) => updatePublisherOption(publisherIndex, pubOptionIndex, pubOption.key, v)}
                            onRemove={() => removePublisherOption(publisherIndex, pubOptionIndex)}
                            disabled={isSubmitting}
                          />
                        </Tile>
                      ))}
                      <Button
                        kind="ghost"
                        size="sm"
                        renderIcon={Add}
                        onClick={() => addPublisherOption(publisherIndex)}
                        disabled={isSubmitting}
                      >
                        Add Option
                      </Button>
                    </Stack>

                  </Stack>
                </Tile>
              ))}
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Add}
                onClick={addPublisher}
                disabled={isSubmitting}
              >
                Add Publisher
              </Button>
            </Stack>

            {/* ── Form Actions ───────────────────────────────────── */}
            <ButtonSet>
              <Button kind="secondary" size="lg" onClick={resetForm} disabled={isSubmitting}>
                Reset Form
              </Button>
              <Button kind="primary" size="lg" type="submit" disabled={isSubmitting || isSuccess}>
                {isSubmitting ? <InlineLoading description="Submitting..." /> : 'Submit Request'}
              </Button>
            </ButtonSet>

          </Stack>
        </Form>
      </Stack>
    </AppLayout>
  );
}

export default RequestSubmissionPage;
