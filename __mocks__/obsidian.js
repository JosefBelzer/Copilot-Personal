/**
 * Mock for the Obsidian API.
 * Simulates the minimal surface area needed by the Copilot Personal plugin.
 */

const noop = () => {};

// ----- Event / Component stubs -----
class Events {
  constructor() {
    this._handlers = {};
  }
  on(name, cb) { (this._handlers[name] ??= []).push(cb); }
  off(name, cb) { this._handlers[name] = this._handlers[name]?.filter((f) => f !== cb); }
  trigger(name, ...args) { this._handlers[name]?.forEach((cb) => cb(...args)); }
}

class Component {
  constructor() {
    this._loaded = false;
  }
  onload() { this._loaded = true; }
  onunload() { this._loaded = false; }
  registerEvent() {}
  addChild() {}
}

// ----- HTML element stub for settings -----
class SettingStub {
  constructor(containerEl) { this.containerEl = containerEl; }
  setName() { return this; }
  setDesc() { return this; }
  addText(cb) {
    const input = { setValue() {}, setPlaceholder() { return input; }, onChange(cb2) { input._onChange = cb2; return input; }, value: "" };
    if (cb) cb(input);
    return this;
  }
  addDropdown(cb) {
    const dd = { _options: {}, addOption(k, v) { dd._options[k] = v; return dd; }, setValue() { return dd; }, onChange(cb2) { dd._onChange = cb2; return dd; } };
    if (cb) cb(dd);
    return this;
  }
  addToggle(cb) {
    const toggle = { setValue() { return toggle; }, onChange(cb2) { toggle._onChange = cb2; return toggle; }, value: false };
    if (cb) cb(toggle);
    return this;
  }
  addSlider(cb) {
    const slider = { setLimits() { return slider; }, setValue() { return slider; }, onChange(cb2) { slider._onChange = cb2; return slider; } };
    if (cb) cb(slider);
    return this;
  }
}

// ----- Vault mock -----
let _markdownFiles = [];
let _vaultFiles = {};
let _vaultBinaries = {};

function setMarkdownFiles(files) { _markdownFiles = files; }
function setVaultFile(path, content) { _vaultFiles[path] = content; }
function setVaultBinary(path, arrayBuffer) { _vaultBinaries[path] = arrayBuffer; }
function resetVault() { _markdownFiles = []; _vaultFiles = {}; _vaultBinaries = {}; }

const Vault = {
  getMarkdownFiles: () => _markdownFiles,
  read: async (file) => _vaultFiles[file.path] ?? "",
  readBinary: async (file) => _vaultBinaries[file.path] ?? new ArrayBuffer(0),
  create: async (path, content) => { _vaultFiles[path] = content; return { path }; },
  createFolder: async () => {},
  adapter: {
    exists: async (path) => path in _vaultFiles || Object.keys(_vaultFiles).some((k) => k.startsWith(path + "/")),
    read: async (path) => _vaultFiles[path] ?? null,
    readBinary: async (path) => _vaultBinaries[path] ?? new ArrayBuffer(0),
    write: async (path, content) => { _vaultFiles[path] = content; },
  },
  getFiles: () => Object.keys(_vaultFiles).map((path) => ({ path, name: path.split("/").pop(), basename: path.split("/").pop().replace(/\.md$/i, "") })),
  getAbstractFileByPath: (path) => _vaultFiles[path] !== undefined ? { path } : null,
};

// ----- Plugin stub -----
class Plugin extends Component {
  constructor() {
    super();
    this.app = { vault: Vault, workspace: {} };
    this._data = {};
  }
  async loadData() { return { ...this._data }; }
  async saveData(obj) { this._data = obj; }
  registerView() {}
  addSettingTab() {}
  addRibbonIcon() {}
  addCommand() {}
}

class PluginSettingTab {
  constructor(app, plugin) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = {
      empty() {},
      createEl() {
        return {
          setText() {},
          createDiv() { return { createEl() { return {} }, createDiv() { return {} } }; },
        };
      },
    };
  }
}

// ----- ItemView stub -----
class ItemView {
  constructor(leaf) {
    this.leaf = leaf;
    this.app = { vault: Vault, workspace: { getLeavesOfType() { return []; } } };
    this.containerEl = { children: [{}, { empty() {}, addClass() {} }] };
  }
  getViewType() { return ""; }
  getDisplayText() { return ""; }
  getIcon() { return ""; }
  async onOpen() {}
  async onClose() {}
}

// ----- Other stubs -----
let _requestUrlResponses = {};
function setRequestUrlResponse(url, response) { _requestUrlResponses[url] = response; }
function resetRequestUrl() { _requestUrlResponses = {}; }

const requestUrl = async (opts) => {
  const key = typeof opts === "string" ? opts : opts.url;
  const resp = _requestUrlResponses[key];
  if (!resp) throw new Error(`No mock for requestUrl: ${key}`);
  return {
    status: resp.status ?? 200,
    json: typeof resp.json === "function" ? resp.json() : resp.json,
    text: typeof resp.text === "function" ? resp.text() : (resp.text ?? ""),
  };
};

const Notice = class {
  constructor(msg) { Notice.lastMsg = msg; }
};
Notice.lastMsg = "";

const MarkdownRenderer = {
  render: async (app, markdown, container, sourcePath, component) => {
    container.setText(markdown);
  },
};

const Platform = { isDesktop: true };

class Scope {
  constructor() { this.keys = []; }
  register() {}
}

const WorkspaceLeaf = class {
  constructor() {
    this.view = null;
  }
  setViewState() {}
};

module.exports = {
  Events, Component, Plugin, PluginSettingTab, ItemView,
  Vault, setMarkdownFiles, setVaultFile, setVaultBinary, resetVault,
  requestUrl, setRequestUrlResponse, resetRequestUrl,
  Notice, MarkdownRenderer, Platform, Scope, WorkspaceLeaf,
  Setting: SettingStub,
  TFile: class TFile { constructor(path, basename, stat) { this.path = path; this.basename = basename ?? path; this.stat = stat ?? { mtime: Date.now() }; this.extension = path.split(".").pop(); } },
};
