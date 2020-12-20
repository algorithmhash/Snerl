// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const perlSnippets = require('../snippets/perl.json');


type Snippet = {
  body: Array<string> | string;
  description: string;
  prefix: Array<string> | string;
};

const convertSnippetArrayToString = (snippetArray: Array<string>): string =>
  snippetArray.join('\n');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Snerl is now activated. Enjoy.')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'extension.snippetSearch',
    async () => {
      const perlSnippetsObject = Object.entries(perlSnippets as Array<Snippet>)
      const snippetsArray: Array<[string, Snippet]> = perlSnippetsObject;

      const items = snippetsArray.map(
        ([shortDescription, { prefix, body, description }], index) => {
          const value = typeof prefix === 'string' ? prefix : prefix[0]

          return {
            id: index,
            description: description || shortDescription,
            label: value,
            value,
            body,
          }
        }
      )

      const options = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Search for perl snippet',
      }

      const snippet = (await vscode.window.showQuickPick(items, options)) || {
        body: '',
      }
      const activeTextEditor = vscode.window.activeTextEditor
      const body =
        typeof snippet.body === 'string'
          ? snippet.body
          : convertSnippetArrayToString(snippet.body)
      activeTextEditor &&
        activeTextEditor.insertSnippet(new vscode.SnippetString(body))
    }
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}