'use client';

import MonacoEditor, { loader } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

import { useThemeStore } from '@/store';

import styles from './EditorMonaco.module.css';

// Serve Monaco from /public instead of the default CDN (jsDelivr),
// which is often blocked and leaves the editor stuck on "Loading...".
loader.config({
  paths: {
    vs: '/monaco/vs',
  },
});

interface EditorMonacoProps {
  value: string;
  language: 'yaml' | 'json';
  onChange: (value: string) => void;
  onCursorChange: (line: number, column: number) => void;
}

const defineThemes = (monaco: typeof import('monaco-editor')) => {
  monaco.editor.defineTheme('swagger-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'string.key.json', foreground: 'f472b6' },
      { token: 'string.value.json', foreground: '67e8f9' },
      { token: 'number.json', foreground: 'fbbf24' },
      { token: 'keyword.json', foreground: 'c084fc' },
    ],
    colors: {
      'editor.background': '#0a0e14',
      'editor.foreground': '#e2e8f0',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#94a3b8',
      'editor.selectionBackground': '#1e3a5f',
      'editor.lineHighlightBackground': '#111827',
      'editorCursor.foreground': '#22d3ee',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
    },
  });

  monaco.editor.defineTheme('swagger-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'string.key.json', foreground: 'be185d' },
      { token: 'string.value.json', foreground: '0891b2' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#0f172a',
      'editorLineNumber.foreground': '#94a3b8',
      'editorCursor.foreground': '#0891b2',
    },
  });
};

export const EditorMonaco = ({ value, language, onChange, onCursorChange }: EditorMonacoProps) => {
  const theme = useThemeStore((state) => state.theme);
  const monacoTheme = theme === 'dark' ? 'swagger-dark' : 'swagger-light';

  const handleMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorInstance.onDidChangeCursorPosition((event) => {
      onCursorChange(event.position.lineNumber, event.position.column);
    });
  };

  return (
    <div className={styles.wrapper}>
      <MonacoEditor
        height="100%"
        language={language}
        theme={monacoTheme}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        beforeMount={defineThemes}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'var(--font-geist-mono, Consolas, monospace)',
          lineHeight: 20,
          padding: { top: 12, bottom: 12 },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          renderLineHighlight: 'line',
          bracketPairColorization: { enabled: true },
          folding: true,
          smoothScrolling: true,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};
