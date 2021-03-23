import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

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
    ],
    output: [
      {
        file: packageJson.main,
        format: "cjs", // commonJS
        sourcemap: true,
        name: "viacep",
        exports: "named",
      },
      {
        file: packageJson.main.replace(".js", ".min.js"),
        format: "cjs",
        exports: "named",
        sourcemap: true,
        plugins: [terser()],
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
        preventAssignment: true,
      }),
      commonjs({
        exclude: "node_modules",
        ignoreGlobal: true,
      }),
      resolve({
        browser: true,
      }),
    ],
    context: "window",
    output: [
      {
        file: packageJson.browser,
        format: "umd", // commonJS
        sourcemap: true,
        name: "viacep",
        globals: {
          unfetch: "fetch",
        },
        exports: "named",
      },
      {
        file: packageJson.browser.replace(".js", ".min.js"),
        format: "umd", // commonJS
        name: "viacep",
        sourcemap: true,
        globals: {
          unfetch: "fetch",
        },
        exports: "named",
        plugins: [terser()],
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
