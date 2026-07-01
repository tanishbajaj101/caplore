import {
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

type VisualType = 'filing' | 'summary' | 'book' | 'sentiment' | 'listing' | 'lockin'

type Stage = {
  id: string
  number: string
  title: string
  label: string
  description: string
  visualType: VisualType
  metric: string
  metricLabel: string
  output: string
}

const stages: Stage[] = [
  {
    id: 'drhp-filed',
    number: '01',
    title: 'DRHP Filed',
    label: 'SEBI Tracking',
    description:
      'Detect new DRHP filings and track SEBI progress from the first public document.',
    visualType: 'filing',
    metric: '14:32:08',
    metricLabel: 'DETECTED',
    output: 'DOCUMENT INGESTED',
  },
  {
    id: 'ai-summary',
    number: '02',
    title: 'AI Summary',
    label: 'Strengths & Risks',
    description:
      'Convert long prospectus documents into clear strengths, risks, and business highlights.',
    visualType: 'summary',
    metric: '186',
    metricLabel: 'PAGES PARSED',
    output: 'INSIGHTS STRUCTURED',
  },
  {
    id: 'anchor-book',
    number: '03',
    title: 'Anchor Book',
    label: 'Subscription Data',
    description:
      'Track anchor allocation, institutional interest, and subscription momentum.',
    visualType: 'book',
    metric: '8.4×',
    metricLabel: 'QIB DEMAND',
    output: 'DEMAND VERIFIED',
  },
  {
    id: 'grey-market',
    number: '04',
    title: 'Grey Market',
    label: 'Sentiment Tracking',
    description:
      'Monitor grey market movement, sentiment shifts, and early demand signals.',
    visualType: 'sentiment',
    metric: '+12.4%',
    metricLabel: 'GMP SIGNAL',
    output: 'SENTIMENT SCORED',
  },
  {
    id: 'listing-day',
    number: '05',
    title: 'Listing Day',
    label: 'Performance Analysis',
    description:
      'Analyze listing premium, price action, and first-day performance.',
    visualType: 'listing',
    metric: '+16.7%',
    metricLabel: 'LISTING GAIN',
    output: 'PRICE DISCOVERED',
  },
]

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
}

const stageVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      delay: 1.15 + index * 0.4,
      ease: EASE,
    },
  }),
}

type VisualProps = {
  live: boolean
  reducedMotion: boolean
}

function FilingVisual({ live, reducedMotion }: VisualProps) {
  return (
    <div className="relative flex h-24 items-center justify-center gap-4 overflow-hidden">
      <div className="relative h-12 w-9 shrink-0 border border-blue-200 bg-white">
        <div className="absolute right-0 top-0 h-2.5 w-2.5 border-b border-l border-blue-200 bg-blue-50" />
        <span className="absolute left-2 top-2 font-mono text-[6px] font-semibold tracking-wider text-blue-500">
          DRHP
        </span>
        <div className="absolute inset-x-2 bottom-2.5 space-y-1">
          <div className="h-px bg-blue-300" />
          <div className="h-px w-4/5 bg-blue-200" />
          <div className="h-px w-3/5 bg-blue-200" />
        </div>
        <motion.div
          className="absolute inset-x-0 h-px bg-blue-500/80 shadow-[0_0_5px_rgba(30,94,255,0.3)]"
          animate={
            live && !reducedMotion
              ? { top: ['18%', '82%', '18%'], opacity: [0, 1, 0] }
              : { top: '50%', opacity: 0 }
          }
          transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="w-28 min-w-0 space-y-2">
        <DataRow label="Issuer" value="NSE / BSE" />
        <DataRow label="Status" value="FILED" positive />
        <DataRow label="Source" value="SEBI" />
      </div>
    </div>
  )
}

function SummaryVisual({ live }: VisualProps) {
  return (
    <div className="flex h-24 flex-col justify-center gap-2.5">
      {[86, 72, 55].map((width, index) => (
        <div key={width} className="flex items-center gap-2">
          <span className="w-5 font-mono text-[7px] text-blue-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="h-1 flex-1 overflow-hidden bg-blue-100">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: live ? `${width}%` : 0 }}
              transition={{ duration: 0.55, delay: 1.8 + index * 0.1, ease: EASE }}
            />
          </div>
        </div>
      ))}
      <div className="mt-0.5 flex gap-1.5 pl-7">
        <span className="border border-emerald-400/20 bg-emerald-400/[0.05] px-1.5 py-0.5 font-mono text-[7px] text-emerald-300">
          STRENGTHS 06
        </span>
        <span className="border border-amber-400/20 bg-amber-400/[0.05] px-1.5 py-0.5 font-mono text-[7px] text-amber-300">
          RISKS 04
        </span>
      </div>
    </div>
  )
}

function BookVisual({ live }: VisualProps) {
  const values = [48, 71, 58, 88, 76, 96]

  return (
    <div className="flex h-24 items-end gap-3 py-3">
      <div className="flex h-full flex-1 items-end gap-1.5 border-b border-blue-200">
        {values.map((height, index) => (
          <motion.div
            key={height}
            className="flex-1 bg-gradient-to-t from-blue-200 to-blue-500"
            initial={{ height: 1 }}
            animate={{ height: live ? `${height}%` : 1 }}
            transition={{ duration: 0.45, delay: 2.2 + index * 0.07, ease: EASE }}
          />
        ))}
      </div>
      <div className="w-12 space-y-1.5 pb-0.5 font-mono text-[7px] text-slate-500">
        <div className="flex justify-between">
          <span>QIB</span>
          <span className="text-blue-600">8.4×</span>
        </div>
        <div className="flex justify-between">
          <span>NII</span>
          <span>4.1×</span>
        </div>
        <div className="flex justify-between">
          <span>RII</span>
          <span>2.8×</span>
        </div>
      </div>
    </div>
  )
}

function SentimentVisual({ live, reducedMotion }: VisualProps) {
  const bars = [8, 15, 10, 22, 16, 29, 21, 34, 27, 40, 35, 46]

  return (
    <div className="relative flex h-24 items-end gap-[3px] overflow-hidden pb-3 pt-5">
      <div className="absolute inset-x-0 top-2.5 flex justify-between font-mono text-[7px] text-slate-500">
        <span>−1H</span>
        <span className="text-emerald-300">BIAS: POSITIVE</span>
        <span>NOW</span>
      </div>
      {bars.map((height, index) => (
        <motion.div
          key={`${height}-${index}`}
          className="min-w-0 flex-1 bg-blue-500/60"
          animate={
            live && !reducedMotion
              ? {
                  height: [`${height}%`, `${Math.min(100, height + (index % 3) * 10)}%`, `${height}%`],
                  opacity: [0.45, 0.85, 0.45],
                }
              : { height: `${height}%`, opacity: 0.55 }
          }
          transition={{
            duration: 2.4 + index * 0.08,
            delay: index * 0.05,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-[31px] border-t border-dashed border-blue-200" />
    </div>
  )
}

function ListingVisual({ live }: VisualProps) {
  const candles = [
    { h: 24, y: 21, up: true },
    { h: 18, y: 26, up: false },
    { h: 31, y: 15, up: true },
    { h: 26, y: 11, up: true },
    { h: 20, y: 18, up: false },
    { h: 38, y: 5, up: true },
    { h: 28, y: 9, up: true },
    { h: 21, y: 14, up: false },
  ]

  return (
    <div className="relative flex h-24 items-end justify-between py-3">
      <div className="absolute inset-x-0 top-2 flex justify-between font-mono text-[7px] text-slate-500">
        <span>₹127.00 OPEN</span>
        <span className="text-emerald-600">₹148.20</span>
      </div>
      <div className="absolute inset-x-0 bottom-4 border-t border-dashed border-blue-200" />
      {candles.map((candle, index) => (
        <motion.div
          key={index}
          className="relative h-10 flex-1"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: live ? 1 : 0, scaleY: live ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 3 + index * 0.06, ease: EASE }}
          style={{ transformOrigin: 'bottom' }}
        >
          <span
            className={`absolute left-1/2 w-px -translate-x-1/2 ${
              candle.up ? 'bg-emerald-400/60' : 'bg-rose-400/60'
            }`}
            style={{ height: candle.h, top: candle.y }}
          />
          <span
            className={`absolute left-1/2 h-2.5 w-1.5 -translate-x-1/2 ${
              candle.up ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
            style={{ top: candle.y + candle.h / 3 }}
          />
        </motion.div>
      ))}
    </div>
  )
}

function LockInVisual({ live, reducedMotion }: VisualProps) {
  return (
    <div className="flex h-24 items-center gap-4">
      <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-200 bg-white">
        <motion.div
          className="absolute inset-0 rounded-full border border-transparent border-t-blue-500/80"
          animate={live && !reducedMotion ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        <div className="h-4 w-4 border border-blue-400">
          <div className="mx-auto -mt-2 h-2 w-2 rounded-t border border-b-0 border-blue-400" />
          <div className="mx-auto mt-1.5 h-1 w-1 rounded-full bg-blue-500" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-lg text-slate-900">27</span>
          <span className="font-mono text-[7px] text-slate-500">DAYS</span>
        </div>
        <div className="h-1 overflow-hidden bg-blue-100">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: live ? '73%' : 0 }}
            transition={{ duration: 0.8, delay: 3.45, ease: EASE }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[7px] text-slate-600">
          <span>LISTED</span>
          <span>UNLOCK</span>
        </div>
      </div>
    </div>
  )
}

function DataRow({
  label,
  value,
  positive = false,
}: {
  label: string
  value: string
  positive?: boolean
}) {
  return (
    <div className="flex items-center justify-between font-mono text-[7px]">
      <span className="text-slate-400">{label.toUpperCase()}</span>
      <span className={positive ? 'text-emerald-600' : 'text-slate-600'}>{value}</span>
    </div>
  )
}

const visuals: Record<VisualType, ComponentType<VisualProps>> = {
  filing: FilingVisual,
  summary: SummaryVisual,
  book: BookVisual,
  sentiment: SentimentVisual,
  listing: ListingVisual,
  lockin: LockInVisual,
}

type RailProps = {
  visible: boolean
  reducedMotion: boolean
}

function PipelineRail({ visible, reducedMotion }: RailProps) {
  return (
    <>
      <div className="pointer-events-none absolute left-[8.3%] right-[8.3%] top-[48%] hidden h-px xl:block">
        <div className="absolute inset-0 bg-slate-700/55" />
        <motion.div
          className="absolute inset-y-0 left-0 bg-cyan-300/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: visible ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.05, delay: 0.75, ease: EASE }}
          style={{ transformOrigin: 'left' }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 bg-cyan-200 shadow-[0_0_5px_rgba(103,232,249,0.55)]"
          animate={{ width: visible ? '100%' : 0, opacity: 0.12 }}
          transition={{ duration: 1.05, delay: 0.75, ease: EASE }}
        />
        {visible && !reducedMotion && (
          <motion.span
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_8px_rgba(103,232,249,0.9)]"
            animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 5.6, delay: 3.4, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 hidden md:block xl:hidden">
        <div className="absolute left-[16.7%] right-[16.7%] top-[24%] h-px bg-slate-700/55">
          <motion.div
            className="h-full bg-cyan-300/55"
            initial={{ width: 0 }}
            animate={{ width: visible ? '100%' : 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
          />
        </div>
        <div className="absolute bottom-[24%] right-[16.7%] top-[24%] w-px bg-slate-700/55">
          <motion.div
            className="w-full bg-cyan-300/55"
            initial={{ height: 0 }}
            animate={{ height: visible ? '100%' : 0 }}
            transition={{ duration: 0.35, delay: 1.45, ease: EASE }}
          />
        </div>
        <div className="absolute bottom-[24%] left-[16.7%] right-[16.7%] h-px bg-slate-700/55">
          <motion.div
            className="absolute right-0 h-full bg-cyan-300/55"
            initial={{ width: 0 }}
            animate={{ width: visible ? '100%' : 0 }}
            transition={{ duration: 0.8, delay: 1.7, ease: EASE }}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[8%] left-5 top-[8%] w-px md:hidden">
        <div className="absolute inset-0 bg-slate-700/55" />
        <motion.div
          className="absolute left-0 top-0 w-px bg-cyan-300/60"
          initial={{ height: 0 }}
          animate={{ height: visible ? '100%' : 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.05, delay: 0.75, ease: EASE }}
        />
        {visible && !reducedMotion && (
          <motion.span
            className="absolute -left-[3px] h-1.5 w-1.5 rounded-full bg-cyan-100 shadow-[0_0_8px_rgba(103,232,249,0.9)]"
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 5.6, delay: 3.4, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
    </>
  )
}

export default function IpoLifecycleMotion() {
  const sectionRef = useRef<HTMLElement>(null)
  const visible = useInView(sectionRef, { once: true, amount: 0.16 })
  const reducedMotion = useReducedMotion() ?? false
  const [focusedStage, setFocusedStage] = useState<number | null>(null)

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="ipo-lifecycle-title"
      variants={sectionVariants}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      className="section ipo-lifecycle-section relative text-slate-900"
      style={{
        '--pipeline-accent': '#1e5eff',
        paddingTop: '40px',
        paddingBottom: '160px',
      } as CSSProperties}
    >
      <div className="w-full">
        <div style={{ paddingBottom: '48px' }}>
          <motion.h2
            id="ipo-lifecycle-title"
            variants={revealVariants}
            className="max-w-3xl text-balance text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[38px] lg:leading-[1.15]"
          >
            Track every IPO, from DRHP to listing.
          </motion.h2>
        </div>

        <div>
          <div className="relative isolate mx-auto flex max-w-5xl flex-col gap-5 sm:px-4 lg:grid lg:grid-cols-6 lg:items-stretch lg:gap-x-8 lg:gap-y-12">
            {stages.map((stage, index) => {
              const Visual = visuals[stage.visualType]
              const selected = focusedStage === index
              return (
                <motion.div
                  key={stage.id}
                  custom={index}
                  variants={stageVariants}
                  className={`relative flex min-w-0 flex-col items-center gap-3 lg:col-span-2 ${
                    index === 3 ? 'lg:col-start-2' : ''
                  }`}
                >
                  <motion.article
                    tabIndex={0}
                    aria-label={`${stage.number} — ${stage.title}: ${stage.label}`}
                    onHoverStart={() => setFocusedStage(index)}
                    onHoverEnd={() => setFocusedStage(null)}
                    onFocus={() => setFocusedStage(index)}
                    onBlur={() => setFocusedStage(null)}
                    className="relative w-full min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_30px_-24px_rgba(15,23,42,0.3)] outline-none transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-[0_14px_34px_-24px_rgba(15,23,42,0.38)]"
                  >
                    <div style={{ padding: '24px' }}>
                      <div className="flex h-12 items-center justify-between">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="text-[10px] font-bold text-blue-600">
                            {stage.number}
                          </span>
                          <span className="h-3 w-px bg-slate-200" />
                          <h3 className="truncate text-sm font-bold tracking-tight text-slate-900">
                            {stage.title}
                          </h3>
                        </div>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            selected
                              ? 'bg-blue-500 shadow-[0_0_7px_rgba(30,94,255,0.35)]'
                              : 'bg-blue-200'
                          }`}
                        />
                      </div>

                      <Visual live={visible} reducedMotion={reducedMotion} />

                      <div className="py-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-blue-600">
                          {stage.label}
                        </p>
                        <div className="mt-2 flex items-end justify-between gap-2">
                          <span
                            className={`text-base font-bold ${
                              stage.visualType === 'listing' ||
                              stage.visualType === 'sentiment'
                                ? 'text-emerald-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {stage.metric}
                          </span>
                          <span className="pb-0.5 text-right text-[8px] font-medium text-slate-500">
                            {stage.metricLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                  </motion.article>
                  {index < stages.length - 1 && (
                    <span
                      className={`shrink-0 rotate-90 text-xl font-medium text-blue-400 lg:absolute lg:z-10 ${
                        index === 2
                          ? 'lg:-bottom-9 lg:left-1/2 lg:-translate-x-1/2'
                          : 'lg:-right-6 lg:top-1/2 lg:-translate-y-1/2 lg:rotate-0'
                      }`}
                      aria-hidden="true"
                    >
                      {'->'}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </motion.section>
  )
}
