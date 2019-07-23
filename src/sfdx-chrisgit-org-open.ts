// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';
const outputWindow = require('./vs-code-output-window');

const opn = require('opn');
const childProcess = require('child_process');

// OS Detection
const EXT_OS_WINDOWS = 'win32';
const EXT_OS_LINUX = 'linux';
const EXT_OS_MACOS = 'darwin';

const EXT_OS_PLATFORM: string = os.platform().toLowerCase();

const EXT_IS_WINDOWS: boolean = (EXT_OS_PLATFORM === EXT_OS_WINDOWS);
const EXT_IS_LINUX: boolean = (EXT_OS_PLATFORM === EXT_OS_LINUX);
const EXT_IS_MACOS: boolean = (EXT_OS_PLATFORM === EXT_OS_MACOS);

async function promptForSalesforceAlias() {
  // TODO: Retrieve a list of orgs and show as picklist
  const value = await vscode.window.showInputBox({ prompt: 'Please enter an SFDX alias or leave blank for default' });
  if (value === undefined) {
    return;
  }
  return value;
}

function getSupportedBrowsers() {
  if (EXT_IS_WINDOWS) {
    return ['default', 'iexplore', 'edge', 'chrome', 'chromium', 'firefox', 'safari', 'opera'];
  } else if (EXT_IS_LINUX) {
    return ['default', 'google-chrome', 'chromium', 'firefox', 'safari', 'opera'];
  } else if (EXT_IS_MACOS) {
    return ['default', 'google chrome', 'chromium', 'firefox', 'safari', 'opera'];
  }
  return ['default', 'chrome', 'firefox'];
}

async function promptForBrowser() {
  let browsers = getSupportedBrowsers();
  const value = await vscode.window.showQuickPick(browsers, { placeHolder: 'Please select a browser' });
  return value;
}

function runOrgOpen(salesforceOrg: string, browser: string) {
  let orgParameter = salesforceOrg === '' ? '' : `-u ${salesforceOrg}`;
  outputWindow.info('Running Salesforce Org Open in Browser (chrisgit)');
  let sfdxCommand = `sfdx force:org:open ${orgParameter} -r --json`;
  outputWindow.info(sfdxCommand);
  childProcess.exec(sfdxCommand, { cwd: vscode.workspace.rootPath }, (err: any, stdout: any, stderr: any) => {
    // Check for errors
    if (stderr && err) {
      outputWindow.error(stderr);
    } else {
      outputWindow.info(stdout);
      let sfdxOutput = JSON.parse(stdout);
      if (sfdxOutput.status === 0) {
        let salesforceOrgUrl = sfdxOutput.result.url;
        vscode.window.showInformationMessage(`Attempting to launch ${salesforceOrg} in ${browser}`);
        if (browser === 'default') {
          opn(salesforceOrgUrl, { wait: false });
        } else if (browser === 'edge') {
          opn(`microsoft-edge:${salesforceOrgUrl}`, { wait: false });
        } else {
          opn(salesforceOrgUrl, { app: browser, wait: false });
        }
      }
    }
  });
}

export const chrisgitOrgOpen = (): void => {
  promptForSalesforceAlias().then((org) => {
    if (org === undefined) {
      return;
    }
    promptForBrowser().then((browser) => {
      if (browser === undefined) {
        return;
      }
      runOrgOpen(org, browser);
    });
  });
};
