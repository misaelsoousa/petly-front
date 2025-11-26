"use client";

import React, { useMemo, useState } from "react";
import { Logo } from "../../../public/icons";
import Link from "next/link";
import { petService } from "@/services/petService";
import type { PetStatus } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

type FriendlyStatus = "perdido" | "adocao" | "encontrado";

const statusMap: Record<FriendlyStatus, PetStatus> = {
  perdido: "LOST",
  adocao: "AVAILABLE",
  encontrado: "FOUND",
};

interface PetForm {
  name: string;
  species: string;
  breed: string;
  age: string;
  sex: string;
  description: string;
  statusFriendly: FriendlyStatus;
  photo: File | null;
}

const initialForm: PetForm = {
  name: "",
  species: "",
  breed: "",
  age: "",
  sex: "",
  description: "",
  statusFriendly: "perdido",
  photo: null,
};

export default function CadastrarPetPage() {
  const [formData, setFormData] = useState<PetForm>(initialForm);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const canSubmit = useMemo(() => {
    return Boolean(
      formData.name &&
        formData.species &&
        formData.description &&
        token &&
        !loading,
    );
  }, [formData, token, loading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensiona se necessário
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Não foi possível criar contexto do canvas'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Valida tamanho do arquivo (máximo 5MB antes de compressão)
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "A imagem é muito grande. Por favor, escolha uma imagem menor que 5MB.",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, photo: file }));
    
    try {
      // Comprime a imagem antes de mostrar o preview
      const compressed = await compressImage(file);
      setPreviewImage(compressed);
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Erro ao processar a imagem. Tente novamente.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setFeedback({
        type: "error",
        message: "Faça login para cadastrar um pet.",
      });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      await petService.create(
        {
          name: formData.name,
          species: formData.species,
          breed: formData.breed,
          age: formData.age ? Number(formData.age) : undefined,
          description: formData.description,
          status: statusMap[formData.statusFriendly],
          sex: formData.sex,
          photoUrl: previewImage ?? undefined,
        },
        token,
      );
      setFeedback({
        type: "success",
        message: "Pet enviado com sucesso!",
      });
      setFormData(initialForm);
      setPreviewImage(null);
      router.push("/");
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          (error as { message?: string })?.message ??
          "Não foi possível cadastrar o pet.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4 text-white">
          <Logo className="h-16 mx-auto" />
          <h1 className="text-4xl font-bold">Cadastrar novo pet</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Este formulário envia os dados para cadastrar o pet. Preencha o formulário
            abaixo para disponibilizar o pet para adoção, resgate ou para indicar que foi encontrado.
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl shadow-black/40">
          {feedback && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30"
                  : "bg-red-500/10 text-red-200 border border-red-500/30"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-white font-semibold text-lg">Status do anúncio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(["perdido", "adocao", "encontrado"] as FriendlyStatus[]).map(
                  (status) => (
                    <label
                      key={status}
                      className={`border rounded-2xl p-4 cursor-pointer transition ${
                        formData.statusFriendly === status
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 text-white/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="statusFriendly"
                        value={status}
                        checked={formData.statusFriendly === status}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <p className="font-semibold">
                        {status === "perdido"
                          ? "Pet perdido"
                          : status === "adocao"
                          ? "Para adoção"
                          : "Pet encontrado"}
                      </p>
                      <p className="text-xs mt-1">
                        {status === "perdido"
                          ? "Será salvo como Perdido"
                          : status === "adocao"
                          ? "Será salvo como Disponível"
                          : "Será salvo como Encontrado"}
                      </p>
                    </label>
                  ),
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div>
                <label className="block text-sm mb-2">Nome do pet *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Luna"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Espécie *</label>
                <input
                  type="text"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Cachorro, gato..."
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Raça</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Idade (anos)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Sexo</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione</option>
                  <option value="FEMALE">Fêmea</option>
                  <option value="MALE">Macho</option>
                </select>
              </div>
            </section>

            <section className="space-y-3 text-white">
              <label className="block text-sm">Descrição *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Conte detalhes sobre o comportamento, cuidados e situação atual."
              />
            </section>

            <section className="space-y-4 text-white">
              <label className="block text-sm">Foto destacada</label>
              <label className="flex flex-col items-center justify-center h-64 border border-dashed border-white/20 rounded-3xl cursor-pointer bg-white/5 hover:bg-white/10 transition">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  <span className="text-white/60 text-sm">
                    Clique para subir uma imagem (opcional)
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/"
                className="flex-1 text-center px-6 py-3 rounded-2xl border border-white/15 text-white hover:bg-white/5 transition"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 px-6 py-3 rounded-2xl bg-primary text-black font-semibold hover:bg-primary-dark transition disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Publicar anúncio"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm">
          © {new Date().getFullYear()} Petly. Integração com o servidor.
        </p>
      </div>
    </div>
  );
}
