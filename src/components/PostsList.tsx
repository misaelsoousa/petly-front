"use client";

import React, { useState } from "react";
import type { Pet } from "@/lib/types";
import { statusLabel } from "@/lib/statusLabels";
import { motion } from "framer-motion";
import Link from "next/link";
import { adoptionService } from "@/services/adoptionService";
import { useAuth } from "@/providers/AuthProvider";

const gradients = [
  "from-[#1f1f2b] to-[#2a1f1f]",
  "from-[#1d1f2f] to-[#162032]",
  "from-[#231f2a] to-[#2b1f1f]",
  "from-[#1a1f29] to-[#141b31]",
];

interface PostsListProps {
  pets: Pet[];
  loading: boolean;
  error?: string | null;
  onRefresh: () => Promise<void>;
}

const tagColor: Record<Pet["status"], string> = {
  AVAILABLE: "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30",
  ADOPTED: "bg-purple-400/10 text-purple-200 border border-purple-400/20",
  LOST: "bg-amber-400/20 text-amber-100 border border-amber-400/50",
  FOUND: "bg-sky-400/20 text-sky-100 border border-sky-400/40",
};

export default function PostsList({
  pets,
  loading,
  error,
  onRefresh,
}: PostsListProps) {
  const { token } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  // Removida a lógica 'layouts' para cards uniformes

  const handleAdopt = async (petId: number) => {
    if (!token) {
      setFeedback("Faça login para solicitar adoção");
      return;
    }
    try {
      await adoptionService.create({ petId }, token);
      setFeedback("Solicitação enviada com sucesso!");
    } catch (apiError) {
      const message =
        (apiError as { message?: string })?.message ??
        "Não foi possível enviar a solicitação.";
      setFeedback(message);
    } finally {
      await onRefresh();
    }
  };

  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="posts">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="animate-pulse h-80 bg-white/5 rounded-3xl border border-white/5" />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto mt-12 text-center text-red-400">
        {error}
      </section>
    );
  }

  return (
    <section
      className="w-full max-w-6xl mx-auto flex flex-col gap-6 mt-12 scroll-mt-24"
      id="posts"
    >
      {feedback && (
        <div className="rounded-full bg-white/10 border border-white/20 text-white px-4 py-2 text-center text-sm">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[320px] gap-6">
        {pets.map((pet, index) => {
          const isFallback = !pet.photoUrl || pet.photoUrl.trim().length === 0;
          return (
          <motion.article // <--- Revertido para motion.article
            key={pet.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br ${
              gradients[index % gradients.length]
            }`}
          >
            {/* === Área da Imagem (Link) === */}
            <div className={`relative h-44 overflow-hidden ${isFallback ? "flex items-center justify-center bg-white/5" : ""}`}>
              <Link href={`/pets/${pet.id}`} className="block h-full w-full"> {/* <--- Link apenas na imagem */}
                <img
                  src={
                    pet.photoUrl && pet.photoUrl.trim().length > 0
                      ? pet.photoUrl
                      : "/img/paw.png"
                  }
                  alt={pet.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/img/paw.png";
                  }}
                  className={`w-full h-full ${isFallback ? "object-contain p-6" : "object-cover transition duration-700 hover:scale-105"}`}
                />
              </Link>
              <span
                className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full uppercase tracking-wide ${tagColor[pet.status]}`}
              >
                {statusLabel(pet.status)}
              </span>
            </div>

            {/* === Área do Conteúdo/Texto === */}
            <div className="p-5 flex flex-col gap-3 text-white">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-semibold">
                  <Link href={`/pets/${pet.id}`} className="hover:underline"> {/* <--- Link no título */}
                    {pet.name}
                  </Link>
                </h3>
                {pet.owner && (
                  <span className="text-xs text-white/60">
                    por {pet.owner.name}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80 line-clamp-3">
                {pet.description ?? "Esse pet ainda não possui descrição."}
              </p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/60">
                <span>{pet.species}</span>
                {pet.breed && <span>• {pet.breed}</span>}
                {pet.age && <span>• {pet.age} anos</span>}
              </div>

              {pet.status === "AVAILABLE" && (
                // Estes botões estão FORA de qualquer Link, resolvendo o erro de hidratação.
                <div className="flex items-center gap-3 mt-auto">
                  <button
                    onClick={() => handleAdopt(pet.id)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-orange-500 text-black font-semibold hover:bg-orange-500-dark transition"
                  >
                    Quero adotar
                  </button>
                  <button
                    onClick={onRefresh}
                    className="px-4 py-3 rounded-2xl border border-white/20 text-sm hover:bg-white/10 transition"
                  >
                    Atualizar
                  </button>
                </div>
              )}
            </div>
          </motion.article>
          )
        })}
      </div>
    </section>
  );
}