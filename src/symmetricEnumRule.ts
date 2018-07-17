import * as ts from 'typescript'
import * as Lint from 'tslint'

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Enum member must have its value as string name of it.'

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new SymmetricEnumWalker(sourceFile, this.getOptions()))
  }
}

function checkSymmetricity(
  identifierNode: ts.Identifier,
  stringLiteral: ts.StringLiteral,
): boolean {
  return identifierNode.getText() === stringLiteral.text
}

class SymmetricEnumWalker extends Lint.RuleWalker {
  public visitEnumMember(node: ts.EnumMember) {
    if (this.isValidTarget()) {
      const children = node.getChildren()
      const length = children.length

      if (length === 3) {
        const nameNode = children[0]
        const stringNode = children[2]

        if (
          nameNode.kind === ts.SyntaxKind.Identifier &&
          stringNode.kind === ts.SyntaxKind.StringLiteral
        ) {
          if (!checkSymmetricity(
            nameNode as ts.Identifier,
            stringNode as ts.StringLiteral,
          )) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING))
          }
        }
      }
    }
    super.visitEnumMember(node)
  }

  private isValidTarget(): boolean {
    const optionList = this.getOptions()

    if (optionList instanceof Array && optionList.length >= 1) {
      const options = optionList[0]

      if ('path' in options) {
        const path = options.path
        const fileName = this.getSourceFile().fileName

        if (typeof path === 'string') {
          const regex = new RegExp(path)
          return regex.test(fileName)
        }
      }
    }
    return true
  }
}
