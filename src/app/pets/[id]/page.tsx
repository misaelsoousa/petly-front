"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { petService } from "@/services/petService";
import { statusLabel } from "@/lib/statusLabels";
import type { Pet } from "@/lib/types";
import { Arrow, Check, Info } from "../../../../public/icons";
import PostsList from "@/components/PostsList";
import { useAuth } from "@/providers/AuthProvider";
import { adoptionService } from "@/services/adoptionService";

type PageProps = {
  params: { id: string };
};

export default function PetDetailPage({ params }: PageProps) {
  const { token } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [otherPets, setOtherPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchPetData = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = Number(params.id);

      const [petData, allPetsData] = await Promise.all([
        petService.getById(id),
        petService.list(), // Fetch all pets
      ]);

      setPet(petData);

      // Filter out the current pet and take the first 3 others
      const filteredOthers = allPetsData.filter((p) => p.id !== petData.id).slice(0, 3);
      setOtherPets(filteredOthers);

    } catch (err) {
      setError("Não foi possível carregar os dados do pet.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetData();
  }, [params.id]);

  const handleAdopt = async () => {
    if (!token || !pet) {
      setFeedback("Faça login para solicitar adoção.");
      return;
    }
    try {
      await adoptionService.create({ petId: pet.id }, token);
      setFeedback("Solicitação de adoção enviada com sucesso!");
    } catch (apiError) {
      const message =
        (apiError as { message?: string })?.message ??
        "Não foi possível enviar a solicitação.";
      setFeedback(message);
    }
  };

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

  const petDetails = [
    { label: "Idade", value: pet.age ? `${pet.age} anos` : "Desconhecida" },
    { label: "Sexo", value: pet.sex ?? "Não informado" },
    { label: "Raça", value: pet.breed ?? "Sem raça definida" },
    { label: "Espécie", value: pet.species ?? "-" },
  ];

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 mt-5">
          <Link href="/" className="text-sm text-white/60 hover:text-white flex items-center gap-2">
            <Arrow className="w-4 h-4" /> Voltar para a lista
          </Link>
        </div>

        {/* Pet Details Section */}
        <div className="w-full bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex items-center justify-center">
            <img
              src={pet.photoUrl && pet.photoUrl.trim().length > 0 ? pet.photoUrl : "/img/paw.png"}
              loading="lazy"
              alt={pet.name}
              className={`w-full h-auto aspect-square rounded-2xl ${!pet.photoUrl ? "object-contain p-6 bg-black/20" : "object-cover"}`}
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">{pet.name}</h1>
                <div className={`mt-2 inline-flex items-center px-3 py-1 text-xs rounded-full uppercase tracking-wide ${
                    pet.status === 'AVAILABLE'
                      ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                      : "bg-purple-400/10 text-purple-200 border border-purple-400/20"
                  }`}>
                  {statusLabel(pet.status)}
                </div>
              </div>
              {pet.owner && (
                <div className="text-right text-sm">
                  <p className="text-white/60">Anunciado por</p>
                  <p className="font-semibold">{pet.owner.name}</p>
                </div>
              )}
            </div>

            <div className="mt-6 text-white/80 space-y-4">
              <p>{pet.description ?? "Sem descrição disponível."}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-white/80 border-t border-white/10 pt-6">
              {petDetails.map(detail => (
                <div key={detail.label}>
                  <strong className="text-sm text-white/60 block">{detail.label}</strong>
                  <span className="text-base">{detail.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-6">
              {feedback && (
                <div className="mb-4 text-center text-sm p-3 rounded-lg bg-white/10 flex items-center justify-center gap-2">
                  <Info className="w-4 h-4"/> {feedback}
                </div>
              )}
              {pet.status === "AVAILABLE" && (
                <button
                  onClick={handleAdopt}
                  className="w-full px-6 py-4 rounded-xl bg-orange-500 text-black font-semibold hover:bg-orange-400 transition-all text-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5"/> Quero Adotar
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Other Pets Section */}
        {otherPets.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Outros pets que podem te interessar</h2>
            <PostsList
              pets={otherPets}
              loading={loading}
              error={null} // Don't show main error here
              onRefresh={fetchPetData}
            />
          </div>
        )}
      </div>
    </main>
  );
}
