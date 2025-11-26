import React from "react";
import Link from "next/link";
import { petService } from "@/services/petService";
import { statusLabel } from "@/lib/statusLabels";
import type { Metadata } from "next";

interface PetPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PetPageProps): Promise<Metadata> {
  try {
    const pet = await petService.getById(Number(params.id));
    return {
      title: pet.name ?? `Pet ${params.id}`,
      description: pet.description ?? "Detalhes do pet",
    } as Metadata;
  } catch (err) {
    return {
      title: `Pet ${params.id}`,
    } as Metadata;
  }
}

export default async function PetDetailPage({ params }: PetPageProps) {
  const id = Number(params.id);
  let pet;
  try {
    pet = await petService.getById(id);
  } catch (err) {
    return (
      <main className="min-h-screen bg-[#0d0d0f] text-white flex items-center justify-center">
        <div className="max-w-4xl px-4">
          <p className="text-center text-red-400">Não foi possível carregar o pet {id}.</p>
          <div className="text-center mt-4">
            <Link href="/" className="px-4 py-2 rounded-full bg-white text-black">Voltar à home</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white/5 border border-white/10 rounded-3xl p-6">
        <div className="flex items-start gap-6">
          <div className="w-1/3 flex items-center justify-center">
            <img
              src={pet.photoUrl && pet.photoUrl.trim().length > 0 ? pet.photoUrl : "/img/paw.png"}
              loading="lazy"
              alt={pet.name}
              className={`w-full h-auto rounded-lg ${!pet.photoUrl ? "object-contain p-6" : "object-cover"}`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{pet.name}</h1>
                <p className="text-sm text-white/70">{pet.species} • {pet.breed ?? "Sem raça informada"} • {pet.age ? `${pet.age} anos` : `idade desconhecida`}</p>
              </div>
              <div className="text-right">
                <Link href="/" className="text-sm text-white/60 hover:text-white">← Voltar</Link>
              </div>
            </div>

            <div className="mt-4 text-white/80">
              <p>{pet.description ?? "Sem descrição disponível."}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
              <div>
                <strong className="text-white/90">Idade:</strong> {pet.age ? `${pet.age} anos` : "Desconhecida"}
              </div>
              <div>
                <strong className="text-white/90">Raça:</strong> {pet.breed ?? "Sem raça informada"}
              </div>
              <div>
                <strong className="text-white/90">Espécie:</strong> {pet.species ?? "-"}
              </div>
              <div>
                <strong className="text-white/90">Status:</strong> {statusLabel(pet.status)}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
