"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { petService } from "@/services/petService";
import { statusLabel } from "@/lib/statusLabels";
import type { Pet } from "@/lib/types";

type PageProps = {
  params: { id: string };
};

export default function PetDetailPage({ params }: PageProps) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const id = Number(params.id);
        const petData = await petService.getById(id);
        setPet(petData);
      } catch (err) {
        setError("Não foi possível carregar os dados do pet.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0d0f] text-white flex items-center justify-center">
        <p>Carregando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0d0d0f] text-white flex items-center justify-center">
        <p>{error}</p>
      </main>
    );
  }

  if (!pet) {
    return (
      <main className="min-h-screen bg-[#0d0d0f] text-white flex items-center justify-center">
        <p>Pet não encontrado.</p>
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
                <p className="text-sm text-white/70">
                  {pet.species} • {pet.breed ?? "Sem raça informada"} •{" "}
                  {pet.age ? `${pet.age} anos` : `idade desconhecida`}
                </p>
              </div>
              <div className="text-right">
                <Link href="/" className="text-sm text-white/60 hover:text-white">
                  ← Voltar
                </Link>
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
