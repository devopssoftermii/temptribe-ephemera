function buildAnchor(href, title, text = null) {
  return `<a href="${href}" target="_blank" title="${title}">${text || href}</a>`;
}

module.exports = {
  links: function(text) {
    return text.replace(/(https?\:\/\/([-\w.]+)+(\:\d+)?(\/([\w\/_.%]*(\?[^\s<]+)?)?)?)/ig, function(match) {
      return buildAnchor(match, 'Web link');
    }).replace(/([a-z0-9._%+-]+@([a-z0-9.-_]+\.)+[a-z]{2,})/ig, function(match) {
      return buildAnchor('mailto:' + match, 'Email link', match);
    }).replace(/(\+?[-\d\s]{10,15}\b)/ig, function(match) {
      return buildAnchor('tel:' + match.replace(/[^\d\+]+/ig, ''), 'Phone link', match);
    });
  }
};