import commonjs from "rollup-plugin-commonjs";
import dts from "rollup-plugin-dts";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

// this override is needed because Module format cjs does not support top-level await
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");

const inputFile = "src/index.ts";

const globals = {
  ...packageJson.dependencies,
};

export default [
  //Modulos compativel com o node
  {
    input: inputFile,
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          exclude: ["**/*.test.*"],
        },
      }),
      commonjs({
        exclude: "node_modules",
        ignoreGlobal: true,
      }),
      uglify(),
    ],
    output: [
      {
        file: packageJson.main,
        format: "cjs", // commonJS
        sourcemap: true,
        name: "viacep",
        exports: "named",
      },
    ],
    external: Object.keys(globals),
  },
  //gerando o arquivos compativel com o navegador.
  {
    input: inputFile,
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          exclude: ["**/*.test.*"],
        },
      }),
      replace({
        "node-fetch": "unfetch",
      }),
      commonjs({
        exclude: "node_modules",
        ignoreGlobal: true,
      }),
      resolve({
        browser: true,
      }),
      uglify({}),
    ],
    context: "window",
    output: [
      {
        file: packageJson.browser,
        format: "umd", // commonJS
        sourcemap: true,
        name: "cep",
        globals: {
          unfetch: "fetch",
        },
        exports: 'named'
      },
    ],
    external: Object.keys(globals),
  },
  //gerando typescript types
  {
    input: inputFile,
    output: [
      {
        file: packageJson.types,
        format: "es",
      },
    ],
    plugins: [dts()],
    external: Object.keys(globals),
  },
];
