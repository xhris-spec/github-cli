export class CommitTypeDetector {
    static detect(diff) {
        const rules = [
            { keyword: 'fix', match: /bug|error|fix|patch/i },
            { keyword: 'feat', match: /add|feature|new|implement/i },
            { keyword: 'refactor', match: /refactor|restructure/i },
            { keyword: 'docs', match: /doc|readme/i },
            { keyword: 'test', match: /test|unit/i },
            { keyword: 'style', match: /style|format|lint/i },
            { keyword: 'chore', match: /chore|update dependency|bump/i }
        ];

        for (const rule of rules) {
            if (rule.match.test(diff)) {
                return rule.keyword;
            }
        }

        return 'chore';
    }
}
