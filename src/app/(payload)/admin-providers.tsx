import { ProgressBar, RootProvider } from '@payloadcms/ui'
import { getClientConfig } from '@payloadcms/ui/utilities/getClientConfig'
import type { AcceptedLanguages } from '@payloadcms/translations'
import { cookies as nextCookies } from 'next/headers'
import { applyLocaleFiltering } from 'payload/shared'
import type { ImportMap, SanitizedConfig, ServerFunctionClient } from 'payload'
import React, { Suspense } from 'react'
import { getNavPrefs } from '@payloadcms/next/dist/elements/Nav/getNavPrefs.js'
import { getRequestTheme } from '@payloadcms/next/dist/utilities/getRequestTheme.js'
import { initReq } from '@payloadcms/next/dist/utilities/initReq.js'
import { NestProviders } from '@payloadcms/next/dist/layouts/Root/NestProviders.js'
import { checkDependencies } from '@payloadcms/next/dist/layouts/Root/checkDependencies.js'

type AdminProvidersProps = {
  children: React.ReactNode
  config: Promise<SanitizedConfig>
  importMap: ImportMap
  serverFunction: ServerFunctionClient
}

async function AdminProvidersContent({
  children,
  config: configPromise,
  importMap,
  serverFunction,
}: AdminProvidersProps) {
  const {
    cookies,
    headers,
    languageCode,
    permissions,
    req,
    req: {
      payload: { config },
    },
  } = await initReq({ configPromise, importMap, key: 'AdminProviders' })

  const theme = getRequestTheme({ config, cookies, headers })

  const languageOptions = Object.entries(config.i18n.supportedLanguages || {}).reduce<
    Array<{ label: string; value: AcceptedLanguages }>
  >((acc, [language, languageConfig]) => {
    if (Object.keys(config.i18n.supportedLanguages).includes(language)) {
      acc.push({
        label: (languageConfig as { translations: { general: { thisLanguage: string } } }).translations.general.thisLanguage,
        value: language as AcceptedLanguages,
      })
    }
    return acc
  }, [])

  async function switchLanguageServerAction(lang: string) {
    'use server'

    const cookies = await nextCookies()
    cookies.set({
      name: `${config.cookiePrefix || 'payload'}-lng`,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      value: lang,
    })
  }

  const navPrefs = await getNavPrefs(req)

  const clientConfig = getClientConfig({
    config,
    i18n: req.i18n,
    importMap,
    user: req.user ?? true,
  })

  await applyLocaleFiltering({ clientConfig, config, req })

  const providers = config.admin?.components?.providers
  const hasProviders = Array.isArray(providers) && providers.length > 0

  return (
    <>
      <RootProvider
        config={clientConfig}
        dateFNSKey={req.i18n.dateFNSKey}
        fallbackLang={config.i18n.fallbackLanguage}
        isNavOpen={navPrefs?.open ?? true}
        languageCode={languageCode}
        languageOptions={languageOptions}
        locale={req.locale ?? undefined}
        permissions={req.user ? permissions : (null as unknown as import('payload').SanitizedPermissions)}
        serverFunction={serverFunction}
        switchLanguageServerAction={switchLanguageServerAction}
        theme={theme}
        translations={req.i18n.translations}
        user={req.user}
      >
        <ProgressBar />
        {hasProviders ? (
          <NestProviders
            importMap={req.payload.importMap}
            providers={providers}
            serverProps={{
              i18n: req.i18n,
              payload: req.payload,
              permissions,
              user: req.user ?? undefined,
            }}
          >
            {children}
          </NestProviders>
        ) : (
          children
        )}
      </RootProvider>
      <div id="portal" />
    </>
  )
}

export function AdminProviders(props: AdminProvidersProps) {
  checkDependencies()
  const content = <AdminProvidersContent {...props} />
  if (process.env.PAYLOAD_CACHE_COMPONENTS_ENABLED === 'true') {
    return <Suspense fallback={null}>{content}</Suspense>
  }
  return content
}
