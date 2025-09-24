"use client"
import React, { useState } from "react";
import { Logo } from "../../../public/icons";
import Link from "next/link";

export default function CadastrarPetPage() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    raca: '',
    idade: '',
    sexo: '',
    tamanho: '',
    cor: '',
    localizacao: '',
    descricao: '',
    status: 'perdido',
    contato: '',
    imagem: null as File | null
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        imagem: file
      });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pet form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#212121] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Logo className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Cadastrar Pet</h1>
          <p className="text-gray-400">Ajude a encontrar um lar ou encontre seu pet perdido</p>
        </div>

        <div className="bg-dark-gray rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tipo de anúncio
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="perdido"
                    checked={formData.status === 'perdido'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-white">Pet Perdido</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="adocao"
                    checked={formData.status === 'adocao'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-white">Para Adoção</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="encontrado"
                    checked={formData.status === 'encontrado'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-white">Pet Encontrado</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do pet *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Luna, Thor, Mimi"
                  required
                />
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de animal *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="cachorro">Cachorro</option>
                  <option value="gato">Gato</option>
                  <option value="passaro">Pássaro</option>
                  <option value="coelho">Coelho</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="raca" className="block text-sm font-medium text-gray-300 mb-2">
                  Raça
                </label>
                <input
                  type="text"
                  id="raca"
                  name="raca"
                  value={formData.raca}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Golden Retriever, SRD, Persa"
                />
              </div>

              <div>
                <label htmlFor="idade" className="block text-sm font-medium text-gray-300 mb-2">
                  Idade
                </label>
                <input
                  type="text"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 2 anos, 6 meses, filhote"
                />
              </div>

              <div>
                <label htmlFor="sexo" className="block text-sm font-medium text-gray-300 mb-2">
                  Sexo
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>

              <div>
                <label htmlFor="tamanho" className="block text-sm font-medium text-gray-300 mb-2">
                  Tamanho
                </label>
                <select
                  id="tamanho"
                  name="tamanho"
                  value={formData.tamanho}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div>
                <label htmlFor="cor" className="block text-sm font-medium text-gray-300 mb-2">
                  Cor
                </label>
                <input
                  type="text"
                  id="cor"
                  name="cor"
                  value={formData.cor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Branco, Marrom, Preto e branco"
                />
              </div>

              <div>
                <label htmlFor="contato" className="block text-sm font-medium text-gray-300 mb-2">
                  Contato *
                </label>
                <input
                  type="text"
                  id="contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="WhatsApp, telefone ou email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="localizacao" className="block text-sm font-medium text-gray-300 mb-2">
                Localização *
              </label>
              <input
                type="text"
                id="localizacao"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Centro, Santos - SP"
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-2">
                Descrição *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Conte mais sobre o pet: personalidade, cuidados especiais, última vez visto, etc."
                required
              />
            </div>

            <div>
              <label htmlFor="imagem" className="block text-sm font-medium text-gray-300 mb-2">
                Foto do pet
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="imagem" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.5 6.5c0 1.43.425 2.74 1.15 3.85A5.56 5.56 0 0 0 4 13H1m12-8v8m-4-8V5a2 2 0 1 1 4 0v8m-4-8H8m4 0V5a2 2 0 1 1 4 0v8m-4-8H8"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Clique para upload</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG ou GIF (MAX. 10MB)</p>
                    </div>
                  )}
                  <input
                    id="imagem"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
                           <Link
                href={'/'}
                className="flex-1 justify-center text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Publicar Anúncio
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Petly. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

