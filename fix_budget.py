path = r"C:\Proyecto Copilot Obsidian\copilot-personal\src\services\BudgetManager.ts"
with open(path, encoding="utf-8") as f:
    c = f.read()
if "requestUrl" not in c:
    c = c.replace("export class BudgetManager {", "import { requestUrl } from \"obsidian\";\n\nexport class BudgetManager {")
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
print("OK")
