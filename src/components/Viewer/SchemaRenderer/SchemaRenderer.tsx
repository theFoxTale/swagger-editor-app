'use client';

import { useTranslation } from '@/hooks';
import type { OpenApiSchema } from '@/lib/openapi';

import { getSchemaTypeLabel } from '../schemaUtils';
import styles from './SchemaRenderer.module.css';

export interface SchemaRendererProps {
  schema?: OpenApiSchema;
  name?: string;
  required?: boolean;
  depth?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getRequiredSet = (schema: OpenApiSchema): Set<string> => {
  if (!Array.isArray(schema.required)) {
    return new Set();
  }

  return new Set(schema.required.filter((item): item is string => typeof item === 'string'));
};

const getEnumValues = (schema: OpenApiSchema): unknown[] =>
  Array.isArray(schema.enum) ? schema.enum : [];

const getDescription = (schema: OpenApiSchema): string | undefined =>
  typeof schema.description === 'string' ? schema.description : undefined;

export const SchemaRenderer = ({
  schema,
  name,
  required = false,
  depth = 0,
}: SchemaRendererProps) => {
  const { viewerLang } = useTranslation();

  if (!schema) {
    return <p className={styles.empty}>{viewerLang.schemaEmpty}</p>;
  }

  const typeLabel = getSchemaTypeLabel(schema);
  const description = getDescription(schema);
  const enumValues = getEnumValues(schema);
  const requiredFields = getRequiredSet(schema);
  const properties = isRecord(schema.properties) ? Object.entries(schema.properties) : [];
  const itemsSchema = isRecord(schema.items) ? (schema.items as OpenApiSchema) : undefined;
  const compositionKeys = ['allOf', 'anyOf', 'oneOf'] as const;

  return (
    <div className={styles.node} data-depth={depth}>
      <div className={styles.row}>
        {name ? <code className={styles.name}>{name}</code> : null}

        <code className={styles.type}>{typeLabel}</code>

        {required ? (
          <span className={styles.required}>{viewerLang.schemaRequired}</span>
        ) : name ? (
          <span className={styles.optional}>{viewerLang.schemaOptional}</span>
        ) : null}

        {typeof schema.format === 'string' ? (
          <span className={styles.format}>{schema.format}</span>
        ) : null}
      </div>

      {description ? <p className={styles.description}>{description}</p> : null}

      {enumValues.length > 0 ? (
        <div className={styles.enum}>
          <span className={styles.enumLabel}>{viewerLang.schemaEnum}:</span>
          <div className={styles.enumValues}>
            {enumValues.map((value, index) => (
              <code key={`${String(value)}-${index}`} className={styles.enumValue}>
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </code>
            ))}
          </div>
        </div>
      ) : null}

      {properties.length > 0 ? (
        <ul className={styles.children}>
          {properties.map(([propertyName, propertySchema]) => (
            <li key={propertyName} className={styles.child}>
              <SchemaRenderer
                name={propertyName}
                schema={isRecord(propertySchema) ? (propertySchema as OpenApiSchema) : undefined}
                required={requiredFields.has(propertyName)}
                depth={depth + 1}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {schema.type === 'array' && itemsSchema ? (
        <div className={styles.items}>
          <span className={styles.itemsLabel}>{viewerLang.schemaItems}</span>
          <SchemaRenderer schema={itemsSchema} depth={depth + 1} />
        </div>
      ) : null}

      {compositionKeys.map((key) => {
        const value = schema[key];
        if (!Array.isArray(value) || value.length === 0) {
          return null;
        }

        const label =
          key === 'allOf'
            ? viewerLang.schemaAllOf
            : key === 'anyOf'
              ? viewerLang.schemaAnyOf
              : viewerLang.schemaOneOf;

        return (
          <div key={key} className={styles.composition}>
            <span className={styles.compositionLabel}>{label}</span>
            <ul className={styles.children}>
              {value.map((entry, index) => (
                <li key={`${key}-${index}`} className={styles.child}>
                  <SchemaRenderer
                    schema={isRecord(entry) ? (entry as OpenApiSchema) : undefined}
                    depth={depth + 1}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {typeof schema.$ref === 'string' ? <code className={styles.ref}>{schema.$ref}</code> : null}
    </div>
  );
};
