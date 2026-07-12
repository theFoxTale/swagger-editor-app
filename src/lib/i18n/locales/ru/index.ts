import type { Translation } from '../../types';

import { about } from './about';
import { auth } from './auth';
import { common } from './common';
import { editor } from './editor';
import { header } from './header';
import { history } from './history';
import { viewer } from './viewer';

export const ru: Translation = {
  aboutLang: about,
  authLang: auth,
  commonLang: common,
  editorLang: editor,
  headerLang: header,
  historyLang: history,
  viewerLang: viewer,
};
