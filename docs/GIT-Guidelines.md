# PPR - Schulgong - GIT-Guidelines 

<hr>

## :pushpin: General information

This document outlines the appropriate procedures for managing Git commits.

<hr>

## :clipboard: Rules & Handling

### Commit messages

- Line length: < 50 chars
- Starts with uppercase letter
- No punctuation marks
- Between title and description must be a blank line
- Messages must be written in English

### Structure for commit messages

- **add:** For implementing new stuff use
- **update:** For updating source code use
- **feat:** For adding a new feature
- **fix:** For implementing a bug fix
- **refactor:** For refactoring code
- **docs:** For adding documentation related stuff
- **test:** For adding test cases

#### Example

fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss incoming responses other than from latest request.
Remove timeouts which were used to mitigate the racing issue but are obsolete now.

Reviewed-by: Z

Issue: #123
<hr>

### :warning: Issues

- First create an issue on GitHub, after that connect the issue to a
  Trello card.

- The issue number must be on the footer in the commit message.

- Select a label for an issue if possible

- Select assignee if possible

<hr>

### :bug: Bug

When a POST-Request is submitted with an empty Body, an exception will be thrown.

- Screenshot (if possible)

<hr>

### :octocat: Branche's configuration

#### General information

- stable (versions)

- bugfix/feature-name

- feature/feature-name

- main (versions)

Please create for each feature implementation an own branch.

#### Example:

**Create branch:** *feature/swagger-plugin*

**Pull:** main branch into your branch (feature/swagger-plugin).

Implement your feature on your created branch (feature/swagger-plugin).

You must write commits for each step.

**Push:** your branch to GitHub

Create a Pull Request for being allowed to merge into main branch.

#### GitHub-Actions

After the build is successful, create a Pull Request to stable branch.

Close branch: feature/swagger-plugin
