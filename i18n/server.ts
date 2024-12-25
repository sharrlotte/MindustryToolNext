import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import HttpApi from 'i18next-http-backend';
import { getOptions, Locale } from '@/i18n/config';

const initI18next = async (language: Locale, namespace: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(HttpApi)
    .init(getOptions(language, namespace))
  return i18nInstance
}

export async function useTranslation(language: Locale, namespace: string | string[], options  : {keyPrefix?: string} = {}) {
  const singleNamespace = Array.isArray(namespace) ? namespace[0] : namespace
  const i18nextInstance = await initI18next(language, singleNamespace);
  
  return {
    t: i18nextInstance.getFixedT(language, singleNamespace, options.keyPrefix),
    i18n: i18nextInstance
  }
}