declare module 'postcss-pxtorem' {
  interface Options {
    rootValue?: number
    unitPrecision?: number
    propList?: string[]
    selectorBlackList?: (string | RegExp)[]
    replace?: boolean
    mediaQuery?: boolean
    minPixelValue?: number
    exclude?: RegExp | ((file: string) => boolean)
  }

  function pxtorem(options?: Options): any
  export = pxtorem
}
