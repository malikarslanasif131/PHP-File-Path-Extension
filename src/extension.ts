import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.addFilePathComment",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor && editor.document.languageId === "php") {
        const filePath = editor.document.uri.fsPath;
        const comment = `// ${filePath}`;

        const edit = new vscode.WorkspaceEdit();
        const firstLine = new vscode.Position(0, 0);

        // Check if the first line already contains the comment
        const firstLineText = editor.document.lineAt(0).text;
        if (!firstLineText.startsWith("//")) {
          edit.insert(editor.document.uri, firstLine, comment + "\n");
          await vscode.workspace.applyEdit(edit);

          // Auto-save the file
          await editor.document.save();

          vscode.window.showInformationMessage(
            "File path added and file saved."
          );
        } else {
          vscode.window.showWarningMessage(
            "The first line already contains a comment. No changes made."
          );
        }
      } else {
        vscode.window.showErrorMessage(
          "This command can only be used on PHP files."
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  const editor = vscode.window.activeTextEditor;
  if (editor && editor.document.languageId === "php") {
    const firstLineText = editor.document.lineAt(0).text;

    if (firstLineText.startsWith("//")) {
      const edit = new vscode.WorkspaceEdit();
      const firstLine = new vscode.Range(0, 0, 0, firstLineText.length);

      edit.delete(editor.document.uri, firstLine);
      vscode.workspace.applyEdit(edit).then(() => {
        editor.document.save();
      });
    }
  }

  vscode.window.showInformationMessage("PHP File Path extension deactivated.");
}
