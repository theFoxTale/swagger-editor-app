'use client';

import { useTranslation } from '@/hooks';

import {
  PARAMETER_LOCATIONS,
  type OperationParameter,
  type OpenApiSchema,
  type ParameterLocation,
} from '@/lib/openapi';

import styles from './EndpointParameters.module.css';

export interface EndpointParametersProps {
  parameters: OperationParameter[];
}

const LOCATION_LABEL_KEY = {
  path: 'parametersPath',
  query: 'parametersQuery',
  header: 'parametersHeader',
  cookie: 'parametersCookie',
} as const satisfies Record<ParameterLocation, string>;

export const getSchemaTypeLabel = (schema?: OpenApiSchema): string => {
  if (!schema) {
    return '—';
  }

  if (typeof schema.$ref === 'string') {
    const refName = schema.$ref.split('/').pop();
    return refName && refName.length > 0 ? refName : schema.$ref;
  }

  if (typeof schema.type === 'string') {
    if (schema.type === 'array' && typeof schema.items === 'object' && schema.items !== null) {
      const itemsLabel = getSchemaTypeLabel(schema.items as OpenApiSchema);
      return `array<${itemsLabel}>`;
    }

    if (typeof schema.format === 'string') {
      return `${schema.type} (${schema.format})`;
    }

    return schema.type;
  }

  return 'object';
};

export const groupParametersByLocation = (
  parameters: OperationParameter[]
): Record<ParameterLocation, OperationParameter[]> => {
  const groups: Record<ParameterLocation, OperationParameter[]> = {
    path: [],
    query: [],
    header: [],
    cookie: [],
  };

  for (const parameter of parameters) {
    groups[parameter.in].push(parameter);
  }

  return groups;
};

const formatExample = (value: unknown): string | null => {
  if (value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const EndpointParameters = ({ parameters }: EndpointParametersProps) => {
  const { viewerLang } = useTranslation();
  const grouped = groupParametersByLocation(parameters);

  if (parameters.length === 0) {
    return <p className={styles.empty}>{viewerLang.parametersEmpty}</p>;
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>{viewerLang.parametersTitle}</h3>

      {PARAMETER_LOCATIONS.map((location) => {
        const items = grouped[location];
        if (items.length === 0) {
          return null;
        }

        const labelKey = LOCATION_LABEL_KEY[location];
        const label = viewerLang[labelKey];

        return (
          <div key={location} className={styles.group}>
            <h4 className={styles.groupTitle}>
              {label}
              <span className={styles.groupCount}>{items.length}</span>
            </h4>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">{viewerLang.parameterName}</th>
                    <th scope="col">{viewerLang.parameterType}</th>
                    <th scope="col">{viewerLang.parameterRequired}</th>
                    <th scope="col">{viewerLang.parameterDescription}</th>
                    <th scope="col">{viewerLang.parameterExample}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((parameter) => {
                    const example = formatExample(parameter.example);

                    return (
                      <tr key={`${parameter.in}:${parameter.name}`}>
                        <td>
                          <code className={styles.name}>{parameter.name}</code>
                          {parameter.deprecated ? (
                            <span className={styles.deprecated}>{viewerLang.deprecated}</span>
                          ) : null}
                        </td>
                        <td>
                          <code className={styles.type}>
                            {getSchemaTypeLabel(parameter.schema)}
                          </code>
                        </td>
                        <td>
                          {parameter.required ? (
                            <span className={styles.required}>
                              {viewerLang.parameterRequiredYes}
                            </span>
                          ) : (
                            <span className={styles.optional}>
                              {viewerLang.parameterRequiredNo}
                            </span>
                          )}
                        </td>
                        <td className={styles.description}>
                          {parameter.description ?? viewerLang.parameterNoDescription}
                        </td>
                        <td>{example ? <code className={styles.example}>{example}</code> : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
