module.exports = results => {
  const byRuleId = results.reduce((map, current) => {
    current.messages.forEach(({ ruleId, line, column, message, ...stuff }) => {
      if (!map[ruleId+message]) {
        map[ruleId+message] = {
          rule: ruleId,
          message,
          occurrences: [],
        };
      }

      // const occurrence = `${current.filePath}:${line}:${column}:${message}`;
      const occurrence = {
        file: current.filePath,
        line,
        column,
        message,
      };
      map[ruleId+message].occurrences.push(occurrence);
    });
    return map;
  }, {});

  const enforcedRules = {
    'react-prefer-function-component/react-prefer-function-component' : {
      description: "We prefer function components to class-based components",
    },
    'react/jsx-filename-extension' : {
      description: "We prefer Typescript - all JSX files should be converted to TSX",
    },
    'react/forbid-component-props' : {
      description: "We prefer Emotion for styling rather than `className` or `style` props",
    },
    'no-restricted-imports' : {
      description: "This rule catches several things that shouldn't be used anymore. LESS, antD, enzyme, etc. See individual occurrence messages for details",
    },
  };

  const metricsByRule = Object.entries(byRuleId)
    .filter(([key, value]) => enforcedRules[value.rule] || false)
    .map(
      ([key, value]) => 
      {
        return {
          "eslint rule": value.rule,
          "issue" : enforcedRules[value.rule].description,
          "message" : value.message,
          "count": value.occurrences.length,
          occurrences: value.occurrences,
        }
      }
    );

  const result = {
    "metrics": metricsByRule,
  }
  return JSON.stringify(result, null, 2);
};