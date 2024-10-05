module.exports = {
  root: true, // Asegúrate de que ESLint sepa que este es el archivo de configuración raíz
  parser: "@typescript-eslint/parser", // Usa el parser de TypeScript
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended", // Reglas recomendadas por ESLint
    "plugin:@typescript-eslint/recommended", // Reglas recomendadas para TypeScript
  ],
  parserOptions: {
    ecmaVersion: 2021, // Especifica la versión de ECMAScript
    sourceType: "module", // Habilita los módulos de ES
    tsconfigRootDir: __dirname, // Directorio raíz del tsconfig.json
    project: ["./tsconfig.json"], // Ruta al archivo tsconfig.json
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Variables no usadas
    // Añade más reglas si es necesario
  },
  env: {
    node: true, // Habilita variables globales de Node.js
  },
  ignorePatterns: ["node_modules/", "dist/", "build/"], // Directorios ignorados
  overrides: [
    {
      files: ["**/*.ts", "**/*.js"], // Extensiones que ESLint revisará
      parser: "@typescript-eslint/parser", // Usa el parser de TypeScript para ambos tipos de archivos
    },
  ],
};
