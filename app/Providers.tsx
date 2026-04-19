'use client';

import i18n from '../src/i18n/i18n.js';
import { I18nextProvider } from 'react-i18next';
import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function Providers({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider {...props}>
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		</NextThemesProvider>
	);
}
