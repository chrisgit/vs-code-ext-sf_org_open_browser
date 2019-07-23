// Class to wrap VS Code output window
import * as vscode from 'vscode';

const WINDOW_NAME = 'SFDX chrisgit';

class OutputWindow {

  static windowReference = vscode.window.createOutputChannel(WINDOW_NAME);

  static create() {
  }

  static info(message: string) {
    this.windowReference.appendLine(`[Info - ${(new Date().toLocaleTimeString())}] ${message}`);
    this.windowReference.show();
  }

  static error(message: string) {
    this.windowReference.appendLine(`[Error - ${(new Date().toLocaleTimeString())}] ${message}`);
    this.windowReference.show();
  }
}

module.exports = OutputWindow;
