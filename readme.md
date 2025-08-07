# 🧠 ghcli – GitHub CLI powered by AI

`ghcli` is a command-line tool designed to simplify working with Git and GitHub, including automatic *commit* message generation using OpenAI, repository cloning, viewing repository status, and more.

> 🚀 Built for developers who want to automate common tasks with a touch of intelligence.

---

## 📦 Installation

```bash
npm install -g @xhris-carrasc/ghcli@beta
```

> Make sure you have [Node.js](https://nodejs.org/) installed.

---

## 🧰 Available Commands

You can see all available commands with:

```bash
gh help
```

### 📘 Command List

| Command             | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `gh cl <url>`       | Lists your GitHub repos and lets you clone the ones you want.      |
| `gh config get-key` | Displays the current OpenAI key (masked).                          |
| `gh config set-key` | Saves your OpenAI key for commit generation.                       |
| `gh dir`            | Lists the contents of the current directory.                       |
| `gh help`           | Displays all available commands.                                   |
| `gh oco`            | Generates and pushes a smart commit using the OpenAI API.          |
| `gh stash`          | Allows you to apply `git stash` to selected files before a commit. |
| `gh status`         | Shows the status of the current Git repository.                    |

---

## 🤖 Smart Commit with AI

One of the most powerful features is generating commit messages based on modified files.

### 💡 Example:

```bash
gh oco
```

This command:

* Analyzes the files in *staging* (`git add ...`)
* Uses OpenAI to generate a clear and concise message per file
* Creates a single commit with all the changes, including multi-line messages like:

```
(AgNewsletterSection.vue): apply uppercase class to subtitle
(contacto.json): update email addresses
(libro/[...slug].vue): adjust text size for responsiveness
```

> Note: You must configure your OpenAI key before using it.

---

## 🔐 Configure OpenAI Key

```bash
gh config set-key <your-api-key>
```

You can check if it's configured with:

```bash
gh config get-key
```

---

## 🧪 Beta Version

This tool is under active development. If you'd like to contribute or report bugs:

* [GitHub Repository](https://github.com/xhris-carrasc/ghcli) *(adjust if private or local)*
* `npm info @xhris-carrasc/ghcli`

---

## 🧪 Local Development

If you're developing and want to test locally:

```bash
npm link
gh help
```

To undo the link:

```bash
npm unlink -g
```

---
## ⚖️ License

MIT © [@xhris-carrasc](https://github.com/xhris-carrasc)

