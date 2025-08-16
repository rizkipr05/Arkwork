'use client';

import {useState} from 'react';
import {useAuth} from '@/hooks/useAuth';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {useTranslations} from 'next-intl';

import ArkLogo from '@/app/Images/Ungu__1_-removebg-preview.png';

export default function SignIn() {
  const t = useTranslations('signin');
  const router = useRouter();
  const {signin, social} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState<'google' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signin(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('error.default'));
    } finally {
      setBusy(false);
    }
  }

  async function handleSocialGoogle() {
    if (loading) return;
    setLoading('google');
    setError(null);
    try {
      await social('google', 'login');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('error.google'));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
          {/* Header + Logo */}
          <div className="px-6 pt-6 text-center">
            <Image
              src={ArkLogo}
              alt="ArkWork Logo"
              width={100}
              height={100}
              className="mx-auto mb-6 h-20 w-20 object-contain"
              priority
            />
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {t('title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{t('subtitle')}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">{t('form.email')}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">{t('form.password')}</span>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    placeholder="••••••••"
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
              </label>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  {t('form.remember')}
                </label>
                <a className="text-sm font-medium text-blue-700 hover:underline" href="#">
                  {t('form.forgot')}
                </a>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    {t('form.signingIn')}
                  </>
                ) : (
                  t('form.signInBtn')
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

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleSocialGoogle}
              disabled={loading === 'google'}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium shadow hover:bg-slate-50 disabled:opacity-60"
            >
              {/* {loading === 'google' ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  {t('form.signingIn')}
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
                  {t('googleBtn')}
                </>
              )} */}
            </button>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              {t('noAccount')}{' '}
              <Link href="/auth/signup" className="font-medium text-blue-700 hover:underline">
                {t('signUp')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
