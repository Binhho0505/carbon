// SPDX-License-Identifier: AGPL-3.0-only
// Carbon (github.com/crbnos/carbon). Modified or adapted versions of this file,
// including ports, remain AGPLv3; serving them over a network requires releasing their source.

import { Button, VStack } from "@carbon/react";
import { Link } from "react-router";
import { useUrlParams } from "~/hooks";
import type { Route } from "~/types";
import { useSidebarLocation } from "./CollapsibleSidebar";

const ContentSidebar = ({ links }: { links: Route[] }) => {
  const location = useSidebarLocation((pathname) =>
    links.some((route) => pathname.includes(route.to))
  );
  const [params] = useUrlParams();
  const filter = params.get("q") ?? undefined;

  return (
    <div className="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full w-full pb-8">
      <VStack>
        <VStack spacing={1} className="p-2">
          {links.map((route) => {
            const isActive =
              location.pathname.includes(route.to) && route.q === filter;
            return (
              <Button
                key={route.name}
                asChild
                leftIcon={route.icon}
                variant={isActive ? "active" : "ghost"}
                className="w-full justify-start"
              >
                <Link
                  to={route.to + (route.q ? `?q=${route.q}` : "")}
                  prefetch="intent"
                >
                  {route.name}
                </Link>
              </Button>
            );
          })}
        </VStack>
      </VStack>
    </div>
  );
};

export default ContentSidebar;
