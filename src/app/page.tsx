'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowLeft, Radar, Sparkles } from 'lucide-react';
import { QUESTIONS, STORAGE_KEY, TYPES, SITE } from '@/lib/content';

const KEYS = ['A', 'B', 'C', 'D'];

export default function HomePage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const choose = (index: number) => {
    const next = [...answers];
    next[step] = index;
    setAnswers(next);
    setStep(step + 1);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Укажите корректный e-mail — на него придёт результат.');
      return;
    }
    setError('');
    setBusy(true);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers: JSON.stringify(answers),
        name: name.trim() || 'Клиент',
        email: email.trim(),
      })
    );
    router.push('/result');
  };

  const done = step >= QUESTIONS.length;

  return (
    <>
      <main className="shell">
        {!started ? (
          <>
            <section className="hero">
              <span className="hero-mark">
                <Zap size={14} strokeWidth={2} />
                10 вопросов · 2 минуты
              </span>
              <h1>Детектор харизмы — какой тип притяжения заложен в тебе</h1>
              <p className="hero-sub">
                Харизма не одна. Их пять, и они работают по-разному: то, что усиливает
                Магнита, полностью выключает Загадку. Узнай свою — и перестань
                пользоваться чужой инструкцией.
              </p>
              <div style={{ maxWidth: 340, margin: '30px auto 0' }}>
                <button className="btn-primary" onClick={() => setStarted(true)}>
                  <Radar size={18} strokeWidth={2} />
                  Пройти тест
                </button>
              </div>
              <p className="hero-note" style={{ marginTop: 14 }}>
                Без регистрации. Базовый результат — бесплатно.
              </p>
            </section>

            <div className="rule">
              <Sparkles size={17} strokeWidth={1.6} />
            </div>

            <section>
              <h2 className="section-title">Пять типов харизмы</h2>
              <p className="section-lead">
                Каждый притягивает по-своему. Ошибка большинства — копировать чужой тип
                и не понимать, почему это не работает.
              </p>
              <div className="type-grid">
                {Object.values(TYPES).map((t) => (
                  <article className="type-tile" key={t.id}>
                    <h3>{t.name}</h3>
                    <p>{t.tagline}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="rule">
              <Sparkles size={17} strokeWidth={1.6} />
            </div>

            <section className="narrow">
              <h2 className="section-title">Частые вопросы</h2>
              <div style={{ marginTop: 26 }}>
                <div className="faq-item">
                  <h3>Как считается тип?</h3>
                  <p>
                    Каждый ответ добавляет балл одному из пяти типов. Побеждает тот, что
                    набрал больше всего, а радар по пяти осям строится с учётом всех
                    ваших ответов — поэтому профили двух людей одного типа не совпадают.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Что я получу бесплатно?</h3>
                  <p>
                    Название типа, его девиз и форму радара. Точные значения по осям,
                    инструкция активации, блоки и фразы открываются в платных тарифах.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Это психологический тест?</h3>
                  <p>
                    Нет. Это развлекательный тест, а не валидированная методика. Он не
                    ставит диагнозов и не заменяет работу с психологом.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="narrow" style={{ paddingTop: 56 }}>
            <div className="quiz-progress">
              {QUESTIONS.map((_, i) => (
                <span key={i} data-done={i < step ? 'true' : 'false'} />
              ))}
            </div>

            {!done ? (
              <>
                <p className="quiz-step">
                  Вопрос {step + 1} из {QUESTIONS.length}
                </p>
                <h2 className="quiz-question">{QUESTIONS[step].q}</h2>
                <div className="quiz-options">
                  {QUESTIONS[step].options.map((o, i) => (
                    <button className="quiz-option" key={i} onClick={() => choose(i)}>
                      <span className="quiz-option-key">{KEYS[i]}</span>
                      {o.text}
                    </button>
                  ))}
                </div>
                {step > 0 ? (
                  <button className="quiz-back" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={15} strokeWidth={2} />
                    Назад
                  </button>
                ) : null}
              </>
            ) : (
              <form className="form-card" onSubmit={submit}>
                <h2 className="quiz-question" style={{ marginBottom: 8 }}>
                  Тест пройден
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: 0, marginBottom: 22 }}>
                  Укажите почту — отправим на неё результат и PDF после открытия доступа.
                </p>

                <div className="field">
                  <label htmlFor="name">Имя</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error ? <p className="field-error">{error}</p> : null}

                <button className="btn-primary" type="submit" disabled={busy}>
                  <Radar size={18} strokeWidth={2} />
                  {busy ? 'Строим радар...' : 'Узнать тип харизмы'}
                </button>

                <p className="consent">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <Link href="/privacy">политикой конфиденциальности</Link> и{' '}
                  <Link href="/offer">условиями оферты</Link>.
                </p>
              </form>
            )}
          </section>
        )}
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
