var helpers = require("postcss-message-helpers");
var postCss = require('postcss');
var flex = require('./src/flex');

module.exports = postCss.plugin('flex', function plugin(opts) {
  return function(style) {

    style.eachAtRule(function(rule) {
      console.log('atrule', rule);
    });

    style.eachRule(function transformRule(rule) {
      var continueProcessing = true;
      var processed;
      rule.eachDecl(function transformDecl(decl) {
        helpers.try(function helperTry() {
          if (decl.prop === 'display' && decl.value === 'flex' && continueProcessing) {
            processed = flex.process(decl.parent);
            continueProcessing = false;
          }
        }, decl.source);
      });
      if (processed) {
        console.log(rule.selector);
        if (processed.rule.length) {
          rule.nodes = processed.rule;
          // rule.removeAll();
          // processed.rule.map(function(decl) {
          //   rule.append(decl);
          // });
        }

        if (processed.atRule.length) {
          var newAtInsideRule = postCss.rule({
            nodes: processed.atRule,
            selector: rule.selector
          });

          // console.log('newone', newAtInsideRule);

          var newAtOutsideRule = postCss.atRule({
            nodes: [newAtInsideRule],
            name: 'supports',
            before: rule.before,
            after: rule.after,
            between: rule.between,
            params: '(display: flex)'
          });

          console.log('newatrule', newAtOutsideRule);

          newAtOutsideRule.moveAfter(rule);
        }

        if (processed.childRule.length) {
          var childRule = rule.cloneAfter({
            nodes:processed.childRule,
            selector: rule.selector + " > *"
          });

          // childRule.moveAfter(rule);
        }

      }
      else {
        console.log('lol no');
      }
    });
  };
});
