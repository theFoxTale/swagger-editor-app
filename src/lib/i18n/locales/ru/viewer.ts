import type { ViewerTranslation } from '../../types';

export const viewer: ViewerTranslation = {
  title: 'Просмотр',
  emptySchema: 'Загрузите корректную OpenAPI-схему в редакторе, чтобы увидеть эндпоинты.',
  baseUrl: 'Базовый URL',
  endpointsLabel: 'Эндпоинты API',
  emptyEndpoints: 'В этой схеме нет эндпоинтов.',
  requiresAuth: 'Требуется аутентификация',
  tagGroupLabel: 'Группа тегов {name}',
  operationsCount: 'Операций: {count}',
  expandEndpoint: 'Показать детали эндпоинта {method} {path}',
  collapseEndpoint: 'Скрыть детали эндпоинта {method} {path}',
};
