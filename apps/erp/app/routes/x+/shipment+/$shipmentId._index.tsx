// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";
import { redirectBeforeLoaders } from "~/utils/redirect.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { shipmentId } = params;
  if (!shipmentId) throw new Error("Could not find shipmentId");
  throw redirect(path.to.shipmentDetails(shipmentId));
}

export const middleware = [redirectBeforeLoaders(loader)];
