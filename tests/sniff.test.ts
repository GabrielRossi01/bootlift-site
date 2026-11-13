import { describe, expect, it } from "vitest";
import { sniffFileName } from "@/lib/sniff";
import { classify } from "@/lib/classify";
import { EXAMPLES } from "@/content/examples.generated";

describe("sniffFileName", () => {
  it("recognizes every playground example as the right kind of file", () => {
    for (const example of EXAMPLES) {
      const guess = sniffFileName(example.content);
      expect(guess, example.name).toBeDefined();
      expect(classify(guess!), example.name).toBe(classify(example.path));
    }
  });

  it.each([
    ["pom.xml", "<project>\n  <modelVersion>4.0.0</modelVersion>\n</project>"],
    [
      "build.gradle",
      "plugins {\n  id 'org.springframework.boot' version '3.2.0'\n}",
    ],
    [
      "build.gradle.kts",
      'plugins {\n  id("org.springframework.boot") version "3.2.0"\n}',
    ],
    [
      "gradle-wrapper.properties",
      "distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip",
    ],
    ["libs.versions.toml", '[versions]\nspring-boot = "3.3.5"'],
    [
      "App.java",
      "package dev.rossi;\n\nimport javax.servlet.Filter;\n\npublic class App {}",
    ],
    ["App.kt", "package dev.rossi\n\nimport javax.servlet.Filter\n\nclass App"],
    [
      "application.yml",
      "spring:\n  data:\n    mongodb:\n      uri: mongodb://x",
    ],
    ["application.properties", "spring.data.mongodb.uri=mongodb://x"],
  ])("%s", (expected, content) => {
    expect(sniffFileName(content)).toBe(expected);
  });

  it("gives up on text it cannot place", () => {
    expect(sniffFileName("")).toBeUndefined();
    expect(sniffFileName("# README\n\nHello")).toBeUndefined();
  });
});
