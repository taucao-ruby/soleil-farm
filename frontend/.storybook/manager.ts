/**
 * Storybook Manager Configuration
 * Customize the Storybook UI
 */
import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  
  // Brand
  brandTitle: 'Soleil Farm Design System',
  brandUrl: 'https://soleil-farm.com',
  brandTarget: '_self',
  
  // Colors
  colorPrimary: '#10b981',
  colorSecondary: '#047857',
  
  // UI
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,
  
  // Text colors
  textColor: '#0f172a',
  textInverseColor: '#ffffff',
  textMutedColor: '#64748b',
  
  // Toolbar
  barTextColor: '#64748b',
  barSelectedColor: '#10b981',
  barBg: '#ffffff',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  inputTextColor: '#0f172a',
  inputBorderRadius: 6,
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
