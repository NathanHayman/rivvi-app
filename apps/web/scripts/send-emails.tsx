import "dotenv-flow/config";

import prisma from "@/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      workspaces: {
        some: {
          workspace: {
            slug: "nathan",
          },
        },
      },
    },
    select: {
      name: true,
      email: true,
    },
  });

  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify(
      users.map(({ name, email }) => {
        return {
          from: "Nathan from Phunq <nathan@phunq.co>",
          to: email,
          subject: "Hello from Phunq",
          text: `Hi ${name},\n\nThis is a test email from Phunq.\n\nBest,\nNathan`,
        };
      }),
    ),
  }).then((res) => res.json());

  console.log(response);
}

main();
