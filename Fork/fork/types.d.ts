declare module 'i18n-js' {
    interface I18n {
      locale: string;
      defaultLocale: string;
      fallbacks: boolean;
      translations: { [key: string]: any };
      t: (scope: string, options?: any) => string;
    }
  
    const i18n: I18n;
    export default i18n;
  }
  