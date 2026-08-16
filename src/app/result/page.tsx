'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Check, Radar, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  PLANS,
  STORAGE_KEY,
  AXES,
  scoreQuiz,
  parseAnswers,
  SITE,
  type CharismaType,
} from '@/lib/content';
import type { PlanId, UserData } from '@/lib/types';

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 108;

function axisPoint(index: number, value: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (value / 100) * RADIUS;
  return { x: CENTER + Math.cos(angle) * r, y: CENTER + Math.sin(angle) * r };
}

export default function ResultPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [type, setType] = useState<CharismaType | null>(null);
  const [radar, setRadar] = useState<number[]>([]);
  const [paying, setPaying] = useState<PlanId | null>(null);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    let data: UserData = {};
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as UserData;
    } catch {
      data = {};
    }
    const answers = parseAnswers(data.answers);
    if (!answers) {
      router.replace('/');
      return;
    }
    const result = scoreQuiz(answers);
    setUser(data);
    setType(result.type);
    setRadar(result.radar);
  }, [router]);

  const pay = async (plan: PlanId) => {
    if (!user) return;
    setPaying(plan);
    setPayError('');
    localStorage.setItem('selected_plan', plan);
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userData: user }),
      });
      const data = await res.json();
      if (data?.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      setPayError(data?.error || 'Не удалось создать платёж. Попробуйте ещё раз.');
    } catch {
      setPayError('Сервис оплаты временно недоступен. Попробуйте через минуту.');
    }
    setPaying(null);
  };

  if (!user || !type) {
    return (
      <main className="shell" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Строим радар...</p>
      </main>
    );
  }

  const polygon = radar
    .map((v, i) => {
      const p = axisPoint(i, v, radar.length);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <>
      <main className="shell" style={{ paddingTop: 48 }}>
        <motion.section
          className="radar-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="radar-type">{type.name}</h1>
          <p className="radar-tagline">{type.tagline}</p>

          <svg
            className="radar-svg"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Радар харизмы: тип ${type.name}`}
          >
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <polygon
                key={scale}
                points={AXES.map((_, i) => {
                  const p = axisPoint(i, scale * 100, AXES.length);
                  return `${p.x},${p.y}`;
                }).join(' ')}
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}

            {AXES.map((_, i) => {
              const p = axisPoint(i, 100, AXES.length);
              return (
                <line
                  key={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              );
            })}

            <motion.polygon
              points={polygon}
              fill="rgba(139, 92, 246, 0.28)"
              stroke="#8B5CF6"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ transformOrigin: 'center' }}
            />

            {AXES.map((axis, i) => {
              const label = axisPoint(i, 132, AXES.length);
              const value = axisPoint(i, 112, AXES.length);
              return (
                <g key={axis}>
                  <text
                    className="radar-axis-label"
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {axis}
                  </text>
                  <text
                    className="radar-value blurred"
                    x={value.x}
                    y={value.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {radar[i]}
                  </text>
                </g>
              );
            })}
          </svg>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
            Форма радара видна. Точные значения по осям скрыты.
          </p>
        </motion.section>

        <div className="rule">
          <Radar size={17} strokeWidth={1.7} />
        </div>

        <section className="narrow">
          <div className="lock-stack">
            <div className="lock-veil">
              <Lock size={26} strokeWidth={1.6} color="var(--accent)" />
              <h3>Кольца закрыты</h3>
              <p>
                Полное описание типа, инструкция активации, ваши блоки и фразы —
                открываются кольцами ниже.
              </p>
            </div>

            <div className="locked-blur" aria-hidden="true">
              <div className="info-card">
                <h3>
                  <Zap size={17} strokeWidth={1.8} />
                  Кто ты в притяжении
                </h3>
                <p>{type.description}</p>
              </div>
              <div className="info-card">
                <h3>
                  <Radar size={17} strokeWidth={1.8} />
                  Как активировать харизму
                </h3>
                <p>{type.activate}</p>
              </div>
              <div className="info-card">
                <h3>
                  <AlertTriangle size={17} strokeWidth={1.8} />
                  Что блокирует притяжение
                </h3>
                <p>{type.blocks}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rule">
          <Radar size={17} strokeWidth={1.7} />
        </div>

        <section>
          <h2 className="section-title">Три кольца доступа</h2>
          <p className="section-lead">
            Чем шире кольцо, тем больше открывается: от описания типа до плана
            активации на 30 дней.
          </p>

          <div className="rings">
            {PLANS.map((plan, index) => {
              const discount = Math.round((1 - plan.price / plan.oldPrice) * 100);
              return (
                <div
                  key={plan.id}
                  className="ring"
                  data-featured={plan.featured ? 'true' : 'false'}
                  data-level={index + 1}
                >
                  {plan.featured ? <span className="ring-badge">Выбор большинства</span> : null}

                  <div className="ring-visual">
                    <Radar size={20} strokeWidth={1.8} />
                  </div>

                  <h3>{plan.name}</h3>
                  <p className="ring-tagline">{plan.tagline}</p>

                  <div className="ring-price">
                    <span className="now">{plan.price} ₽</span>
                    <span className="was">{plan.oldPrice} ₽</span>
                    <span className="off">−{discount}%</span>
                  </div>

                  <ul className="ring-features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={15} strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="ring-cta"
                    disabled={paying !== null}
                    onClick={() => pay(plan.id)}
                  >
                    {paying === plan.id ? (
                      'Открываем оплату...'
                    ) : (
                      <>
                        Открыть кольцо
                        <ArrowRight size={16} strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {payError ? (
            <p className="field-error" style={{ textAlign: 'center', marginTop: 20 }}>
              {payError}
            </p>
          ) : null}

          <p
            style={{
              textAlign: 'center',
              marginTop: 26,
              fontSize: 13.5,
              color: 'var(--text-secondary)',
            }}
          >
            Оплата через ЮKassa. Доступны карты, СБП, кошельки и рассрочка.
            <br />
            Результат открывается сразу после оплаты и дублируется на почту.
          </p>
        </section>
      </main>

      <footer className="site-foot shell">
        <p>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/offer">Публичная оферта</Link>
        </p>
        <p>
          Евдокимов Даниил Владимирович · ИНН 381928138362 · Самозанятый
          <br />
          danyavdkmvv3@gmail.com · @dvdkmv
        </p>
        <p className="disclaimer">
          {SITE.name} — развлекательный сервис. Тест не является психологической
          диагностикой.
        </p>
      </footer>
    </>
  );
}
