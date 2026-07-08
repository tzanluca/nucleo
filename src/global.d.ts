// TypeScript 6 (TS2882) passou a exigir declaração de tipo para imports
// side-effect de assets. `import "./globals.css"` no App Router não tem
// .d.ts próprio, então declaramos o módulo CSS de forma ambiente aqui.
declare module "*.css";
