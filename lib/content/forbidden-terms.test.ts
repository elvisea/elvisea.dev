import { describe, expect, it } from "bun:test";

import {
  findForbiddenTerms,
  forbiddenTermsFromEnv,
  parseForbiddenTerms,
} from "./forbidden-terms";

describe("parseForbiddenTerms", () => {
  it("separa por vírgula, normaliza e ignora vazios", () => {
    expect(parseForbiddenTerms(" Alfa, beta ,,GAMA ")).toEqual([
      "alfa",
      "beta",
      "gama",
    ]);
    expect(parseForbiddenTerms(undefined)).toEqual([]);
  });
});

describe("forbiddenTermsFromEnv", () => {
  it("é obrigatória só na CI", () => {
    expect(forbiddenTermsFromEnv({ FORBIDDEN_TERMS: "x", CI: "true" })).toEqual(
      { terms: ["x"], required: true },
    );
    expect(forbiddenTermsFromEnv({})).toEqual({ terms: [], required: false });
  });
});

describe("findForbiddenTerms", () => {
  const terms = ["acme", "zeta"];

  it("acha trecho e informa só a posição, nunca o termo", () => {
    expect(findForbiddenTerms("repo acme_app", terms)).toEqual([
      "termo 1 de 2",
    ]);
    expect(findForbiddenTerms("Projeto ZETA", terms)).toEqual(["termo 2 de 2"]);
    expect(findForbiddenTerms("nada aqui", terms)).toEqual([]);
  });

  it("com wholeWord, ignora a palavra dentro de outra", () => {
    expect(findForbiddenTerms("acmeísmo", terms, { wholeWord: true })).toEqual(
      [],
    );
    expect(
      findForbiddenTerms("cliente acme.", terms, { wholeWord: true }),
    ).toEqual(["termo 1 de 2"]);
  });

  it("trata o termo como texto, não como regex", () => {
    expect(findForbiddenTerms("a.b", ["a.b"])).toEqual(["termo 1 de 1"]);
    expect(findForbiddenTerms("axb", ["a.b"])).toEqual([]);
  });
});
