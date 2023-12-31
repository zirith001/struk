import * as vscode from "vscode";
import fs = require("fs");
import { exec } from "child_process";
import path = require("path");

function getDateTime() {
    let currentdate = new Date();
    let datetime =
        currentdate.getDate() +
        "_" +
        (currentdate.getMonth() + 1) +
        "_" +
        currentdate.getFullYear() +
        "_" +
        currentdate.getHours() +
        "_" +
        currentdate.getMinutes() +
        "_" +
        currentdate.getSeconds();
    return datetime;
}

const isWorkspaceOpened = vscode.workspace.workspaceFolders !== undefined
function openFolderBasedOnUserSelection(codeFolder: any){
	if (isWorkspaceOpened){
		vscode.window.showInformationMessage("Successfully Installed, Do you want to open the created project in new window?", "Yes", "No").then(answer=>{
			if (answer==="Yes"){
				vscode.commands.executeCommand(
					"vscode.openFolder",
					vscode.Uri.file(codeFolder),true
				);
			}
			// else {
			// 	vscode.workspace.updateWorkspaceFolders(0, null, {uri: vscode.Uri.file(codeFolder)})
			// }
				
		})
	}
	else {
		vscode.commands.executeCommand(
			"vscode.openFolder",
			vscode.Uri.file(codeFolder),false)

	}
}

export function activate(context: vscode.ExtensionContext) {
    let createTemplateHtmlCssJs = vscode.commands.registerCommand('struk.htm', () => {
        console.log(context.extensionPath);
        vscode.window.showInputBox({ prompt: 'Enter your project folder name' }).then((projectName: string | undefined) => {
            if (!projectName) {
                vscode.window.showErrorMessage('Please enter Project Folder name');
                return;
            }
            if (vscode.workspace.workspaceFolders !== undefined) {
                const wf = vscode.workspace.workspaceFolders[0].uri.fsPath; // Use fsPath instead of path
                const extensionPath = context.extensionPath;
                const projectFolderPath = path.join(wf, projectName);

                // Handle the destination folder path based on the platform
                const isWindows = process.platform === 'win32';
                const dest = isWindows ? projectFolderPath : path.posix.resolve(projectFolderPath);
                const src = path.join(extensionPath, 'templates', 'htmlCssJsTemplate');
                try {
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest);
                    }
                } catch (err) {
                    console.error(err);
                }
                fs.copyFileSync(path.join(src, 'index.html'), path.join(dest, 'index.html'));
                fs.copyFileSync(path.join(src, 'style.css'), path.join(dest, 'style.css'));
                fs.copyFileSync(path.join(src, 'index.js'), path.join(dest, 'index.js'));
                openFolderBasedOnUserSelection(projectFolderPath);
            } else {
                let message = 'Struk: Working folder not found, open a folder and try again';
                vscode.window.showErrorMessage(message);
            }
        });
    });

    let createTemplateHtmlCssBootstrapJs = vscode.commands.registerCommand(
        "struk.bootstrap",
        () => {
            vscode.window
                .showInputBox({ prompt: "Enter your project folder name" })
                .then((projectName: any) => {
                    if (!projectName) {
                        vscode.window.showErrorMessage(
                            "Please enter project folder name"
                        );
                        return;
                    }
                    if (vscode.workspace.workspaceFolders !== undefined) {
                        let wf = vscode.workspace.workspaceFolders[0].uri.fsPath;
                        const extensionPath = context.extensionPath;
                        const projectFolderPath = path.join(wf, projectName);
                        const isWindows = process.platform === 'win32';
                const dest = isWindows ? projectFolderPath : path.posix.resolve(projectFolderPath);
                const src = path.join(extensionPath, 'templates', 'htmlCssJsTemplate');
                try {
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest);
                    }
                        } catch (err) {
                            console.error(err);
                        }
                        fs.copyFile(
                            path.join(
                                extensionPath,
                                "templates",
                                "htmlCssJsTemplate",
                                "index_bootstrap.html"
                            ),
                            path.join(projectFolderPath, "index.html"),
                            (err: any) => {
                                if (err) {
                                    throw err;
                                }
                            }
                        );
                        fs.copyFile(
                            path.join(
                                extensionPath,
                                "templates",
                                "htmlCssJsTemplate",
                                "style.css"
                            ),
                            path.join(projectFolderPath, "style.css"),
                            (err: any) => {
                                if (err) {
                                    throw err;
                                }
                            }
                        );
                        fs.copyFile(
                            path.join(
                                extensionPath,
                                "templates",
                                "htmlCssJsTemplate",
                                "index.js"
                            ),
                            path.join(projectFolderPath, "index.js"),
                            (err: any) => {
                                if (err) {
                                    throw err;
                                }
                            }
                        );
                        openFolderBasedOnUserSelection(projectFolderPath);
                    } else {
                        let message;
                        message =
                            "Struk: Working folder not found, open a folder an try again";
                        vscode.window.showErrorMessage(message);
                    }
                });
        }
    );

    let createTemplateReact = vscode.commands.registerCommand(
        "struk.react",
        () => {
            vscode.window
                .showInputBox({ prompt: "Enter your react project name" })
                .then((projectName: any) => {
                    if (!projectName) {
                        vscode.window.showErrorMessage(
                            "Please enter react project name"
                        );
                        return;
                    }
                    if (vscode.workspace.workspaceFolders !== undefined) {
                        let wf = vscode.workspace.workspaceFolders[0].uri.fsPath;
                        const extensionPath = context.extensionPath;
                        const projectFolderPath = path.join(wf, projectName);

                        const isWindows = process.platform === 'win32';
                        const dest = isWindows ? projectFolderPath : path.posix.resolve(projectFolderPath);
                        const src = path.join(extensionPath, 'templates', 'reactTemplate');
                        try {
                            if (!fs.existsSync(dest)) {
                                fs.mkdirSync(dest);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                        
                        fs.cpSync(src, dest, { recursive: true });
                        vscode.window.withProgress(
                            {
                                location: vscode.ProgressLocation.Notification,
                                title: "Installing node modules",
                                cancellable: false,
                            },
                            async (progress) => {
                                return new Promise(async (resolve, reject) => {
                                    const commands = [
                                        "npm init -y",
                                        "npm install --save-dev parcel-bundler",
                                        "npm install react react-dom",
                                    ];

                                    let completedCommands = 0;
                                    const totalCommands = commands.length;

                                    try {
                                        for (const command of commands) {
                                            await execCommand(
                                                command,
                                                projectFolderPath
                                            );
                                            completedCommands++;

                                            // Update the progress
                                            progress.report({
                                                message: `Installing node module ${completedCommands}/${totalCommands}`,
                                                increment: 100 / totalCommands,
                                            });

                                            if (
                                                completedCommands ===
                                                totalCommands
                                            ) {
                                                // Read package.json and write: "start": "parcel public/index.html --open" in scripts section
                                                let packageJsonPath = path.join(
                                                    projectFolderPath,
                                                    "package.json"
                                                );
                                                let packageJsonData = require(packageJsonPath);
                                                packageJsonData["scripts"][
                                                    "start"
                                                ] =
                                                    "parcel " +
                                                    path
                                                        .join(
                                                            "public",
                                                            "index.html"
                                                        )
                                                        .toString() +
                                                    " --open";

                                                // Write the updated package.json using fs.promises.writeFile
                                                await fs.promises.writeFile(
                                                    packageJsonPath,
                                                    JSON.stringify(
                                                        packageJsonData,
                                                        null,
                                                        2
                                                    )
                                                );
                                                vscode.window.showInformationMessage(
                                                    `Node modules installed successfully inside ${projectName}`
                                                );
                                                await openFolderBasedOnUserSelection(projectFolderPath);
                                                

                                                resolve(undefined);
                                            }
                                        }
                                    } catch (error) {
                                        console.error(
                                            "Error executing command:"
                                        );
                                        vscode.window.showErrorMessage(
                                            "Error installing node modules"
                                        );
                                        reject(error);
                                    }
                                });
                            }
                        );

                        function execCommand(command: string, cwd: any) {
                            return new Promise((resolve, reject) => {
                                exec(
                                    command,
                                    { cwd },
                                    (error, stdout, stderr) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            resolve(undefined);
                                        }
                                    }
                                );
                            });
                        }
                    }
                    else {
                        let message;
                        message =
                            "Struk: Working folder not found, open a folder an try again";
                        vscode.window.showErrorMessage(message);
                    }
                });
        }
    );

    
    let createTemplatePython = vscode.commands.registerCommand(
        "struk.python",
        () => {
            vscode.window
                .showInputBox({ prompt: "Enter your project folder name" })
                .then((projectName: any) => {
                    if (!projectName) {
                        vscode.window.showErrorMessage(
                            "Please enter project folder name"
                        );
                        return;
                    }

                    if (vscode.workspace.workspaceFolders !== undefined) {
                        let wf = vscode.workspace.workspaceFolders[0].uri.fsPath;
                        const projectFolderPath = path.join(wf, projectName);
                        const isWindows = process.platform === 'win32';
                        const dest = isWindows ? projectFolderPath : path.posix.resolve(projectFolderPath);
                        try {
                            if (!fs.existsSync(dest)) {
                                fs.mkdirSync(dest);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                        fs.writeFile(
                            path.join(
                                projectFolderPath,
                                `file_${getDateTime()}.py`
                            ),
                            "",
                            function (err) {
                                if (err) {
                                    throw err;
                                }
                            }
                        );

                        vscode.window.withProgress(
                            {
                                location: vscode.ProgressLocation.Notification,
                                title: "Creating virtual environment: venv",
                                cancellable: false,
                            },
                            (progress) => {
                                return new Promise<void>((resolve, reject) => {
                                    const commands = ["python -m venv venv"];

                                    let completedCommands = 0;

                                    commands.forEach((command) => {
                                        exec(
                                            command,
                                            { cwd: projectFolderPath },
                                            (error, stdout, stderr) => {
                                                if (error) {
                                                    console.error(
                                                        `Error installing venv: ${command}`
                                                    );
                                                    console.error(
                                                        error.message
                                                    );
                                                    vscode.window.showErrorMessage(
                                                        `Error installing venv: ${command}`
                                                    );
                                                }

                                                completedCommands++;

                                                if (
                                                    completedCommands ===
                                                    commands.length
                                                ) {
                                                    vscode.window.showInformationMessage(
                                                        `Virtual Environment installed successfully.`
                                                    );
                                                    resolve();
                                                }
                                            }
                                        );
                                    });
                                });
                            }).then(()=>{openFolderBasedOnUserSelection(projectFolderPath)});
                    } else {
                        let message;
                        message =
                            "Struk: Working folder not found, open a folder an try again";
                        vscode.window.showErrorMessage(message);
                    }
                });
        }
    );

    context.subscriptions.push(createTemplateHtmlCssJs);
    context.subscriptions.push(createTemplateHtmlCssBootstrapJs);
    context.subscriptions.push(createTemplateReact);
    context.subscriptions.push(createTemplatePython);
}

export function deactivate() { }
