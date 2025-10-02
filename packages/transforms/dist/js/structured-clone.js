import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { FindingBuilder } from '@baseline-surgeon/core';
export const structuredCloneTransform = {
    id: 'js.structured-clone',
    title: 'structuredClone polyfill',
    featureIds: ['structured-clone'],
    detect(ctx) {
        if (ctx.language !== 'javascript' && ctx.language !== 'typescript') {
            return [];
        }
        if (!ctx.ast) {
            return [];
        }
        const findings = [];
        traverse(ctx.ast, {
            CallExpression(path) {
                const { node } = path;
                // Look for structuredClone() calls
                if (t.isIdentifier(node.callee) &&
                    node.callee.name === 'structuredClone') {
                    const finding = FindingBuilder.fromBabelNode(ctx.filePath, node, 'structured-clone', 'js.structured-clone', ctx.content, 'Usage of structuredClone() detected');
                    findings.push(finding);
                }
            }
        });
        return findings;
    },
    canApply(finding, target, baseline) {
        // Only apply if structuredClone is not baseline for the target
        return !baseline.isBaseline('structured-clone', target);
    },
    apply(ctx, finding) {
        if (!ctx.ast) {
            return {
                success: false,
                error: 'No AST available',
                changes: []
            };
        }
        try {
            let hasImport = false;
            let hasChanges = false;
            const changes = [];
            // First, check if we already have the import
            traverse(ctx.ast, {
                ImportDeclaration(path) {
                    const source = path.node.source.value;
                    if (source.includes('structured-clone')) {
                        hasImport = true;
                    }
                }
            });
            // Add import if not present
            if (!hasImport) {
                const importDecl = t.importDeclaration([t.importSpecifier(t.identifier('structuredClone'), t.identifier('structuredClone'))], t.stringLiteral('@baseline-surgeon/polyfills/structured-clone'));
                // Add to the beginning of the program
                ctx.ast.program.body.unshift(importDecl);
                hasChanges = true;
                changes.push({
                    type: 'add',
                    line: 1,
                    content: "import { structuredClone } from '@baseline-surgeon/polyfills/structured-clone';",
                    reason: 'Added structuredClone polyfill import'
                });
            }
            // Transform calls to use the polyfill
            traverse(ctx.ast, {
                CallExpression(path) {
                    const { node } = path;
                    if (t.isIdentifier(node.callee) &&
                        node.callee.name === 'structuredClone' &&
                        node.loc &&
                        node.loc.start.line === finding.loc.line) {
                        // The call is already using the identifier, no need to change it
                        // The import will ensure it uses the polyfill
                        hasChanges = true;
                        changes.push({
                            type: 'modify',
                            line: node.loc.start.line,
                            content: 'Uses polyfilled structuredClone',
                            reason: 'Updated to use polyfilled structuredClone'
                        });
                    }
                }
            });
            const result = generate(ctx.ast, {
                retainLines: true,
                compact: false
            });
            return {
                success: true,
                content: result.code,
                changes
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to apply transform: ${error}`,
                changes: []
            };
        }
    },
    explain(finding) {
        return `The structuredClone() API provides a way to deep clone objects, but it's not available in older browsers. This transform adds a polyfill that handles most common cases including objects, arrays, Date, RegExp, Map, and Set. See: https://developer.mozilla.org/docs/Web/API/structuredClone`;
    }
};
//# sourceMappingURL=structured-clone.js.map