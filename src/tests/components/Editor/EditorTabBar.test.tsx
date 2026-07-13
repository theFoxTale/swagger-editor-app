import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EditorTabBar } from '@/components/Editor/EditorTabBar';
import { DEFAULT_SCHEMA, NEW_TAB_SCHEMA } from '@/lib/openapi';
import { useEditorStore, type EditorTab } from '@/store/useEditorStore';

vi.mock('@/hooks', () => ({
  useTranslation: () => ({
    editorLang: {
      newTab: 'New tab',
      closeTab: 'Close tab',
      tabsLabel: 'OpenAPI files',
    },
  }),
}));

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

describe('EditorTabBar', () => {
  beforeEach(() => {
    resetEditorStore();
  });

  it('renders the active tab and a New tab button', () => {
    render(<EditorTabBar />);

    expect(screen.getByRole('tablist', { name: 'OpenAPI files' })).toBeInTheDocument();
    expect(screen.getByText('openapi.yaml')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New tab' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Close tab/ })).not.toBeInTheDocument();
  });

  it('creates a new tab when + is clicked', async () => {
    const user = userEvent.setup();
    render(<EditorTabBar />);

    await user.click(screen.getByRole('button', { name: 'New tab' }));

    expect(screen.getByText('openapi.yaml')).toBeInTheDocument();
    expect(screen.getByText('openapi-2.yaml')).toBeInTheDocument();
    expect(useEditorStore.getState().tabs).toHaveLength(2);
    expect(useEditorStore.getState().tabs[1].content).toBe(NEW_TAB_SCHEMA);
  });

  it('switches tabs when another tab is clicked', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().addTab();
    render(<EditorTabBar />);

    const firstTabId = useEditorStore.getState().tabs[0].id;

    await user.click(screen.getByText('openapi.yaml'));

    expect(useEditorStore.getState().activeTabId).toBe(firstTabId);
  });

  it('closes a tab with the close button', async () => {
    const user = userEvent.setup();
    useEditorStore.getState().addTab();
    render(<EditorTabBar />);

    expect(screen.getByRole('button', { name: 'Close tab: openapi-2.yaml' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close tab: openapi-2.yaml' }));

    expect(screen.queryByText('openapi-2.yaml')).not.toBeInTheDocument();
    expect(useEditorStore.getState().tabs).toHaveLength(1);
  });
});
