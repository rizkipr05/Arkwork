'use client';

import {useState} from 'react';
import {useAuth} from '@/hooks/useAuth';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {useTranslations} from 'next-intl';

import Logo from '@/app/Images/Ungu__1_-removebg-preview.png';

export default function SignUp() {
  const t = useTranslations('signup');
  const router = useRouter();
  const {signup, social} = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(true);

  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strong = pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) {
      setError(t('error.agree'));
      return;
    }
    if (pw !== confirm) {
      setError(t('error.mismatch'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signup(name.trim(), email.trim(), pw);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('error.default'));
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    try {
      setGoogleBusy(true);
      setError(null);
      await social('google', 'signup');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('error.google'));
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
          {/* Header */}
          <div className="px-6 pt-6 text-center">
            <Image
              src={Logo}
              alt="ArkWork Logo"
              width={100}
              height={100}
              className="mx-auto mb-6 h-20 w-20 object-contain"
              priority
            />
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {t('title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {t('subtitle')}
            </p>
          </div>

          {/* Error box */}
          {error && (
            <div className="mx-6 mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="px-6 pb-6 pt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">{t('form.name')}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('placeholder.name')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">{t('form.email')}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder={t('placeholder.email')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">{t('form.password')}</span>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    minLength={8}
                    placeholder={t('placeholder.password')}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-slate-700"
                    tabIndex={-1}
                    aria-label={t('form.togglePw')}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-1 w-1/3 rounded ${pw.length >= 6 ? 'bg-amber-400' : 'bg-slate-200'}`} />
                  <div className={`h-1 w-1/3 rounded ${pw.length >= 8 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                  <div className={`h-1 w-1/3 rounded ${strong ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">{t('form.confirm')}</span>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder={t('placeholder.confirm')}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-slate-700"
                    tabIndex={-1}
                    aria-label={t('form.toggleConfirm')}
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirm.length > 0 && (
                  <p className={`mt-1 text-xs ${pw === confirm ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {pw === confirm ? t('match.ok') : t('match.no')}
                  </p>
                )}
              </label>

              <label className="mt-1 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                {t('agree.1')}{' '}
                <a href="#" className="text-blue-700 hover:underline">{t('agree.terms')}</a>{' '}
                {t('agree.and')}{' '}
                <a href="#" className="text-blue-700 hover:underline">{t('agree.privacy')}</a>.
              </label>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    {t('creating')}
                  </>
                ) : (
                  t('createBtn')
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="h-[1px] flex-1 bg-slate-200" />
              <span className="px-3 text-xs uppercase tracking-wider text-slate-400">
                {t('or')}
              </span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </div>

            {/* Google
            <button
              type="button"
              onClick={onGoogle}
              disabled={googleBusy}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium shadow hover:bg-slate-50 disabled:opacity-60"
            >
              {googleBusy ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  {t('creating')}
                </>
              ) : ( 
                <>
                  <Image
                    src="/google-icon.svg"
                    alt="Google"
                    width={18}
                    height={18}
                    className="mr-2"
                  />
                  {t('google')}
                </>
              )}
            </button> */}

            <p className="mt-6 text-center text-sm text-slate-600">
              {t('haveAccount')}{' '}
              <Link href="/auth/signin" className="font-medium text-blue-700 hover:underline">
                {t('signIn')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
