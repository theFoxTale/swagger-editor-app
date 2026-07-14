import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  convertFormat,
  DEFAULT_SCHEMA,
  detectFormat,
  NEW_TAB_SCHEMA,
  type SchemaFormat,
  validateSchema,
} from '@/lib/openapi';

interface CursorPosition {
  line: number;
  column: number;
}

export interface EditorTab {
  id: string;
  fileName: string;
  content: string;
  format: SchemaFormat;
  isValid: boolean;
  validationErrors: string[];
  parsedSpec: Record<string, unknown> | null;
  lastSavedAt: number | null;
  cursor: CursorPosition;
  isDirty: boolean;
}

interface EditorState {
  tabs: EditorTab[];
  activeTabId: string;

  addTab: () => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  setContent: (content: string) => void;
  setFormat: (format: SchemaFormat) => void;
  setCursor: (cursor: CursorPosition) => void;
  validate: () => void;
  formatDocument: () => void;
  toggleFormat: () => void;
  saveSchema: () => void;
  restoreSavedSchema: (content: string, format: SchemaFormat, savedAt: number) => void;
}

const runValidation = (content: string) => {
  const result = validateSchema(content);

  return {
    isValid: result.isValid,
    validationErrors: result.errors,
    parsedSpec: result.parsed,
  };
};

const createTabId = () => `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const buildFileName = (base: string, format: SchemaFormat, existingNames: Set<string>) => {
  const extension = format === 'json' ? 'json' : 'yaml';
  let index = 1;
  let fileName = `${base}.${extension}`;

  while (existingNames.has(fileName)) {
    index += 1;
    fileName = `${base}-${index}.${extension}`;
  }

  return fileName;
};

const createEditorTab = (
  content: string,
  format: SchemaFormat,
  existingNames: Set<string>,
  baseName = 'openapi'
): EditorTab => {
  const validation = runValidation(content);
  const fileName = buildFileName(baseName, format, existingNames);

  return {
    id: createTabId(),
    fileName,
    content,
    format,
    isValid: validation.isValid,
    validationErrors: validation.validationErrors,
    parsedSpec: validation.parsedSpec,
    lastSavedAt: null,
    cursor: { line: 1, column: 1 },
    isDirty: false,
  };
};

const updateActiveTab = (
  tabs: EditorTab[],
  activeTabId: string,
  updater: (tab: EditorTab) => EditorTab
): EditorTab[] => tabs.map((tab) => (tab.id === activeTabId ? updater(tab) : tab));

export const getActiveTab = (state: EditorState): EditorTab => {
  const tab = state.tabs.find((item) => item.id === state.activeTabId);
  if (!tab) {
    throw new Error('Active editor tab not found');
  }
  return tab;
};

const initialTab = createEditorTab(DEFAULT_SCHEMA, 'yaml', new Set());

export const useEditorStore = create<EditorState>()((set, get) => ({
  tabs: [initialTab],
  activeTabId: initialTab.id,

  addTab: () => {
    const { tabs } = get();
    const existingNames = new Set(tabs.map((tab) => tab.fileName));
    const newTab = createEditorTab(NEW_TAB_SCHEMA, 'yaml', existingNames);

    set({
      tabs: [...tabs, newTab],
      activeTabId: newTab.id,
    });
  },

  closeTab: (tabId) => {
    const { tabs, activeTabId } = get();

    if (tabs.length <= 1) {
      return;
    }

    const closingIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (closingIndex === -1) {
      return;
    }

    const nextTabs = tabs.filter((tab) => tab.id !== tabId);
    let nextActiveId = activeTabId;

    if (activeTabId === tabId) {
      const nextIndex = closingIndex > 0 ? closingIndex - 1 : 0;
      nextActiveId = nextTabs[nextIndex]?.id ?? nextTabs[0].id;
    }

    set({
      tabs: nextTabs,
      activeTabId: nextActiveId,
    });
  },

  setActiveTab: (tabId) => {
    const { tabs } = get();
    if (tabs.some((tab) => tab.id === tabId)) {
      set({ activeTabId: tabId });
    }
  },

  setContent: (content) => {
    const { tabs, activeTabId } = get();
    const detectedFormat = detectFormat(content);
    const validation = runValidation(content);

    set({
      tabs: updateActiveTab(tabs, activeTabId, (tab) => ({
        ...tab,
        content,
        format: detectedFormat,
        fileName: tab.fileName.replace(
          /\.(yaml|json)$/,
          `.${detectedFormat === 'json' ? 'json' : 'yaml'}`
        ),
        isDirty: true,
        ...validation,
      })),
    });
  },

  setFormat: (format) => {
    const { tabs, activeTabId } = get();

    set({
      tabs: updateActiveTab(tabs, activeTabId, (tab) => ({ ...tab, format })),
    });
  },

  setCursor: (cursor) => {
    const { tabs, activeTabId } = get();

    set({
      tabs: updateActiveTab(tabs, activeTabId, (tab) => ({ ...tab, cursor })),
    });
  },

  validate: () => {
    const { tabs, activeTabId } = get();
    const activeTab = getActiveTab(get());

    set({
      tabs: updateActiveTab(tabs, activeTabId, (tab) => ({
        ...tab,
        ...runValidation(activeTab.content),
      })),
    });
  },

  formatDocument: () => {
    const { tabs, activeTabId } = get();
    const activeTab = getActiveTab(get());

    try {
      const converted = convertFormat(activeTab.content, activeTab.format, activeTab.format);

      set({
        tabs: updateActiveTab(tabs, activeTabId, (tab) => ({
          ...tab,
          content: converted,
          isDirty: true,
          ...runValidation(converted),
        })),
      });
    } catch {
      get().validate();
    }
  },

  toggleFormat: () => {
    const { tabs, activeTabId } = get();
    const activeTab = getActiveTab(get());
    const nextFormat: SchemaFormat = activeTab.format === 'yaml' ? 'json' : 'yaml';

    try {
      const converted = convertFormat(activeTab.content, activeTab.format, nextFormat);

      set({
        tabs: updateActiveTab(tabs, activeTabId, (tab) => ({
          ...tab,
          content: converted,
          format: nextFormat,
          fileName: tab.fileName.replace(/\.(yaml|json)$/, `.${nextFormat}`),
          isDirty: true,
          ...runValidation(converted),
        })),
      });
    } catch {
      set({
        tabs: updateActiveTab(tabs, activeTabId, (tab) => ({
          ...tab,
          format: nextFormat,
          fileName: tab.fileName.replace(/\.(yaml|json)$/, `.${nextFormat}`),
        })),
      });
    }
  },

  saveSchema: () => {
    const { tabs, activeTabId } = get();
    const activeTab = getActiveTab(get());
    const validation = runValidation(activeTab.content);

    set({
      tabs: updateActiveTab(tabs, activeTabId, (tab) => ({
        ...tab,
        lastSavedAt: Date.now(),
        isDirty: false,
        ...validation,
      })),
    });
  },

  restoreSavedSchema: (content, format, savedAt) => {
    const { tabs, activeTabId } = get();
    const validation = runValidation(content);

    set({
      tabs: updateActiveTab(tabs, activeTabId, (tab) => ({
        ...tab,
        content,
        format,
        fileName: tab.fileName.replace(/\.(yaml|json)$/, `.${format}`),
        lastSavedAt: savedAt,
        isDirty: false,
        ...validation,
      })),
    });
  },
}));

interface SavedSchemaState {
  savedContent: string | null;
  savedFormat: SchemaFormat | null;
  savedAt: number | null;
  ownerEmail: string | null;

  persistSchema: (email: string, content: string, format: SchemaFormat) => void;
  clearSavedSchema: () => void;
}

export const useSavedSchemaStore = create<SavedSchemaState>()(
  persist(
    (set) => ({
      savedContent: null,
      savedFormat: null,
      savedAt: null,
      ownerEmail: null,

      persistSchema: (email, content, format) => {
        set({
          savedContent: content,
          savedFormat: format,
          savedAt: Date.now(),
          ownerEmail: email,
        });
      },

      clearSavedSchema: () => {
        set({
          savedContent: null,
          savedFormat: null,
          savedAt: null,
          ownerEmail: null,
        });
      },
    }),
    {
      name: 'swagger-schema-storage',
    }
  )
);
