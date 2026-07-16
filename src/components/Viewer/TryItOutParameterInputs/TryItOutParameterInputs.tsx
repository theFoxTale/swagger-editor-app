'use client';

import { useId, useState, type ChangeEvent } from 'react';

import { useTranslation } from '@/hooks';
import {
  PARAMETER_LOCATIONS,
  type OperationParameter,
  type ParameterLocation,
} from '@/lib/openapi';

import { groupParametersByLocation } from '../EndpointParameters';
import { getSchemaTypeLabel } from '../schemaUtils';
import {
  createInitialParameterValues,
  getEnumOptions,
  getParameterInputKind,
  getParameterKey,
  type ParameterValues,
} from './parameterInputUtils';
import styles from './TryItOutParameterInputs.module.css';

export interface TryItOutParameterInputsProps {
  parameters: OperationParameter[];
  document?: Record<string, unknown> | null;
  values?: ParameterValues;
  onValuesChange?: (values: ParameterValues) => void;
}

const LOCATION_LABEL_KEY = {
  path: 'parametersPath',
  query: 'parametersQuery',
  header: 'parametersHeader',
  cookie: 'parametersCookie',
} as const satisfies Record<ParameterLocation, string>;

export {
  createInitialParameterValues,
  getEnumOptions,
  getParameterInitialValue,
  getParameterInputKind,
  getParameterKey,
  type ParameterInputKind,
  type ParameterValues,
} from './parameterInputUtils';

export const TryItOutParameterInputs = ({
  parameters,
  document = null,
  values: valuesProp,
  onValuesChange,
}: TryItOutParameterInputsProps) => {
  const { viewerLang } = useTranslation();
  const baseId = useId();
  const [uncontrolledValues, setUncontrolledValues] = useState(() =>
    createInitialParameterValues(parameters, document)
  );

  const isControlled = valuesProp !== undefined;
  const values = isControlled ? valuesProp : uncontrolledValues;

  const setValue = (key: string, next: string) => {
    const updated = { ...values, [key]: next };
    if (!isControlled) {
      setUncontrolledValues(updated);
    }
    onValuesChange?.(updated);
  };

  if (parameters.length === 0) {
    return <p className={styles.empty}>{viewerLang.tryItOutParametersEmpty}</p>;
  }

  const grouped = groupParametersByLocation(parameters);

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>{viewerLang.tryItOutParametersTitle}</h3>

      {PARAMETER_LOCATIONS.map((location) => {
        const items = grouped[location];
        if (items.length === 0) {
          return null;
        }

        return (
          <div key={location} className={styles.group}>
            <h4 className={styles.groupTitle}>
              {viewerLang[LOCATION_LABEL_KEY[location]]}
              <span className={styles.groupCount}>{items.length}</span>
            </h4>

            <div className={styles.fields}>
              {items.map((parameter) => {
                const key = getParameterKey(parameter);
                const fieldId = `${baseId}-${key}`;
                const kind = getParameterInputKind(parameter.schema, document);
                const value = values[key] ?? '';

                return (
                  <div key={key} className={styles.field}>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor={fieldId}>
                        <code className={styles.name}>{parameter.name}</code>
                        {parameter.required ? (
                          <span className={styles.required}>{viewerLang.tryItOutRequired}</span>
                        ) : null}
                      </label>
                      <code className={styles.type}>{getSchemaTypeLabel(parameter.schema)}</code>
                    </div>

                    {parameter.description ? (
                      <p className={styles.description}>{parameter.description}</p>
                    ) : null}

                    <ParameterControl
                      id={fieldId}
                      kind={kind}
                      parameter={parameter}
                      document={document}
                      value={value}
                      onChange={(next) => setValue(key, next)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface ParameterControlProps {
  id: string;
  kind: ReturnType<typeof getParameterInputKind>;
  parameter: OperationParameter;
  document: Record<string, unknown> | null;
  value: string;
  onChange: (value: string) => void;
}

const ParameterControl = ({
  id,
  kind,
  parameter,
  document,
  value,
  onChange,
}: ParameterControlProps) => {
  const { viewerLang } = useTranslation();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    onChange(event.target.value);
  };

  if (kind === 'boolean') {
    return (
      <select
        id={id}
        className={styles.control}
        value={value}
        onChange={handleChange}
        required={parameter.required}
      >
        {!parameter.required || value === '' ? (
          <option value="">{viewerLang.tryItOutUnset}</option>
        ) : null}
        <option value="true">{viewerLang.tryItOutBooleanTrue}</option>
        <option value="false">{viewerLang.tryItOutBooleanFalse}</option>
      </select>
    );
  }

  if (kind === 'enum') {
    const options = getEnumOptions(parameter.schema, document);

    return (
      <select
        id={id}
        className={styles.control}
        value={value}
        onChange={handleChange}
        required={parameter.required}
      >
        {!parameter.required || !options.includes(value) ? (
          <option value="">{viewerLang.tryItOutUnset}</option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (kind === 'number') {
    return (
      <input
        id={id}
        className={styles.control}
        type="number"
        value={value}
        onChange={handleChange}
        required={parameter.required}
      />
    );
  }

  if (kind === 'array' || kind === 'object') {
    return (
      <>
        <textarea
          id={id}
          className={`${styles.control} ${styles.textarea}`}
          value={value}
          onChange={handleChange}
          required={parameter.required}
          rows={kind === 'object' ? 4 : 2}
          spellCheck={false}
        />
        <p className={styles.hint}>
          {kind === 'array' ? viewerLang.tryItOutArrayHint : viewerLang.tryItOutObjectHint}
        </p>
      </>
    );
  }

  return (
    <input
      id={id}
      className={styles.control}
      type="text"
      value={value}
      onChange={handleChange}
      required={parameter.required}
      spellCheck={false}
    />
  );
};
