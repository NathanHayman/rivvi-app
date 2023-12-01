import cloudinary from "cloudinary";

import { deleteDomainAndSites } from "@/lib/api/domains";
import prisma from "@/lib/prisma";
import { cancelSubscription } from "@/lib/stripe";
import { WorkspaceProps } from "@/lib/types";

export async function deleteWorkspace(
  workspace: Pick<WorkspaceProps, "id" | "slug" | "stripeId" | "logo">,
) {
  const domains = (
    await prisma.domain.findMany({
      where: {
        workspaceId: workspace.id,
      },
      select: {
        slug: true,
      },
    })
  ).map((domain) => domain.slug);

  // delete all domains, links, and uploaded images associated with the workspace
  const deleteDomainsResponse = await Promise.allSettled(
    domains.map((domain) =>
      deleteDomainAndSites(domain, {
        // here, we don't need to delete in prisma because we're deleting the workspace later and have onDelete: CASCADE set
        skipPrismaDelete: true,
      }),
    ),
  );

  const deleteWorkspaceResponse = await Promise.all([
    // delete workspace logo from Cloudinary
    workspace.logo &&
      cloudinary.v2.uploader.destroy(`logos/${workspace.id}`, {
        invalidate: true,
      }),
    // if they have a Stripe subscription, cancel it
    workspace.stripeId && cancelSubscription(workspace.stripeId),
    // delete the workspace
    prisma.workspace.delete({
      where: {
        slug: workspace.slug,
      },
    }),
  ]);

  return {
    deleteWorkspaceResponse,
    deleteDomainsResponse,
  };
}
