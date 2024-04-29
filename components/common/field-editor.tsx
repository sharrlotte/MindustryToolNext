'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import _ from 'lodash';
import React, { useState } from 'react';
import * as z from 'zod';

type T = Record<string, string | number | boolean | string[]>;

type Props = {
  value: T;
  onSubmit: (value: T) => void;
  schema: z.ZodObject<{}, 'strip', z.ZodTypeAny, {}, {}>;
};

export default function FieldEditor({ value, schema, onSubmit }: Props) {
  const [state, setState] = useState(value);

  const data = schema.safeParse(state);

  //@ts-ignore
  const error: z.ZodError = data.error;

  function ErrorField({ name }: { name: string }) {
    if (!error) {
      return null;
    }

    const validationError = error.errors.find((err) => err.path.includes(name));

    if (validationError) {
      return (
        <span className="text-sm text-destructive">
          {validationError.message}
        </span>
      );
    }
    return null;
  }

  function handleValueChange(key: string, newValue: string | number | boolean) {
    setState((prev) => {
      return {
        ...prev,
        [key]: newValue,
      };
    });
  }

  function handleArrayValueChange(
    key: string,
    index: number,
    newValue: string,
  ) {
    setState((prev) => {
      if (
        typeof prev[key] !== 'string' &&
        typeof prev[key] !== 'number' &&
        typeof prev[key] !== 'boolean'
      ) {
        prev[key][index] = newValue;

        return {
          ...prev,
          [key]: [...prev[key]],
        };
      }

      return prev;
    });
  }

  function render(value: T) {
    return Object.entries(value).map(([key, value]) => {
      if (value === null || value === undefined) {
        value = '';
      }

      if (typeof value === 'string') {
        return (
          <div className="grid w-full gap-1" key={key}>
            <span className="text-sm font-semibold capitalize">{key}</span>
            <Input
              title={key}
              value={value}
              placeholder={value}
              onChange={(event) => handleValueChange(key, event.target.value)}
            />
            <ErrorField name={key} />
          </div>
        );
      }

      if (typeof value === 'number') {
        return (
          <div className="grid w-full gap-1" key={key}>
            <span className="text-sm font-semibold capitalize">{key}</span>
            <Input
              title={key}
              type="number"
              value={Number.isNaN(value) ? 0 : value}
              placeholder={'' + value}
              onChange={(event) =>
                handleValueChange(key, event.target.valueAsNumber)
              }
            />
            <ErrorField name={key} />
          </div>
        );
      }

      if (typeof value === 'boolean') {
        return (
          <div className="grid w-full gap-1" key={key}>
            <div className="flex items-center gap-2">
              <Checkbox
                className="h-5 w-5"
                title={key}
                checked={value}
                onCheckedChange={(value) => handleValueChange(key, value)}
              />
              <span className="capitalize">{key}</span>
            </div>
            <ErrorField name={key} />
          </div>
        );
      }

      return value.map((v, index) => (
        <Input
          key={key + index}
          title={key}
          value={v}
          onChange={(event) =>
            handleArrayValueChange(key, index, event.target.value)
          }
        />
      ));
    });
  }

  const isChanged = _.isEqual(value, state);

  return (
    <div>
      <form className="flex flex-col items-start gap-2">
        {_.concat(render(state))}
        <Button
          variant="primary"
          disabled={isChanged}
          title={'Submit'}
          onClick={() => onSubmit(state)}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
