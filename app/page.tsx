"use client"

import Link from "next/link"
import { Button } from "@/components/ui/actions/button"
import { Input } from "@/components/ui/form/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { Badge } from "@/components/ui/feedback/badge"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Search, TrendingUp, Clock, Users, Filter, ChevronRight, Newspaper, Dumbbell, Heart, Target } from "lucide-react"
import DashboardHeader from "@/components/layout/DashboardHeader"
import "swiper/css"
import "swiper/css/navigation"

interface Noticia {
  title: string;
  url: string;
  description?: string;
  urlToImage?: string;
}

export default function Home() {
  const { data: session } = useSession()
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    // Dados mockados de notícias
    const noticiasMockadas: Noticia[] = [
      {
        title: "Novos Estudos Mostram Benefícios do Treino de Força para Longevidade",
        description: "Pesquisa recente revela que exercícios de resistência podem aumentar a expectativa de vida em até 10 anos.",
        url: "#",
        urlToImage: "/placeholder.jpg"
      },
      {
        title: "Alimentação Pré-Treino: O Que Consumir Para Máximo Desempenho",
        description: "Nutricionistas revelam os melhores alimentos para potencializar seus treinos e acelerar a recuperação muscular.",
        url: "#",
        urlToImage: "/placeholder.jpg"
      },
      {
        title: "Fisioterapia Preventiva: Como Evitar Lesões no Exercício",
        description: "Especialistas em fisioterapia compartilham dicas essenciais para manter-se livre de lesões durante atividades físicas.",
        url: "#",
        urlToImage: "/placeholder.jpg"
      },
      {
        title: "Tecnologia Fitness: Apps Que Estão Revolucionando os Treinos",
        description: "Conheça as mais novas tecnologias que estão transformando a forma como nos exercitamos em casa e na academia.",
        url: "#",
        urlToImage: "/placeholder.jpg"
      },
      {
        title: "Hidratação Durante o Exercício: Mitos e Verdades",
        description: "Descubra a quantidade ideal de água para consumir antes, durante e após os treinos para otimizar sua performance.",
        url: "#",
        urlToImage: "/placeholder.jpg"
      },
      {
        title: "Treino HIIT vs. Cardio Tradicional: Qual É Mais Eficaz?",
        description: "Estudo comparativo analisa os benefícios de diferentes modalidades de exercício cardiovascular.",
        url: "#",
        urlToImage: "/placeholder.jpg"
      }
    ]

    // Simular delay de carregamento
    setTimeout(() => {
      setNoticias(noticiasMockadas)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {session ? (
        // Header para usuários logados
        <DashboardHeader />
      ) : (
        // Header para visitantes
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold text-xl">FitJourney</span>
              </Link>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/50 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Transforme sua saúde com a FitJourney
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Programas personalizados de reabilitação, condicionamento físico e nutrição para ajudar você a
                    alcançar seus objetivos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      Comece Agora
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Saiba Mais
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-[450px] rounded-full bg-gradient-to-b from-emerald-200 to-emerald-50 dark:from-emerald-900 dark:to-emerald-950/50 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="Fitness Training"
                    className="rounded-full object-cover"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Escolha o programa ideal para você
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Oferecemos três programas especializados para atender às suas necessidades específicas.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-between items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="p-2 bg-emerald-100 rounded-full dark:bg-emerald-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-emerald-600"
                  >
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M5 8v-3a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2h-5"></path>
                    <circle cx="6" cy="14" r="3"></circle>
                    <path d="M4.5 17 9 15"></path>
                  </svg>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Reabilitação</h3>
                  <p className="text-muted-foreground">
                    Exercícios personalizados para aliviar dores musculares e articulares com metas diárias.
                  </p>
                </div>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Começar</Button>
                </Link>
              </div>
              <div className="flex flex-col justify-between items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="p-2 bg-emerald-100 rounded-full dark:bg-emerald-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-emerald-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Saindo do Sedentarismo</h3>
                  <p className="text-muted-foreground">
                    Programa gradual para quem está começando, com acompanhamento semanal do IMC.
                  </p>
                </div>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Começar</Button>
                </Link>
              </div>
              <div className="flex flex-col justify-between items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="p-2 bg-emerald-100 rounded-full dark:bg-emerald-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-emerald-600"
                  >
                    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                    <path d="M2 20h20"></path>
                    <path d="M14 12v.01"></path>
                  </svg>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Treino + Dieta</h3>
                  <p className="text-muted-foreground">
                    Programa completo com treinos personalizados e opções de dieta para potencializar resultados.
                  </p>
                </div>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Começar</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Pesquisa de Exercícios */}
        <section id="exercises" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Explore Exercícios
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Descubra exercícios personalizados para cada grupo muscular e nível de experiência.
                </p>
              </div>
            </div>

            {/* Barra de Pesquisa */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquise por exercícios, grupos musculares ou equipamentos..."
                  className="pl-10 h-12 text-base"
                />
                <Button size="sm" className="absolute right-2 top-2">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Categorias Populares */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Categorias Populares</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Peito", count: 45, icon: "💪" },
                  { name: "Costas", count: 38, icon: "🔙" },
                  { name: "Pernas", count: 52, icon: "🦵" },
                  { name: "Ombros", count: 31, icon: "⚡" },
                  { name: "Bíceps", count: 24, icon: "💪" },
                  { name: "Tríceps", count: 27, icon: "🔥" },
                  { name: "Core", count: 33, icon: "⭐" },
                  { name: "Cardio", count: 41, icon: "❤️" }
                ].map((category) => (
                  <Badge
                    key={category.name}
                    variant="secondary"
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name} ({category.count})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grid de Exercícios em Destaque */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Supino Reto",
                  category: "Peito",
                  difficulty: "Intermediário",
                  duration: "3-4 séries",
                  equipment: "Barra e banco",
                  description: "Exercício clássico para desenvolvimento do peitoral maior",
                  image: "/placeholder.svg?height=200&width=300",
                  trending: true
                },
                {
                  name: "Agachamento Livre",
                  category: "Pernas",
                  difficulty: "Iniciante",
                  duration: "3-5 séries",
                  equipment: "Peso corporal",
                  description: "Movimento fundamental para fortalecimento das pernas",
                  image: "/placeholder.svg?height=200&width=300",
                  trending: true
                },
                {
                  name: "Puxada Alta",
                  category: "Costas",
                  difficulty: "Intermediário",
                  duration: "3-4 séries",
                  equipment: "Máquina de puxada",
                  description: "Excelente para desenvolver a largura das costas",
                  image: "/placeholder.svg?height=200&width=300",
                  trending: false
                },
                {
                  name: "Burpee",
                  category: "Cardio",
                  difficulty: "Avançado",
                  duration: "3-5 séries",
                  equipment: "Peso corporal",
                  description: "Exercício completo que trabalha corpo todo",
                  image: "/placeholder.svg?height=200&width=300",
                  trending: true
                },
                {
                  name: "Desenvolvimento",
                  category: "Ombros",
                  difficulty: "Intermediário",
                  duration: "3-4 séries",
                  equipment: "Halteres",
                  description: "Movimento básico para desenvolvimento dos deltoides",
                  image: "/placeholder.svg?height=200&width=300",
                  trending: false
                },
                {
                  name: "Prancha",
                  category: "Core",
                  difficulty: "Iniciante",
                  duration: "3-5 séries",
                  equipment: "Peso corporal",
                  description: "Fortalecimento isométrico do core",
                  image: "/placeholder.svg?height=200&width=300",
                  trending: false
                }
              ].map((exercise, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-full h-48 object-cover"
                    />
                    {exercise.trending && (
                      <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      <Badge variant="outline">{exercise.category}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {exercise.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {exercise.difficulty}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exercise.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {exercise.equipment}
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Ver Detalhes
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Search className="h-4 w-4 mr-2" />
                Explorar Todos os Exercícios
              </Button>
            </div>
          </div>
        </section>

        {/* Seção de Notícias Melhorada */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="h-8 w-8 text-emerald-600" />
              <h2 className="text-3xl font-bold tracking-tighter">Últimas Notícias</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    <Heart className="h-3 w-3 mr-1" />
                    Saúde
                  </Badge>
                  <CardTitle>Filtrar por categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: "Nutrição", count: 23, active: true },
                      { name: "Exercícios", count: 31, active: false },
                      { name: "Fisioterapia", count: 15, active: false },
                      { name: "Wellness", count: 18, active: false },
                      { name: "Suplementação", count: 12, active: false }
                    ].map((category) => (
                      <div key={category.name} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <span className={category.active ? "font-medium text-emerald-600" : "text-muted-foreground"}>
                          {category.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando notícias...</p>
                  </div>
                ) : erro ? (
                  <Card className="border-red-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-red-600 mb-4">{erro}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                          Tentar Novamente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : noticias.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">Nenhuma notícia encontrada no momento.</p>
                    </CardContent>
                  </Card>
                ) : (
                  noticias.slice(0, 4).map((noticia, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {noticia.urlToImage && (
                            <img
                              src={noticia.urlToImage}
                              alt="Notícia"
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <a
                              href={noticia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline line-clamp-2 leading-tight"
                            >
                              {noticia.title}
                            </a>
                            {noticia.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {noticia.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Agora
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                Saúde
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Carousel completo das notícias */}
            {!loading && !erro && noticias.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Todas as Notícias</h3>
                <Swiper
                  spaceBetween={24}
                  slidesPerView={1.2}
                  navigation
                  style={{ paddingBottom: 40 }}
                  breakpoints={{
                    640: { slidesPerView: 1.5 },
                    768: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.2 },
                  }}
                >
                  {noticias.map((noticia, idx) => (
                    <SwiperSlide key={idx}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        {noticia.urlToImage && (
                          <img
                            src={noticia.urlToImage}
                            alt="Notícia"
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base line-clamp-2">
                            <a
                              href={noticia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 hover:underline"
                            >
                              {noticia.title}
                            </a>
                          </CardTitle>
                        </CardHeader>
                        {noticia.description && (
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {noticia.description}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FitJourney. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
