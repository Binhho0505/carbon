// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { LoaderFunctionArgs, MiddlewareFunction } from "react-router";

/**
 * For an index route whose loader only redirects to a child
 * (`/x/issue/:id` → `/x/issue/:id/details`):
 *
 *   export const middleware = [redirectBeforeLoaders(loader)];
 *
 * The loaders of a matched branch run in parallel, so the parent layout's
 * loader ran in full for a request the index was about to redirect — once per
 * hover on a prefetching link to the bare URL, and twice per click. Middleware
 * runs before any loader, so the redirect is all such a request costs.
 *
 * GET and HEAD only: a form may post to the bare URL to reach the layout's
 * action. The loader stays exported, since it is what makes a client
 * navigation to the bare URL ask the server at all. A fetcher that LOADS the
 * bare URL to read the layout's data would be redirected as well.
 */
export function redirectBeforeLoaders<Result>(
  loader: (args: LoaderFunctionArgs) => unknown
): MiddlewareFunction<Result> {
  return async (args, next) => {
    if (args.request.method === "GET" || args.request.method === "HEAD") {
      await loader(args);
    }
    return next();
  };
}
