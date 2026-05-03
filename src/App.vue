<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-vue-next'
import heroPortrait from './assets/hero-portrait.png'
import { useCartStore } from './stores/cart'

gsap.registerPlugin(ScrollTrigger)

const cart = useCartStore()
const page = ref(null)
const cartOpen = ref(false)
const openFaq = ref(0)
const bgColor = ref('#FFFFFF')

let lenis
let lenisTicker
let scrollUnsubscribe
let animationContext
let magneticCleanups = []

const works = [
  {
    id: 'lumen-veil',
    title: 'Lumen Veil',
    type: 'Limited Print',
    category: 'Editorial',
    price: 280,
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'plaza-series',
    title: 'Plaza Series',
    type: 'Canvas',
    category: 'Figurative',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'horizon-atlas',
    title: 'Horizon Atlas',
    type: 'Fine Art Photo',
    category: 'Motion',
    price: 340,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'neuro-sync',
    title: 'NeuroSync',
    type: 'Archival Print',
    category: 'Portrait',
    price: 360,
    image:
      'https://images.unsplash.com/photo-1494354145959-25cb82edf23d?auto=format&fit=crop&w=1200&q=85',
  },
]

const processSteps = [
  ['01', 'Concept', 'Research and briefing'],
  ['02', 'Research', 'Market analysis'],
  ['03', 'Ideation', 'Sketching'],
  ['04', 'Design', 'High-fidelity creation'],
  ['05', 'Launch', 'Delivery'],
]

const faqs = [
  {
    question: 'What is your typical project timeline?',
    answer:
      'Brand and visual systems usually take four to six weeks. Art commissions and print orders have a shorter production window based on format and framing.',
  },
  {
    question: 'Do you offer revisions?',
    answer:
      'Yes. Each design project includes two focused refinement rounds, and every art sale includes proof approval before production.',
  },
  {
    question: 'Can I buy work from the portfolio grid?',
    answer:
      'Yes. Art-labelled pieces can be added to the cart directly from the featured works grid.',
  },
  {
    question: 'Can you work with existing brand guidelines?',
    answer:
      'Absolutely. Existing rules become the foundation for a more expressive, polished visual direction.',
  },
]

function addToCart(work) {
  cart.addItem(work)
  cartOpen.value = true
}

function setupMagneticButtons() {
  const buttons = gsap.utils.toArray('.magnetic')

  magneticCleanups = buttons.map((button) => {
    const strength = Number(button.dataset.magneticStrength ?? 0.26)

    const moveButton = (event) => {
      const bounds = button.getBoundingClientRect()
      const x = event.clientX - bounds.left - bounds.width / 2
      const y = event.clientY - bounds.top - bounds.height / 2

      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 0.55,
        ease: 'power3.out',
      })
    }

    const resetButton = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.35)',
      })
    }

    button.addEventListener('mousemove', moveButton)
    button.addEventListener('mouseleave', resetButton)

    return () => {
      button.removeEventListener('mousemove', moveButton)
      button.removeEventListener('mouseleave', resetButton)
    }
  })
}

onMounted(async () => {
  await nextTick()

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return
  }

  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.25,
    anchors: {
      offset: -88,
      duration: 1.15,
    },
  })

  scrollUnsubscribe = lenis.on('scroll', () => ScrollTrigger.update())
  lenisTicker = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(lenisTicker)
  gsap.ticker.lagSmoothing(0)

  animationContext = gsap.context(() => {
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } })

    heroTimeline
      .fromTo(
        '.hero-image-wrap',
        {
          autoAlpha: 0,
          scale: 1.1,
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
        },
      )
      .fromTo(
        '.hero-title .hero-mask-content',
        {
          filter: 'blur(12px)',
          yPercent: 115,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          filter: 'blur(0px)',
          yPercent: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.95,
          stagger: 0.2,
        },
        0.15,
      )
      .fromTo(
        '.hero-copy > .hero-mask-line .hero-mask-content',
        {
          filter: 'blur(8px)',
          yPercent: 115,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          filter: 'blur(0px)',
          yPercent: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.75,
        },
        0.05,
      )
      .fromTo(
        '.hero-bio-inner',
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.85,
          ease: 'power3.out',
        },
        1,
      )

    gsap.to('.hero-image', {
      scale: 1.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.artist-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    gsap.to(['.hero-copy', '.hero-bio'], {
      y: 86,
      ease: 'none',
      scrollTrigger: {
        trigger: '.artist-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    gsap.utils.toArray('.mask-heading').forEach((heading) => {
      gsap.fromTo(
        heading,
        {
          y: 34,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.05,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 86%',
            once: true,
          },
        },
      )
    })

    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 34,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        },
      )
    })

    gsap.utils.toArray('.reveal-group').forEach((group) => {
      const children = group.querySelectorAll('.reveal-child')

      gsap.fromTo(
        children,
        {
          autoAlpha: 0,
          y: 42,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: group,
            start: 'top 82%',
            once: true,
          },
        },
      )
    })

    setupMagneticButtons()
  }, page.value)

  requestAnimationFrame(() => ScrollTrigger.refresh())
})

watch(cartOpen, (isOpen) => {
  if (!lenis) {
    return
  }

  if (isOpen) {
    lenis.stop()
  } else {
    lenis.start()
  }
})

onUnmounted(() => {
  magneticCleanups.forEach((cleanup) => cleanup())
  magneticCleanups = []
  animationContext?.revert()
  scrollUnsubscribe?.()

  if (lenisTicker) {
    gsap.ticker.remove(lenisTicker)
  }

  lenis?.destroy()
})

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
</script>

<template>
  <div ref="page" class="site-shell min-h-screen" :style="{ backgroundColor: bgColor, '--bg-color': bgColor }">
    <header class="fixed inset-x-0 top-0 z-40 w-full">
      <nav
        class="flex w-full items-center justify-between px-5 py-5 backdrop-blur-md sm:px-6 lg:px-12"
        :style="{ backgroundColor: bgColor + 'CC' }"
      >
        <a href="#" class="font-display text-2xl font-black tracking-tight">Michael Carter</a>
        <div class="hidden items-center gap-10 text-base font-medium md:flex">
          <a class="transition hover:text-slate" href="#work">Work</a>
          <a class="transition hover:text-slate" href="#process">About</a>
          <a class="transition hover:text-slate" href="#faq">Contact</a>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 rounded-full bg-slate/5 px-4 py-2 border border-slate/10">
            <span class="text-xs font-bold text-slate uppercase tracking-wider">Background</span>
            <input
              type="color"
              :value="bgColor"
              class="h-6 w-8 cursor-pointer rounded bg-transparent border-0"
              @input="bgColor = $event.target.value"
            />
          </div>
          <button
            class="relative grid h-10 w-10 place-items-center rounded-full bg-slate/10 transition hover:bg-primary/15"
            type="button"
            aria-label="Open cart"
            @click="cartOpen = true"
          >
            <ShoppingBag :size="17" />
            <span
              v-if="cart.count"
              class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
            >
              {{ cart.count }}
            </span>
          </button>
          <a class="pill magnetic bg-ink text-white shadow-sm hover:bg-accent" href="#work">Shop Art</a>
        </div>
      </nav>
    </header>

    <main>
      <section class="artist-hero relative flex h-screen min-h-[720px] w-full items-end overflow-hidden" :style="{ backgroundColor: bgColor }">
        <div
          class="hero-image-wrap pointer-events-none absolute bottom-0 left-1/2 z-0 h-[82vh] max-h-[880px] min-h-[40vh] w-[95vw] max-w-[780px] -translate-x-1/2 overflow-hidden sm:w-[70vw] lg:h-[88vh] lg:w-[48vw]"
        >
          <img
            class="hero-image h-full w-full object-contain object-bottom"
            alt="Female artist portrait"
            :src="heroPortrait"
          />
        </div>
        <div class="hero-section-blur pointer-events-none absolute inset-x-0 bottom-0 z-[1]"></div>

        <div class="page-shell z-10 w-full pb-12 lg:pb-32">
          <div class="flex flex-col items-end justify-between gap-12 lg:flex-row lg:items-end">
            <!-- Left: Headline and Status -->
            <div class="hero-copy w-full max-w-2xl">
              <div class="hero-mask-line mb-6">
                <div class="hero-mask-content inline-flex items-center gap-2 rounded-full border border-slate/10 bg-slate/5 px-3 py-1.5 text-xs font-medium text-slate sm:text-[13px]">
                  <span class="h-2 w-2 rounded-full bg-accent"></span>
                  2 projects left in March
                </div>
              </div>
              <h1 class="hero-title text-ink">
                <span class="hero-mask-line">
                  <span class="hero-mask-content">Carter is solving problems</span>
                </span>
                <span class="hero-mask-line">
                  <span class="hero-mask-content">through strategic design and</span>
                </span>
                <span class="hero-mask-line">
                  <span class="hero-mask-content">compelling visuals</span>
                </span>
              </h1>
            </div>

            <!-- Right: Bio and CTA -->
            <div class="hero-bio w-full max-w-sm lg:pb-16">
              <div class="hero-bio-inner space-y-8 text-left">
                <p class="text-[15px] leading-[1.6] text-ink/80">
                  As a digital product designer with a strong focus on visual design and Framer websites,
                  she collaborates closely with teams to craft seamless, user-centered experiences.
                  A reliable partner in bringing ideas to life.
                </p>
                <a class="pill magnetic rounded-2xl bg-black px-8 py-4 text-white shadow-xl hover:bg-slate" href="mailto:hello@carterstudio.example">
                  Email Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" class="section-pad">
        <div class="page-shell">
          <div class="mb-8 flex items-end justify-between gap-4">
            <div>
              <p class="reveal mb-3 text-sm font-bold uppercase tracking-wider text-accent">Featured works</p>
              <h2 class="mask-heading text-4xl font-bold sm:text-5xl">Portfolio pieces ready for your walls.</h2>
            </div>
            <a class="pill magnetic reveal bg-surface text-ink shadow-sm hover:bg-primary hover:text-white" href="#work">
              All Works
              <ArrowRight class="ml-2" :size="15" />
            </a>
          </div>

          <div class="reveal-group grid gap-4 md:grid-cols-2">
            <article
              v-for="work in works"
              :key="work.id"
              class="reveal-child group relative min-h-[360px] overflow-hidden rounded-studio bg-surface shadow-sm"
            >
              <img
                class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                :src="work.image"
                :alt="work.title"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
                <div
                  class="translate-y-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <h3 class="text-2xl font-bold text-white">{{ work.title }}</h3>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {{ work.type }}
                    </span>
                    <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {{ money.format(work.price) }}
                    </span>
                  </div>
                </div>
                <button
                  class="pill magnetic shrink-0 bg-white text-ink hover:bg-primary hover:text-white"
                  type="button"
                  @click="addToCart(work)"
                >
                  <Plus class="mr-2" :size="15" />
                  Add to Cart
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section-pad" :style="{ backgroundColor: bgColor }">
        <div class="page-shell reveal-group grid gap-5 md:grid-cols-3">
          <div class="reveal-child rounded-studio bg-white p-10 shadow-sm border border-slate/5">
            <Sparkles class="mb-10 text-accent" :size="32" />
            <h3 class="text-2xl font-bold">Award Nominee</h3>
            <p class="mt-4 text-base leading-7 text-ink/60">
              Recognized for expressive art direction and innovative digital experiences.
            </p>
          </div>
          <div class="reveal-child rounded-studio bg-ink p-7 text-white shadow-soft">
            <p class="text-6xl font-black text-white/15">99</p>
            <p class="mt-14 text-xl font-semibold leading-7">
              Carter's design expertise goes beyond aesthetics. She crafts experiences that
              truly connect with users.
            </p>
          </div>
          <div class="reveal-child rounded-studio bg-surface p-10 shadow-sm border border-slate/5">
            <div class="mt-28 rounded-full bg-canvas px-6 py-4 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-base font-bold">20+ projects completed</span>
                <span class="grid h-8 w-8 place-items-center rounded-full bg-accent text-white">
                  <Check :size="16" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" class="section-pad rounded-t-[32px] bg-ink text-white lg:rounded-t-[48px]">
        <div class="page-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <p class="reveal text-sm font-semibold text-white/45">How it works</p>
          <div>
            <h2 class="mask-heading max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              A simple and efficient workflow to bring your vision to life.
            </h2>
            <div class="reveal-group mt-12 grid gap-4">
              <article
                v-for="([number, title, text], index) in processSteps"
                :key="title"
                class="reveal-child rounded-studio border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur"
                :class="index % 2 ? 'md:ml-28' : 'md:mr-28'"
              >
                <span class="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm font-bold text-white/60">
                  {{ number }}
                </span>
                <h3 class="mt-6 text-xl font-bold">{{ title }}</h3>
                <p class="mt-2 text-sm leading-6 text-white/55">{{ text }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" class="section-pad" :style="{ backgroundColor: bgColor }">
        <div class="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="reveal mb-5 text-sm font-bold uppercase tracking-wider text-accent">FAQs</p>
            <h2 class="mask-heading max-w-lg text-4xl font-bold leading-tight">
              Answers to common questions to help you understand the process and how we can work together.
            </h2>
            <a class="pill magnetic reveal mt-8 bg-primary text-white hover:bg-accent" href="mailto:hello@carterstudio.example">
              Email Me
            </a>
          </div>
          <div class="reveal rounded-studio bg-surface p-3 shadow-sm">
            <button
              v-for="(faq, index) in faqs"
              :key="faq.question"
              class="w-full border-b border-ink/10 px-4 py-5 text-left last:border-b-0"
              type="button"
              @click="openFaq = openFaq === index ? -1 : index"
            >
              <span class="flex items-center justify-between gap-4 font-bold">
                {{ faq.question }}
                <ChevronDown
                  class="shrink-0 transition"
                  :class="{ 'rotate-180 text-primary': openFaq === index }"
                  :size="18"
                />
              </span>
              <span v-if="openFaq === index" class="mt-3 block text-sm leading-6 text-ink/60">
                {{ faq.answer }}
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>

    <footer class="section-pad rounded-t-[32px] bg-ink text-white lg:rounded-t-[48px]">
      <div class="page-shell text-center">
        <div
          class="reveal mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full bg-primary/20 text-accent shadow-[0_0_60px_rgba(99,102,241,0.3)]"
        >
          <Sparkles :size="42" />
        </div>
        <h2 class="mask-heading mx-auto max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
          Book a call and I'll take care of the rest.
        </h2>
        <a class="pill magnetic reveal mt-8 bg-primary text-white hover:bg-accent" href="mailto:hello@carterstudio.example">
          Book a Call
        </a>
        <div class="reveal mt-20 grid gap-8 border-t border-white/10 pt-8 text-left text-sm text-white/55 md:grid-cols-3">
          <p>Carter Studio 2026. All rights reserved.</p>
          <p>Navigation: Home, Work, About, Contact</p>
          <p>Connect: X/Twitter, Threads, Instagram, YouTube</p>
        </div>
      </div>
    </footer>

    <div
      v-if="cartOpen"
      class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      @click.self="cartOpen = false"
    >
      <aside data-lenis-prevent class="ml-auto flex h-full w-full max-w-md flex-col bg-surface p-6 shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-gold">Studio Cart</p>
            <h2 class="text-2xl font-bold">Selected art</h2>
          </div>
          <button
            class="grid h-10 w-10 place-items-center rounded-full bg-canvas hover:bg-primary/15"
            type="button"
            aria-label="Close cart"
            @click="cartOpen = false"
          >
            <X :size="18" />
          </button>
        </div>

        <div v-if="cart.items.length" class="mt-8 flex-1 space-y-4 overflow-y-auto">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="flex gap-4 rounded-studio border border-ink/10 p-3"
          >
            <img class="h-24 w-24 rounded-[18px] object-cover" :src="item.image" :alt="item.title" />
            <div class="min-w-0 flex-1">
              <h3 class="font-bold">{{ item.title }}</h3>
              <p class="mt-1 text-sm text-ink/60">
                {{ item.quantity }} x {{ money.format(item.price) }}
              </p>
              <button
                class="mt-4 inline-flex items-center gap-1 text-sm font-bold text-ink/55 hover:text-primary"
                type="button"
                @click="cart.removeItem(item.id)"
              >
                <Minus :size="14" />
                Remove
              </button>
            </div>
          </article>
        </div>
        <div v-else class="grid flex-1 place-items-center text-center text-ink/55">
          <p>Your cart is ready for a favorite piece.</p>
        </div>

        <div class="border-t border-ink/10 pt-5">
          <div class="mb-5 flex items-center justify-between text-lg font-bold">
            <span>Subtotal</span>
            <span>{{ money.format(cart.subtotal) }}</span>
          </div>
          <button
            class="pill magnetic w-full bg-primary text-white hover:bg-accent disabled:cursor-not-allowed disabled:bg-ink/20 shadow-lg"
            type="button"
            :disabled="!cart.items.length"
          >
            Checkout Inquiry
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>
