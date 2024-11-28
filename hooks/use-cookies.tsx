'use client';

import constate from 'constate';
import { useLayoutEffect, useState } from 'react';
import Cookies from 'universal-cookie';

const globalCookies = new Cookies();

const setGlobalCookie = globalCookies.set.bind(globalCookies);
const removeGlobalCookie = globalCookies.remove.bind(globalCookies);

function useCookie() {
  const [cookies, setCookies] = useState(globalCookies.getAll());

  useLayoutEffect(() => {
    function onChange() {
      const newCookies = globalCookies.getAll();
      setCookies(newCookies);
    }
    globalCookies.addChangeListener(onChange);
    return () => {
      globalCookies.removeChangeListener(onChange);
    };
  }, []);

  return {
    setCookie: setGlobalCookie,
    removeCookie: removeGlobalCookie,
    cookies,
  };
}

export const [CookiesProvider, useCookies] = constate(useCookie);
