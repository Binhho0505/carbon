// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { notFound } from "@carbon/auth";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";
import { redirectBeforeLoaders } from "~/utils/redirect.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { invoiceId } = params;
  if (!invoiceId) throw notFound("Could not find invoiceId");
  throw redirect(path.to.salesInvoiceDetails(invoiceId));
}

export const middleware = [redirectBeforeLoaders(loader)];
