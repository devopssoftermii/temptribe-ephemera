function buildAnchor(href, title, text = null) {
  return `<a href="${href}" target="_blank" title="${title}">${text || href}</a>`;
}

module.exports = {
  links: function(text) {
    return text.replace(/(https?\:\/\/([-\w.]+)+(\:\d+)?(\/([\w\/_.%]*(\?[^\s<]+)?)?)?)/ig, function(match) {
      return buildAnchor(match, 'Web link');
    }).replace(/(([%-_\+\w.]+)\@([-\w.]+)+(\:\d+)?(\/([\w\/_.]*)?)?)/ig, function(match) {
      return buildAnchor('mailto:' + match, 'Email link', match);
    }).replace(/(\b\+?[-\d\s]{10,15}\b)/ig, function(match) {
      return buildAnchor('tel:' + match.replace(/[^\d\+]+/ig, ''), 'Phone link', match);
    });
  }
};