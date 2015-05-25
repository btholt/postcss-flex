var postCss = require('postcss');

module.exports = {
  process: function(parent) {
    if (!parent) {
      return {atRule:[],rule:[],childRule:[]};
    }

    var atRule = [];
    var newRule = [];
    var childRule = [
      postCss.decl({prop:'display', value: 'inline-block'})
    ];

    console.log(parent === undefined);
    parent.eachDecl(function declFlexTransform(decl) {
      switch (decl.prop) {
        case 'display':
          console.log('display');
          atRule.push(postCss.decl({prop: 'display', value:'flex'}));
          newRule.push(postCss.decl({prop: 'display', value:'table'}));
          newRule.push(postCss.decl({prop: 'width', value:'100%'}));
          break;
        case 'justify-content':
          console.log('justify-content');
          atRule.push(postCss.decl({prop:'justify-content', value:decl.value}));
          newRule.push(postCss.decl(this._justifyContent(decl.value)));
          break;
        case 'align-items':
          console.log('align-items');
          atRule.push(postCss.decl({prop: 'align-items', value: decl.value}));
          childRule.push(postCss.decl(this._alignItems(decl.value)));
          break;
        default:
          console.log('other:', decl.prop);
          newRule.push(decl);
          break;
      }

    }.bind(this));

    // var wrappedRule = postCss.rule({nodes: newRule});

    return { atRule: atRule, rule: newRule, childRule:childRule };
  },
  _justifyContent: function(value) {
    switch (value) {
      case 'flex-start':
        return {prop: 'text-align', value: 'left'};
        break;
      case 'flex-end':
        return {prop: 'text-align', value: 'right'};
        break;
      case 'center':
        return {prop: 'text-align', value: 'center'};
        break;
      case 'space-between':
        // TODO make work with PostCSS helpers
        console.warn('space-between not yet supported, using center');
        return {prop: 'text-align', value: 'center'};
        break;
      case 'space-around':
        // TODO make work with PostCSS helpers
        console.warn('space-around not yet supported, using center');
        return {prop: 'text-align', value: 'center'};
        break;
      default:
        // TODO make work with PostCSS helpers
        console.warn('improper value given for justify-content, using center');
        return {prop: 'text-align', value: 'center'};
        break;
    }
  },
  _alignItems: function(value) {
    switch (value) {
      case 'flex-start':
        return {prop: 'vertical-align', value: 'top'};
        break;
      case 'flex-end':
        return {prop: 'vertical-align', value: 'bottom'};
        break;
      case 'center':
        return {prop: 'vertical-align', value: 'middle'};
        break;
      case 'stretch':
        // TODO make work with PostCSS helpers
        console.warn('stretch not yet supported, using center');
        return {prop: 'vertical-align', value: 'middle'};
        break;
      case 'baseline':
        // TODO make work with PostCSS helpers
        console.warn('baseline not yet supported, using CSS table\'s baseline');
        return {prop: 'vertical-align', value: 'baseline'};
        break;
      default:
        // TODO make work with PostCSS helpers
        console.warn('improper value given for justify-content, using baseline');
        return {prop: 'vertical-align', value: 'baseline'};
        break;
    }
  },
};
