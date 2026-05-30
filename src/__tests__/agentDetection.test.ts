/**
 * Tests for agent response parsing — looksLikePlanning (planning detection),
 * sanitizeAgentResponse (XML stripping), and hallucination detection.
 *
 * These functions are file-scoped in AgentModeRunner.ts and chatView.ts,
 * so we test them through pattern matching and the public API where possible.
 */

// We can't directly import file-scoped functions, but we can test
// the patterns they use. For chatView's sanitizeAgentResponse and
// looksLikeCompletionClaim, we extract the regex patterns for testing.

describe("looksLikePlanning — planning detection patterns", () => {
  // These patterns mirror those in looksLikePlanning() in AgentModeRunner.ts

  test("detects 'Voy a leer/extraer/buscar/actualizar...' as planning", () => {
    const pattern = /voy\s+a\s+(leer|extraer|buscar|actualizar|crear|modificar|revisar|comparar|verificar|analizar|comprobar)/i;

    expect(pattern.test("Voy a leer la nota actual")).toBe(true);
    expect(pattern.test("Voy a actualizar la nota")).toBe(true);
    expect(pattern.test("Voy a extraer el contenido")).toBe(true);
    expect(pattern.test("voy a buscar el archivo")).toBe(true);
    expect(pattern.test("Voy a comparar los resultados")).toBe(true);
  });

  test("detects 'Ahora voy/necesito/debo...' as planning", () => {
    const pattern = /ahora\s+(voy|necesito|debo|tengo|procedo|actualizaré|leeré|buscaré|crearé)/i;

    expect(pattern.test("Ahora voy a actualizar la nota")).toBe(true);
    expect(pattern.test("Ahora necesito leer el PDF")).toBe(true);
    expect(pattern.test("ahora debo verificar el contenido")).toBe(true);
    expect(pattern.test("Ahora actualizaré la nota")).toBe(true);
  });

  test("detects 'Para poder verificar/completar...' as planning", () => {
    const pattern = /para\s+poder\s+(verificar|completar|actualizar)|necesito\s+(leer|saber|extraer|buscar)/i;

    expect(pattern.test("Para poder verificar la nota")).toBe(true);
    expect(pattern.test("Para poder completar la tarea")).toBe(true);
    expect(pattern.test("necesito leer el contenido")).toBe(true);
    expect(pattern.test("Necesito saber qué contiene")).toBe(true);
  });

  test("detects hallucinated completion claims as planning", () => {
    const pattern = /\b(ha\s+sido\s+(actualizada|creada|modificada|guardada|escrita|completada)|ahora\s+deber[ií]as?\s+ver|los\s+cambios\s+(est[áa]n|fueron)\s+(reflejados|aplicados|realizados))\b/i;

    expect(pattern.test("La nota ha sido actualizada")).toBe(true);
    expect(pattern.test("ha sido creada exitosamente")).toBe(true);
    expect(pattern.test("Ahora deberías ver los cambios")).toBe(true);
    expect(pattern.test("ahora deberías ver el resultado")).toBe(true);
    expect(pattern.test("Los cambios están reflejados")).toBe(true);
    expect(pattern.test("los cambios fueron aplicados")).toBe(true);
  });

  test("detects English 'let me / I'll / I need to...' as planning", () => {
    const pattern = /\b(let\s+me|i('ll| will)|i need to|i must|i have to|i should|i can|i('m| am) going to)\s+(read|extract|search|find|update|create|modify|check|verify|compare|analyze|look|fetch|get|pull)\b/i;

    expect(pattern.test("Let me read the note")).toBe(true);
    expect(pattern.test("I'll extract the content")).toBe(true);
    expect(pattern.test("I need to search the vault")).toBe(true);
    expect(pattern.test("I should update the file")).toBe(true);
    expect(pattern.test("I am going to check the PDF")).toBe(true);
  });

  test("does NOT flag genuine content as planning", () => {
    const pattern = /voy\s+a\s+(leer|extraer|buscar|actualizar|crear|modificar|revisar|comparar|verificar|analizar|comprobar)/i;

    // Real content, not planning
    expect(pattern.test("El contenido extraído del PDF muestra que Qualität es importante")).toBe(false);
    expect(pattern.test("La nota contiene información sobre Qualität als Erfolgsfaktor")).toBe(false);
    expect(pattern.test("Basado en los resultados obtenidos")).toBe(false);
  });

  test("detects 'He leído...' after reading as planning for next step", () => {
    const pattern = /he\s+le[íi]do/i;
    expect(pattern.test("He leído la nota actual")).toBe(true);
    expect(pattern.test("He leído el PDF completo")).toBe(true);
  });
});

describe("sanitizeAgentResponse — XML tag stripping", () => {
  // These patterns mirror those in sanitizeAgentResponse() in chatView.ts

  function sanitize(text: string): string {
    return text
      .replace(/<tool_code>[\s\S]*?<\/tool_code>/g, "")
      .replace(/<tool_call>[\s\S]*?<\/tool_call>/g, "")
      .replace(/<environment_details>[\s\S]*?<\/environment_details>/g, "")
      .replace(/<environment_details>[\s\S]*/g, "")
      .replace(/<tool_code>[\s\S]*/g, "")
      .replace(/<tool_call>[\s\S]*/g, "")
      .trim();
  }

  test("strips complete <environment_details> blocks", () => {
    const input = "Answer text\n<environment_details>\nCurrent time: 2026-05-19\nWorking dir: /\n</environment_details>\nMore text";
    const result = sanitize(input);
    expect(result).toBe("Answer text\n\nMore text");
  });

  test("strips unclosed <environment_details> tags", () => {
    const input = "Answer\n<environment_details>\nCurrent time: 2026-05-19\nWorking dir: /";
    const result = sanitize(input);
    expect(result).toBe("Answer");
  });

  test("strips <tool_code> blocks", () => {
    const input = "Before\n<tool_code>\nprint('hello')\n</tool_code>\nAfter";
    const result = sanitize(input);
    expect(result).toBe("Before\n\nAfter");
  });

  test("strips <tool_call> XML blocks", () => {
    const input = "Text\n<tool_call>{\"name\": \"read_note\"}</tool_call>\nMore";
    const result = sanitize(input);
    expect(result).toBe("Text\n\nMore");
  });

  test("preserves normal content without tags", () => {
    const input = "# Heading\n\nNormal paragraph with **bold** and *italic*.\n\n- List item 1\n- List item 2";
    const result = sanitize(input);
    expect(result).toBe(input);
  });

  test("handles empty input", () => {
    expect(sanitize("")).toBe("");
    expect(sanitize("   ")).toBe("");
  });
});

describe("looksLikeCompletionClaim — hallucination detection", () => {
  // These patterns mirror those in looksLikeCompletionClaim() in chatView.ts

  function looksLikeCompletionClaim(text: string): boolean {
    if (!text) return false;
    const lower = text.toLowerCase();

    if (/\b(ha\s+sido\s+(actualizada|creada|modificada|guardada|escrita|completada|generada|renombrada))\b/i.test(text)) return true;
    if (/\b(la\s+nota\s+(ha\s+sido|fue|est[aá])\s+(actualizada|creada|modificada|guardada))\b/i.test(text)) return true;
    if (/\b(ahora\s+deber[ií]as?\s+ver\s+(los\s+cambios|el\s+resultado|la\s+actualizaci[oó]n))\b/i.test(text)) return true;
    if (/\b(los\s+cambios\s+(est[áa]n|fueron|han\s+sido)\s+(reflejados|aplicados|realizados|guardados))\b/i.test(text)) return true;
    if (/\b(actualizaci[oó]n\s+(completada|exitosa|realizada|finalizada))\b/i.test(text)) return true;

    if (/\b(has\s+been\s+(updated|created|modified|saved|written|completed|generated))\b/i.test(text)) return true;
    if (/\b(the\s+note\s+(has\s+been|was|is\s+now)\s+(updated|created|modified|saved))\b/i.test(text)) return true;
    if (/\b(you\s+should\s+now\s+see\s+(the\s+changes|the\s+result|the\s+update))\b/i.test(text)) return true;
    if (/\b(changes\s+(are|have\s+been|were)\s+(reflected|applied|made|saved))\b/i.test(text)) return true;
    if (/\b(update\s+complete|successfully\s+(updated|saved|created))\b/i.test(text)) return true;

    return false;
  }

  test("detects Spanish hallucinated completion claims", () => {
    expect(looksLikeCompletionClaim("La nota ha sido actualizada")).toBe(true);
    expect(looksLikeCompletionClaim("la nota fue modificada correctamente")).toBe(true);
    expect(looksLikeCompletionClaim("La nota está guardada")).toBe(true);
    expect(looksLikeCompletionClaim("Los cambios están reflejados")).toBe(true);
    expect(looksLikeCompletionClaim("los cambios fueron aplicados")).toBe(true);
    expect(looksLikeCompletionClaim("Actualización completada exitosamente")).toBe(true);
    expect(looksLikeCompletionClaim("Ahora deberías ver los cambios")).toBe(true);
  });

  test("detects English hallucinated completion claims", () => {
    expect(looksLikeCompletionClaim("The note has been updated")).toBe(true);
    expect(looksLikeCompletionClaim("has been created successfully")).toBe(true);
    expect(looksLikeCompletionClaim("You should now see the changes")).toBe(true);
    expect(looksLikeCompletionClaim("Changes have been applied")).toBe(true);
    expect(looksLikeCompletionClaim("Update complete")).toBe(true);
  });

  test("does NOT flag legitimate statements", () => {
    expect(looksLikeCompletionClaim("El PDF contiene información sobre calidad")).toBe(false);
    expect(looksLikeCompletionClaim("La nota existente menciona ISO 9001")).toBe(false);
    expect(looksLikeCompletionClaim("Basado en los resultados, la nota es incompleta")).toBe(false);
    expect(looksLikeCompletionClaim("The note contains relevant information")).toBe(false);
    expect(looksLikeCompletionClaim("")).toBe(false);
  });
});
