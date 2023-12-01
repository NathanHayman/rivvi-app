import { getSearchParams } from "@phunq/utils";
import { Site as SiteProps } from "@prisma/client";
import { createHash } from "crypto";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";

import { PlanProps, WorkspaceProps } from "../types";
import { authOptions } from "./options";

export interface Session {
  user: {
    email: string;
    id: string;
    name: string;
    image?: string;
  };
}

export const getSession = async () => {
  return getServerSession(authOptions) as Promise<Session>;
};

export const hashToken = (
  token: string,
  {
    noSecret = false,
  }: {
    noSecret?: boolean;
  } = {},
) => {
  return createHash("sha256")
    .update(`${token}${noSecret ? "" : process.env.NEXTAUTH_SECRET}`)
    .digest("hex");
};

interface WithAuthHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    session,
    workspace,
    domain,
    site,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
    workspace: WorkspaceProps;
    domain: string;
    site?: SiteProps;
  }): Promise<Response>;
}
export const withAuth =
  (
    handler: WithAuthHandler,
    {
      requiredPlan = ["free", "pro", "enterprise"], // if the action needs a specific plan
      requiredRole = ["OWNER", "MEMBER"],
      needNotExceededUsage, // if the action needs the user to not have exceeded their usage
    }: {
      requiredPlan?: Array<PlanProps>;
      requiredRole?: Array<"OWNER" | "MEMBER">;
      needNotExceededUsage?: boolean;
    } = {},
  ) =>
  async (
    req: Request,
    { params }: { params: Record<string, string> | undefined },
  ) => {
    const searchParams = getSearchParams(req.url);
    const { workspaceSlug, key, domain } = params || {};
    // const domain = params?.domain || searchParams.domain;

    let session: Session | undefined;
    let headers = {};

    session = await getSession();
    if (!session?.user.id) {
      return new Response("Unauthorized: Login required.", {
        status: 401,
        headers,
      });
    }

    const [workspace, site] = (await Promise.all([
      workspaceSlug &&
        prisma.workspace.findUnique({
          where: {
            slug: workspaceSlug,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            studioKey: true,
            studioTokenEditor: true,
            usage: true,
            usageLimit: true,
            plan: true,
            stripeId: true,
            billingCycleStart: true,
            createdAt: true,
            users: {
              where: {
                userId: session.user.id,
              },
              select: {
                role: true,
              },
            },
            domains: {
              select: {
                slug: true,
              },
            },
          },
        }),
      key &&
        prisma.site.findUnique({
          where: {
            domain_key: {
              domain,
              key,
            },
          },
        }),
    ])) as [WorkspaceProps | undefined, SiteProps | undefined];

    // workspace checks
    if (workspaceSlug) {
      if (!workspace || !workspace.users) {
        // workspace doesn't exist
        return new Response("Workspace not found.", {
          status: 404,
          headers,
        });
      }

      // prevent unauthorized access to domains that don't belong to the workspace
      if (domain) {
        if (!workspace.domains?.find((d) => d.slug === domain)) {
          return new Response("Domain does not belong to workspace.", {
            status: 403,
            headers,
          });
        }
      }

      if (site && site.workspaceId !== workspace.id) {
        return new Response("Unauthorized: Invalid site.", {
          status: 403,
          headers,
        });
      }

      // workspace exists but user is not part of it
      if (workspace.users.length === 0) {
        const pendingInvites = await prisma.workspaceInvite.findUnique({
          where: {
            email_workspaceId: {
              email: session.user.email,
              workspaceId: workspace.id,
            },
          },
          select: {
            expires: true,
          },
        });
        if (!pendingInvites) {
          return new Response("Workspace not found.", {
            status: 404,
            headers,
          });
        } else if (pendingInvites.expires < new Date()) {
          return new Response("Workspace invite expired.", {
            status: 410,
            headers,
          });
        } else {
          return new Response("Workspace invite pending.", {
            status: 409,
            headers,
          });
        }
      }

      if (
        requiredRole &&
        workspace.plan === "enterprise" &&
        !requiredRole.includes(workspace.users[0].role) &&
        // removing self from Workspace should be allowed (DELETE /api/workspaces/[workspaceSlug]/users?userId=...)
        !(
          req.url ===
            `/api/workspaces/${workspaceSlug}/users?userId=${session.user.id}` &&
          req.method === "DELETE"
        )
      ) {
        return new Response("Unauthorized: Insufficient permissions.", {
          status: 403,
          headers,
        });
      }

      if (needNotExceededUsage && workspace.usage > workspace.usageLimit) {
        return new Response("Unauthorized: Usage limits exceeded.", {
          status: 403,
          headers,
        });
      }

      if (!requiredPlan.includes(workspace.plan)) {
        // return res.status(403).end("Unauthorized: Need higher plan.");
        return new Response("Unauthorized: Need higher plan.", {
          status: 403,
          headers,
        });
      }
    }

    // site checks
    if (key) {
      if (!site) {
        return new Response("site not found.", {
          status: 404,
          headers,
        });
      }

      // if it's the default dub.sh funnel, we need to make sure the user is the owner of the funnel
      if (site.domain === "rivvi.app" && site.id !== session.user.id) {
        return new Response("Unauthorized: Invalid site.", {
          status: 403,
          headers,
        });
      }
    }

    return handler({
      req,
      params: params || {},
      searchParams,
      headers,
      session,
      workspace: workspace as WorkspaceProps,
      domain,
      site,
    });
  };

interface WithSessionHandler {
  ({
    req,
    params,
    searchParams,
    session,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    session: Session;
  }): Promise<Response>;
}

export const withSession =
  (handler: WithSessionHandler) =>
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const session = await getSession();
    if (!session?.user.id) {
      return new Response("Unauthorized: Login required.", { status: 401 });
    }

    const searchParams = getSearchParams(req.url);
    return handler({ req, params, searchParams, session });
  };
