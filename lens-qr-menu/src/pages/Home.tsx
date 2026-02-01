"use client"

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Coffee, Wine, Clock, MapPin, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { CustomerGuard } from "../components/customer-guard"

export default function HomePage() {
  const featuredProducts = [
    {
      name: "Cappuccino",
      image: "/cappuccino-with-foam-art.jpg",
      category: "Kafe",
      price: "3.50 KM",
    },
    {
      name: "Cijeđeni sok od narandže",
      image: "/fresh-orange-juice-glass.jpg",
      category: "Sokovi",
      price: "4.50 KM",
    },
    {
      name: "Nargila - Mix voća",
      image: "/hookah-icon.png",
      category: "Nargile",
      price: "20.00 KM",
    },
  ]

  return (
    <CustomerGuard>
      <div className="min-h-screen bg-background">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-[url('/modern-coffee-shop-interior-warm-lighting.jpg')] bg-cover bg-center opacity-10" />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="inline-block relative">
                <img src="/logo.png" alt="Caffe Lens Logo" className="h-28 md:h-40 w-auto mx-auto" />
                <Coffee className="absolute -top-2 -right-2 h-10 w-10 text-primary animate-pulse" />
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance">
                Dobrodošli u digitalno iskustvo naručivanja
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Otkrijte naš jedinstveni meni i naručite omiljene napitke direktno sa vašeg stola
              </p>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-sm md:text-base">Kačuni, Bosna i Hercegovina</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button asChild size="lg" className="text-lg h-14 px-8 group">
                  <Link to="/menu">
                    <Coffee className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Pogledaj Meni
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 bg-transparent">
                  <a href="#about">Saznaj Više</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">Izdvojeno iz menija</h2>
              <p className="text-lg text-muted-foreground">Naši najpopularniji napici</p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth px-4 md:px-0">
                {featuredProducts.map((product, index) => (
                  <Link
                    key={index}
                    to={`/menu?category=${product.category}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex-shrink-0 w-[280px] md:w-[320px] snap-center"
                  >
                    <div className="aspect-square relative overflow-hidden bg-secondary/50">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="text-sm text-primary font-medium">{product.category}</div>
                      <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary">{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => {
                    const container = document.querySelector(".overflow-x-auto")
                    if (container) container.scrollBy({ left: -340, behavior: "smooth" })
                  }}
                  className="bg-card border border-border hover:border-primary/50 rounded-full p-2 hover:shadow-lg transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <button
                  onClick={() => {
                    const container = document.querySelector(".overflow-x-auto")
                    if (container) container.scrollBy({ left: 340, behavior: "smooth" })
                  }}
                  className="bg-card border border-border hover:border-primary/50 rounded-full p-2 hover:shadow-lg transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES GRID SECTION */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">Istražite naš meni</h2>
              <p className="text-lg text-muted-foreground">Izaberite kategoriju i započnite naručivanje</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Link
                to="/menu?category=Kafe"
                className="bg-card border border-primary/20 rounded-2xl p-8 text-center space-y-4 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Coffee className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Kafe</h3>
                <p className="text-muted-foreground">Espresso, Cappuccino, Latte i više</p>
              </Link>

              <Link
                to="/menu?category=Sokovi"
                className="bg-card border border-primary/20 rounded-2xl p-8 text-center space-y-4 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wine className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Sokovi</h3>
                <p className="text-muted-foreground">Cijeđeni, gazirani i smoothie</p>
              </Link>

              <Link
                to="/menu?category=Nargile"
                className="bg-card border border-primary/20 rounded-2xl p-8 text-center space-y-4 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img
                    src="/hookah-icon.png"
                    alt="Nargila"
                    className="h-10 w-10 group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Nargile</h3>
                <p className="text-muted-foreground">Razni okusi i premium opcije</p>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">O nama</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Caffe Lens je moderno mjesto gdje se spaja tradicija i tehnologija. Nudimo vrhunsku kafu, sokove i
                  nargile u ugodnom ambijentu.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Naš digitalni sistem naručivanja omogućava vam da brzo i jednostavno naručite svoje omiljene napitke
                  direktno sa vašeg stola.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>06:00 - 22:00</span>
                  </div>
                </div>
                <Button asChild size="lg" className="mt-6">
                  <Link to="/about">
                    Pročitaj više
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img
                  src="/cozy-coffee-shop-interior-modern-design.jpg"
                  alt="Caffe Lens Interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">Šta kažu naši gosti</h2>
              <p className="text-lg text-muted-foreground">Iskustva koja nas motivišu</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Amir K.",
                  text: "Odličan ambijent i sistem naručivanja. Kafa je uvijek sveža i brza dostava!",
                  rating: 5,
                },
                {
                  name: "Lejla M.",
                  text: "Najdraže mjesto za opuštanje. Smoothies su fenomenalni!",
                  rating: 5,
                },
                {
                  name: "Edin S.",
                  text: "Digitalno naručivanje je revolucija. Više ne čekam konobara!",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{testimonial.text}</p>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">Spremni za naručivanje?</h2>
              <p className="text-lg text-muted-foreground">
                Istražite naš kompletni meni i naručite vaše omiljene napitke već danas
              </p>
              <Button asChild size="lg" className="text-lg h-14 px-8">
                <Link to="/menu">
                  <Coffee className="mr-2 h-5 w-5" />
                  Počni naručivati
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </CustomerGuard>
  )
}
