import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Register the command
  const command = vscode.commands.registerCommand(
    "extension.addFilePathComment",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      const document = editor.document;

      // Check if the file is a PHP file
      if (document.languageId !== "php") {
        vscode.window.showWarningMessage(
          "This command only works with PHP files!"
        );
        return;
      }

      const filePath = document.uri.fsPath; // Get the file's full path
      const comment = `// ${filePath}\n`; // Prepare the comment line

      editor.edit((editBuilder) => {
        const firstLine = document.lineAt(0);

        // Add the comment at the top if not already present
        if (!firstLine.text.startsWith("//")) {
          editBuilder.insert(new vscode.Position(0, 0), comment);
        } else {
          vscode.window.showInformationMessage(
            "File path already present as a comment."
          );
        }
      });
    }
  );

  context.subscriptions.push(command);
}

export function deactivate() {
  // Clean up resources on deactivation if necessary
}
