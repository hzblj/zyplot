/**
 * Resolution fallback for targets that have no platform-only chart forms.
 *
 * Metro prefers `platform-example.ios.tsx` and `platform-example.android.tsx`
 * over this file, so it is only ever bundled on web — where the extension
 * sections of the catalog are empty anyway. It also gives `tsc` something to
 * resolve `./platform-example` to.
 */
export const PlatformExample = (_props: { id: string }) => null;
