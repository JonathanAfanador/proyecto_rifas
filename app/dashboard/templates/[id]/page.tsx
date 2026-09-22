// app/dashboard/templates/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditTemplateClient } from "@/components/EditTemplateClient";

export default async function EditTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const template = await prisma.template.findUnique({
    where: { id },
  });

  if (!template || template.deletedAt) {
    redirect("/dashboard");
  }

  // Preparamos los datos garantizando el tipo correcto para TypeScript
  const templateData = {
    id: template.id,
    name: template.name,
    imageUrl: template.imageUrl,
    positions: template.positions as { x: number; y: number }[],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <EditTemplateClient template={templateData} />
    </div>
  );
}