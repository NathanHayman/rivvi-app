import cloudinary from "cloudinary";
import { NextResponse } from "next/server";

import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/workspaces/[slug]/logo – upload a new workspace logo
export const POST = withAuth(
  async ({ req, workspace }) => {
    const { image } = await req.json();

    const { secure_url } = await cloudinary.v2.uploader.upload(image, {
      public_id: workspace.id,
      folder: "logos",
      overwrite: true,
      invalidate: true,
    });

    const response = await prisma.workspace.update({
      where: { id: workspace.id },
      data: { logo: secure_url },
    });

    return NextResponse.json(response);
  },
  {
    requiredRole: ["OWNER"],
  },
);
