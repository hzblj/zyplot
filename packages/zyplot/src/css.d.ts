/**
 * The web entry pulls its stylesheet in as a side effect. `tsc` only needs to
 * know the specifier resolves; the import is emitted untouched and the
 * consumer's bundler is what actually loads it.
 */
declare module "*.css";
