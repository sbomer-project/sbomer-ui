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

import { Button, FormItem, Stack, TextInput } from '@carbon/react';
import { TrashCan } from '@carbon/icons-react';
import React from 'react';

export interface OptionRowProps {
  id: string;
  optionKey: string;
  optionValue: string;
  onKeyChange: (v: string) => void;
  onValueChange: (v: string) => void;
  onRemove: () => void;
  disabled: boolean;
}

export function OptionRow({
  id,
  optionKey,
  optionValue,
  onKeyChange,
  onValueChange,
  onRemove,
  disabled,
}: OptionRowProps) {
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
