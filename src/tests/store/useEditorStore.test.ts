import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_SCHEMA, NEW_TAB_SCHEMA } from '@/lib/openapi';
import { getActiveTab, useEditorStore, type EditorTab } from '@/store/useEditorStore';

const createTab = (overrides: Partial<EditorTab> = {}): EditorTab => ({
  id: 'tab-1',
  fileName: 'openapi.yaml',
  content: DEFAULT_SCHEMA,
  format: 'yaml',
  isValid: true,
  validationErrors: [],
  parsedSpec: {
    openapi: '3.0.3',
    info: { title: 'Pet Store API', version: '1.0.0' },
    paths: {},
  },
  lastSavedAt: null,
  cursor: { line: 1, column: 1 },
  isDirty: false,
  ...overrides,
});

const resetEditorStore = () => {
  const tab = createTab();

  useEditorStore.setState({
    tabs: [tab],
    activeTabId: tab.id,
  });
};

describe('useEditorStore tabs', () => {
  beforeEach(() => {
    resetEditorStore();
  });

  it('starts with a single active tab', () => {
    const state = useEditorStore.getState();

    expect(state.tabs).toHaveLength(1);
    expect(state.activeTabId).toBe('tab-1');
    expect(getActiveTab(state).fileName).toBe('openapi.yaml');
  });

  it('adds a new tab with a unique name and focuses it', () => {
    useEditorStore.getState().addTab();

    const state = useEditorStore.getState();
    const activeTab = getActiveTab(state);

    expect(state.tabs).toHaveLength(2);
    expect(activeTab.content).toBe(NEW_TAB_SCHEMA);
    expect(activeTab.fileName).toBe('openapi-2.yaml');
    expect(activeTab.isValid).toBe(true);
  });

  it('switches between tabs', () => {
    const firstTabId = useEditorStore.getState().activeTabId;
    useEditorStore.getState().addTab();
    const secondTabId = useEditorStore.getState().activeTabId;

    useEditorStore.getState().setActiveTab(firstTabId);

    expect(useEditorStore.getState().activeTabId).toBe(firstTabId);

    useEditorStore.getState().setActiveTab(secondTabId);

    expect(useEditorStore.getState().activeTabId).toBe(secondTabId);
  });

  it('does not close the last remaining tab', () => {
    useEditorStore.getState().closeTab('tab-1');

    expect(useEditorStore.getState().tabs).toHaveLength(1);
    expect(useEditorStore.getState().activeTabId).toBe('tab-1');
  });

  it('closes a tab and activates a neighbor', () => {
    useEditorStore.getState().addTab();
    const secondTabId = useEditorStore.getState().activeTabId;

    useEditorStore.getState().closeTab(secondTabId);

    const state = useEditorStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.activeTabId).toBe('tab-1');
  });

  it('updates only the active tab content and marks it dirty', () => {
    useEditorStore.getState().addTab();
    const secondTabId = useEditorStore.getState().activeTabId;
    const firstTabId = useEditorStore.getState().tabs[0].id;

    useEditorStore.getState().setContent(NEW_TAB_SCHEMA);

    const state = useEditorStore.getState();
    const activeTab = getActiveTab(state);
    const inactiveTab = state.tabs.find((tab) => tab.id === firstTabId);

    expect(activeTab.id).toBe(secondTabId);
    expect(activeTab.isDirty).toBe(true);
    expect(activeTab.content).toBe(NEW_TAB_SCHEMA);
    expect(inactiveTab?.content).toBe(DEFAULT_SCHEMA);
    expect(inactiveTab?.isDirty).toBe(false);
  });

  it('toggles YAML to JSON on the active tab', () => {
    useEditorStore.getState().setContent(NEW_TAB_SCHEMA);
    useEditorStore.getState().toggleFormat();

    const activeTab = getActiveTab(useEditorStore.getState());

    expect(activeTab.format).toBe('json');
    expect(activeTab.fileName).toBe('openapi.json');
    expect(activeTab.content).toContain('"openapi": "3.0.3"');
    expect(activeTab.isValid).toBe(true);
  });

  it('formats the active document in place', () => {
    useEditorStore
      .getState()
      .setContent('{"openapi":"3.0.3","info":{"title":"Demo API","version":"1.0.0"},"paths":{}}');

    useEditorStore.getState().formatDocument();

    const activeTab = getActiveTab(useEditorStore.getState());

    expect(activeTab.format).toBe('json');
    expect(activeTab.content).toContain('\n  "openapi": "3.0.3"');
    expect(activeTab.isValid).toBe(true);
  });

  it('saves the active tab and clears the dirty flag', () => {
    useEditorStore.getState().setContent(NEW_TAB_SCHEMA);
    expect(getActiveTab(useEditorStore.getState()).isDirty).toBe(true);

    useEditorStore.getState().saveSchema();

    const activeTab = getActiveTab(useEditorStore.getState());
    expect(activeTab.isDirty).toBe(false);
    expect(activeTab.lastSavedAt).toEqual(expect.any(Number));
  });
});
