import React from "react";

const posts = [
  {
    id: 1,
    titulo: "Gente, encontrei um cachorro em Centro, Santos. Preciso de lar pra ele!",
    nome: "Luna",
    tipo: "Cachorro",
    status: "Perdido",
    local: "Centro, Santos",
    imagem: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    descricao: "Visto pela última vez perto da praça central. Muito dócil, parece estar perdido há pouco tempo.",
    comentarios: [
      { autor: "Maria", texto: "Vou compartilhar! Espero que encontre um lar." },
      { autor: "João", texto: "Se ninguém aparecer, posso ajudar com ração." },
    ],
  },
  {
    id: 2,
    titulo: "Linda gatinha para adoção em Vila Nova, RJ!",
    nome: "Mimi",
    tipo: "Gato",
    status: "Para adoção",
    local: "Vila Nova, RJ",
    imagem: "https://images.unsplash.com/photo-1518715308788-3005759c41c5?auto=format&fit=facearea&w=400&h=400&q=80",
    descricao: "Gatinha dócil, procura um novo lar. Já está vacinada e vermifugada.",
    comentarios: [
      { autor: "Ana", texto: "Que linda! Já compartilhei." },
    ],
  },
  {
    id: 3,
    titulo: "Cachorro brincalhão para adoção em Bairro Alto, PR!",
    nome: "Thor",
    tipo: "Cachorro",
    status: "Para adoção",
    local: "Bairro Alto, PR",
    imagem: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=facearea&w=400&h=400&q=80",
    descricao: "Muito brincalhão e carinhoso. Precisa de um lar com espaço para correr!",
    comentarios: [],
  },
];

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-2 inline-block"
      style={{ background: color, color: '#fff' }}
    >
      {children}
    </span>
  );
}

export default function PostsList() {
  return (
    <section className="w-full max-w-screen-xl mx-auto flex flex-col gap-8 mt-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-lg shadow-md overflow-hidden bg-white dark:bg-secondary  flex flex-col"
        >
          <img
            src={post.imagem}
            alt={post.nome}
            className="w-full h-64 object-cover"
          />
          <div className="p-5 flex flex-col gap-2">
            <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--primary)' }}>{post.titulo}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <Tag color="#ff7a29">{post.status}</Tag>
              <Tag color="#6b6b6b">{post.tipo}</Tag>
              <Tag color="#bdbdbd">{post.local}</Tag>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-3">{post.descricao}</p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 mt-2">
              <span className="block text-xs text-gray-500 mb-1 font-semibold">Comentários</span>
              {post.comentarios.length === 0 ? (
                <span className="text-xs text-gray-400">Nenhum comentário ainda.</span>
              ) : (
                <ul className="space-y-1">
                  {post.comentarios.map((c, idx) => (
                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold" style={{ color: 'var(--primary)' }}>{c.autor}:</span> {c.texto}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
