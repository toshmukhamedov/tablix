/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as WorkspaceProjectIdImport } from './routes/workspace/$projectId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const WorkspaceProjectIdRoute = WorkspaceProjectIdImport.update({
  id: '/workspace/$projectId',
  path: '/workspace/$projectId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/workspace/$projectId': {
      id: '/workspace/$projectId'
      path: '/workspace/$projectId'
      fullPath: '/workspace/$projectId'
      preLoaderRoute: typeof WorkspaceProjectIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/workspace/$projectId': typeof WorkspaceProjectIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/workspace/$projectId': typeof WorkspaceProjectIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/workspace/$projectId': typeof WorkspaceProjectIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/workspace/$projectId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/workspace/$projectId'
  id: '__root__' | '/' | '/workspace/$projectId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  WorkspaceProjectIdRoute: typeof WorkspaceProjectIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  WorkspaceProjectIdRoute: WorkspaceProjectIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/workspace/$projectId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/workspace/$projectId": {
      "filePath": "workspace/$projectId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
