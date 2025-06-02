"use client"

import Link from "next/link"
import { Button } from "@/components/ui/actions/button"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"

interface Noticia {
  title: string;
  url: string;
  description?: string;
  urlToImage?: string;
}

export default function Home() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function fetchNoticias() {
      try {
        // Busca notícias sobre nutrição, academia e fisioterapia, excluindo CV, STF, crime e política
        const res = await fetch(
          "https://newsapi.org/v2/everything?q=(nutrição OR academia OR fisioterapia OR musculação) -CV -STF -crime -senado -Câmara -Suprema -amputar -relator -código -civil -política&language=pt&sortBy=publishedAt&pageSize=10&apiKey=d30b319d4df74a6a936fa9c1e824051e"
        )
        const data = await res.json()
        console.log('Resposta da NewsAPI:', data)
        if (data.articles) {
          setNoticias(data.articles)
        } else {
          setErro("Não foi possível carregar as notícias.")
        }
      } catch (e) {
        setErro("Erro ao buscar notícias.")
      } finally {
        setLoading(false)
      }
    }
    fetchNoticias()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">Notícias sobre Nutrição, Academia e Fisioterapia</h2>
            {loading ? (
              <p>Carregando notícias...</p>
            ) : erro ? (
              <p className="text-red-500">{erro}</p>
            ) : noticias.length === 0 ? (
              <p>Nenhuma notícia encontrada.</p>
            ) : (
              <Swiper
                spaceBetween={24}
                slidesPerView={1.2}
                navigation
                style={{ paddingBottom: 40 }}
                breakpoints={{
                  640: { slidesPerView: 1.2 },
                  1024: { slidesPerView: 1.5 },
                }}
              >
                {noticias.map((noticia, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-900 flex flex-col items-center h-full">
                      <a href={noticia.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 dark:text-emerald-300 hover:underline text-lg text-center">
                        {noticia.title}
                      </a>
                      {noticia.description && <p className="text-sm text-muted-foreground mt-1 text-center">{noticia.description}</p>}
                      {noticia.urlToImage && <img src={noticia.urlToImage} alt="imagem da notícia" className="mt-2 max-h-40 rounded mx-auto" />}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
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
